const express = require('express');
const axios = require('axios');
const router = express.Router();

// JWT 인증 미들웨어
const { authenticateToken } = require('../middleware/auth');

/**
 * 투자비 승인 요청 생성
 * POST /api/investments
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const investmentData = {
      fields: {
        Title: req.body.title,
        Company: req.body.company,
        Team: req.body.team,
        User: req.body.user,
        Category: req.body.category,
        Detail: req.body.detail,
        Amount: req.body.amount,
        DetailAmount: req.body.detailAmount,
        DetailItems: JSON.stringify(req.body.detailItems || []), // 투자비 내역 상세 저장
        Month: req.body.month,
        Project: req.body.project,
        ProjectSOP: req.body.projectSOP,
        Status: 'Pending',
        RequestedBy: req.user.email,
        RequestedDate: new Date().toISOString(),
        AdminComment: ''
      }
    };

    // SharePoint 리스트에 항목 생성
    const response = await axios.post(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items`,
      investmentData,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(201).json({
      success: true,
      message: '투자비 승인 요청이 생성되었습니다.',
      data: response.data
    });

  } catch (error) {
    console.error('Investment creation error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 생성에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 투자비 승인 요청 목록 조회
 * GET /api/investments
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, company, month, page = 1, limit = 10 } = req.query;
    
    let filterQuery = '';
    const filters = [];
    
    if (status) filters.push(`Status eq '${status}'`);
    if (company) filters.push(`Company eq '${company}'`);
    if (month) filters.push(`Month eq '${month}'`);
    
    if (filters.length > 0) {
      filterQuery = `&$filter=${filters.join(' and ')}`;
    }

    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items?expand=fields${filterQuery}&$top=${limit}&$skip=${(page - 1) * limit}&$orderby=Created desc`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data.value,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: response.data['@odata.count'] || response.data.value.length
      }
    });

  } catch (error) {
    console.error('Investment list error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 목록 조회에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 특정 투자비 승인 요청 조회
 * GET /api/investments/:id
 */
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}?expand=fields`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Investment detail error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 상세 조회에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 투자비 승인 요청 수정
 * PUT /api/investments/:id
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // 일반 사용자는 자신의 요청만 수정 가능
    if (!req.user.isAdmin) {
      const existingItem = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}?expand=fields`,
        {
          headers: {
            'Authorization': `Bearer ${req.accessToken}`
          }
        }
      );

      if (existingItem.data.fields.RequestedBy !== req.user.email) {
        return res.status(403).json({
          error: '권한이 없습니다.',
          message: '자신의 요청만 수정할 수 있습니다.'
        });
      }
    }

    const updateData = {
      fields: {
        ...req.body,
        LastModified: new Date().toISOString()
      }
    };

    const response = await axios.patch(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}/fields`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: '투자비 요청이 수정되었습니다.',
      data: response.data
    });

  } catch (error) {
    console.error('Investment update error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 수정에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 투자비 승인/거절/보류 처리 (관리자만)
 * PATCH /api/investments/:id/status
 */
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        error: '권한이 없습니다.',
        message: '관리자만 승인 처리를 할 수 있습니다.'
      });
    }

    const { status, adminComment } = req.body;
    
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        error: '유효하지 않은 상태입니다.',
        message: '상태는 Approved, Rejected, Pending 중 하나여야 합니다.'
      });
    }

    const updateData = {
      fields: {
        Status: status,
        AdminComment: adminComment || '',
        ProcessedBy: req.user.email,
        ProcessedDate: new Date().toISOString()
      }
    };

    const response = await axios.patch(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}/fields`,
      updateData,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      message: `투자비 요청이 ${status === 'Approved' ? '승인' : status === 'Rejected' ? '거절' : '보류'}되었습니다.`,
      data: response.data
    });

  } catch (error) {
    console.error('Investment status update error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 상태 변경에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

/**
 * 투자비 승인 요청 삭제
 * DELETE /api/investments/:id
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // 일반 사용자는 자신의 요청만 삭제 가능
    if (!req.user.isAdmin) {
      const existingItem = await axios.get(
        `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}?expand=fields`,
        {
          headers: {
            'Authorization': `Bearer ${req.accessToken}`
          }
        }
      );

      if (existingItem.data.fields.RequestedBy !== req.user.email) {
        return res.status(403).json({
          error: '권한이 없습니다.',
          message: '자신의 요청만 삭제할 수 있습니다.'
        });
      }
    }

    await axios.delete(
      `https://graph.microsoft.com/v1.0/sites/${process.env.SHAREPOINT_SITE_ID}/lists/${process.env.SHAREPOINT_LIST_ID}/items/${req.params.id}`,
      {
        headers: {
          'Authorization': `Bearer ${req.accessToken}`
        }
      }
    );

    res.json({
      success: true,
      message: '투자비 요청이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('Investment deletion error:', error.response?.data || error.message);
    res.status(500).json({
      error: '투자비 요청 삭제에 실패했습니다.',
      message: error.response?.data?.error?.message || 'Unknown error occurred'
    });
  }
});

module.exports = router;
