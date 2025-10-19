const express = require('express');
const axios = require('axios');
const router = express.Router();

// JWT 인증 미들웨어
const { authenticateToken } = require('../middleware/auth');

/**
 * 대시보드 통계 데이터 조회
 * GET /api/dashboard/stats
 */
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // 모든 투자비 요청 데이터 조회
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items?expand=fields&$top=1000`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    const investments = response.data.value;
    
    // 승인 상태별 통계
    const statusStats = calculateStatusStats(investments);
    
    // 법인별 투자비 합계
    const companyStats = calculateCompanyStats(investments);
    
    // 월별 투자비 추이
    const monthlyStats = calculateMonthlyStats(investments);
    
    // 카테고리별 통계
    const categoryStats = calculateCategoryStats(investments);

    res.json({
      success: true,
      data: {
        statusStats,
        companyStats,
        monthlyStats,
        categoryStats,
        totalInvestments: investments.length,
        totalAmount: investments.reduce((sum, item) => sum + (parseFloat(item.fields.Amount) || 0), 0)
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error.response?.data || error.message);
    res.status(500).json({
      error: '대시보드 통계 조회에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 최근 투자비 요청 목록 조회
 * GET /api/dashboard/recent
 */
router.get('/recent', authenticateToken, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items?expand=fields&$top=${limit}&$orderby=Created desc`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data.value
    });

  } catch (error) {
    console.error('Recent investments error:', error.response?.data || error.message);
    res.status(500).json({
      error: '최근 투자비 요청 조회에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 승인 상태별 통계 계산
 */
function calculateStatusStats(investments) {
  const stats = {
    Pending: { count: 0, amount: 0 },
    Approved: { count: 0, amount: 0 },
    Rejected: { count: 0, amount: 0 }
  };

  investments.forEach(item => {
    const status = item.fields.Status || 'Pending';
    const amount = parseFloat(item.fields.Amount) || 0;
    
    stats[status].count++;
    stats[status].amount += amount;
  });

  return stats;
}

/**
 * 법인별 투자비 통계 계산
 */
function calculateCompanyStats(investments) {
  const companyMap = new Map();

  investments.forEach(item => {
    const company = item.fields.Company || 'Unknown';
    const amount = parseFloat(item.fields.Amount) || 0;
    
    if (companyMap.has(company)) {
      const existing = companyMap.get(company);
      existing.count++;
      existing.amount += amount;
    } else {
      companyMap.set(company, { count: 1, amount: amount });
    }
  });

  return Array.from(companyMap.entries()).map(([company, data]) => ({
    company,
    count: data.count,
    amount: data.amount
  })).sort((a, b) => b.amount - a.amount);
}

/**
 * 월별 투자비 추이 계산
 */
function calculateMonthlyStats(investments) {
  const monthlyMap = new Map();

  investments.forEach(item => {
    const month = item.fields.Month || 'Unknown';
    const amount = parseFloat(item.fields.Amount) || 0;
    
    if (monthlyMap.has(month)) {
      const existing = monthlyMap.get(month);
      existing.count++;
      existing.amount += amount;
    } else {
      monthlyMap.set(month, { count: 1, amount: amount });
    }
  });

  return Array.from(monthlyMap.entries()).map(([month, data]) => ({
    month,
    count: data.count,
    amount: data.amount
  })).sort((a, b) => {
    // 월별 정렬 (YYYY-MM 형식)
    return a.month.localeCompare(b.month);
  });
}

/**
 * 카테고리별 통계 계산
 */
function calculateCategoryStats(investments) {
  const categoryMap = new Map();

  investments.forEach(item => {
    const category = item.fields.Category || 'Unknown';
    const amount = parseFloat(item.fields.Amount) || 0;
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category);
      existing.count++;
      existing.amount += amount;
    } else {
      categoryMap.set(category, { count: 1, amount: amount });
    }
  });

  return Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    amount: data.amount
  })).sort((a, b) => b.amount - a.amount);
}

/**
 * 사용자별 투자비 요청 통계 (관리자만)
 * GET /api/dashboard/user-stats
 */
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: '권한이 없습니다.',
        message: '관리자만 사용자 통계를 조회할 수 있습니다.'
      });
    }

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items?expand=fields&$top=1000`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    const investments = response.data.value;
    const userStats = calculateUserStats(investments);

    res.json({
      success: true,
      data: userStats
    });

  } catch (error) {
    console.error('User stats error:', error.response?.data || error.message);
    res.status(500).json({
      error: '사용자 통계 조회에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 사용자별 투자비 통계 계산
 */
function calculateUserStats(investments) {
  const userMap = new Map();

  investments.forEach(item => {
    const user = item.fields.RequestedBy || 'Unknown';
    const amount = parseFloat(item.fields.Amount) || 0;
    const status = item.fields.Status || 'Pending';
    
    if (!userMap.has(user)) {
      userMap.set(user, {
        totalCount: 0,
        totalAmount: 0,
        pendingCount: 0,
        approvedCount: 0,
        rejectedCount: 0,
        pendingAmount: 0,
        approvedAmount: 0,
        rejectedAmount: 0
      });
    }

    const userStats = userMap.get(user);
    userStats.totalCount++;
    userStats.totalAmount += amount;

    if (status === 'Pending') {
      userStats.pendingCount++;
      userStats.pendingAmount += amount;
    } else if (status === 'Approved') {
      userStats.approvedCount++;
      userStats.approvedAmount += amount;
    } else if (status === 'Rejected') {
      userStats.rejectedCount++;
      userStats.rejectedAmount += amount;
    }
  });

  return Array.from(userMap.entries()).map(([user, stats]) => ({
    user,
    ...stats
  })).sort((a, b) => b.totalAmount - a.totalAmount);
}

module.exports = router;
