const express = require('express');
const router = express.Router();

/**
 * Mock 데이터 - 임시 로그인 사용자를 위한 샘플 데이터
 */

// 샘플 투자비 요청 데이터
const mockInvestments = [
  {
    id: 'mock-001',
    fields: {
      Title: 'IT 인프라 업그레이드',
      Company: '한국법인',
      Team: 'IT팀',
      User: '김개발',
      Category: 'IT인프라',
      Detail: '서버 성능 향상을 위한 하드웨어 업그레이드',
      Amount: 5000000,
      DetailAmount: 5000000,
      DetailItems: JSON.stringify([
        { description: '서버 하드웨어', amount: 3000000 },
        { description: '네트워크 장비', amount: 2000000 }
      ]),
      Month: '2024-01',
      Project: 'IT 인프라 개선',
      ProjectSOP: 'SOP-IT-001',
      Status: 'Pending',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-01-15T09:00:00Z',
      ProcessedBy: '',
      ProcessedDate: '',
      AdminComment: '',
      RequestDate: '2024-01-15T09:00:00Z'
    }
  },
  {
    id: 'mock-002',
    fields: {
      Title: '연구개발 장비 구매',
      Company: '미국법인',
      Team: 'R&D팀',
      User: '박연구',
      Category: '연구개발',
      Detail: '새로운 제품 개발을 위한 실험 장비 구매',
      Amount: 15000000,
      DetailAmount: 15000000,
      DetailItems: JSON.stringify([
        { description: '실험 장비 A', amount: 8000000 },
        { description: '측정 장비 B', amount: 5000000 },
        { description: '부품 및 소모품', amount: 2000000 }
      ]),
      Month: '2024-01',
      Project: '신제품 개발',
      ProjectSOP: 'SOP-RD-002',
      Status: 'Approved',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-01-10T14:30:00Z',
      ProcessedBy: 'admin@company.com',
      ProcessedDate: '2024-01-12T10:15:00Z',
      AdminComment: '예산 범위 내에서 승인합니다.',
      RequestDate: '2024-01-10T14:30:00Z'
    }
  },
  {
    id: 'mock-003',
    fields: {
      Title: '마케팅 캠페인',
      Company: '유럽법인',
      Team: '마케팅팀',
      User: '이마케팅',
      Category: '마케팅',
      Detail: '신제품 런칭을 위한 디지털 마케팅 캠페인',
      Amount: 8000000,
      DetailAmount: 8000000,
      Month: '2024-02',
      Project: '신제품 런칭',
      ProjectSOP: 'SOP-MK-003',
      Status: 'Rejected',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-01-20T11:45:00Z',
      ProcessedBy: 'admin@company.com',
      ProcessedDate: '2024-01-22T16:20:00Z',
      AdminComment: '예산 초과로 인해 거절합니다. 대안을 검토해주세요.',
      RequestDate: '2024-01-20T11:45:00Z'
    }
  },
  {
    id: 'mock-004',
    fields: {
      Title: '설비 투자',
      Company: '중국법인',
      Team: '생산팀',
      User: '최생산',
      Category: '설비투자',
      Detail: '생산 효율성 향상을 위한 자동화 설비 도입',
      Amount: 25000000,
      DetailAmount: 25000000,
      Month: '2024-02',
      Project: '생산 자동화',
      ProjectSOP: 'SOP-PD-004',
      Status: 'Pending',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-01-25T08:30:00Z',
      ProcessedBy: '',
      ProcessedDate: '',
      AdminComment: '',
      RequestDate: '2024-01-25T08:30:00Z'
    }
  },
  {
    id: 'mock-005',
    fields: {
      Title: '인사관리 시스템',
      Company: '일본법인',
      Team: '인사팀',
      User: '정인사',
      Category: '인사관리',
      Detail: 'HR 시스템 업그레이드 및 새로운 모듈 추가',
      Amount: 12000000,
      DetailAmount: 12000000,
      Month: '2024-03',
      Project: 'HR 시스템 개선',
      ProjectSOP: 'SOP-HR-005',
      Status: 'Approved',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-01-28T13:15:00Z',
      ProcessedBy: 'admin@company.com',
      ProcessedDate: '2024-01-30T09:45:00Z',
      AdminComment: '승인합니다. 단계적 도입을 권장합니다.',
      RequestDate: '2024-01-28T13:15:00Z'
    }
  },
  {
    id: 'mock-006',
    fields: {
      Title: '임시저장 테스트',
      Company: '한국법인',
      Team: 'IT팀',
      User: '김개발',
      Category: 'IT인프라',
      Detail: '임시저장된 투자비 요청입니다.',
      Amount: 3000000,
      DetailAmount: 3000000,
      DetailItems: JSON.stringify([
        { description: '임시 항목 1', amount: 2000000 },
        { description: '임시 항목 2', amount: 1000000 }
      ]),
      Month: '2024-02',
      Project: '임시저장 프로젝트',
      ProjectSOP: 'SOP-TEMP-001',
      Status: 'Draft',
      RequestedBy: 'user@company.com',
      RequestedDate: '2024-02-01T10:00:00Z',
      ProcessedBy: '',
      ProcessedDate: '',
      AdminComment: '',
      RequestDate: '2024-02-01T10:00:00Z'
    }
  }
];

/**
 * Mock 투자비 요청 목록 조회
 * GET /api/mock/investments
 */
router.get('/investments', (req, res) => {
  try {
    const { status, company, month, dateFrom, dateTo, page = 1, limit = 10 } = req.query;
    
    let filteredData = [...mockInvestments];
    
    // 필터링
    if (status) {
      filteredData = filteredData.filter(item => item.fields.Status === status);
    }
    if (company) {
      filteredData = filteredData.filter(item => item.fields.Company === company);
    }
    if (month) {
      filteredData = filteredData.filter(item => item.fields.Month === month);
    }
    if (dateFrom) {
      filteredData = filteredData.filter(item => {
        const requestDate = new Date(item.fields.RequestDate || item.fields.RequestedDate);
        const fromDate = new Date(dateFrom);
        return requestDate >= fromDate;
      });
    }
    if (dateTo) {
      filteredData = filteredData.filter(item => {
        const requestDate = new Date(item.fields.RequestDate || item.fields.RequestedDate);
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999); // 하루 끝까지 포함
        return requestDate <= toDate;
      });
    }
    
    // 페이지네이션
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredData.length
      }
    });
  } catch (error) {
    console.error('Mock investments error:', error);
    res.status(500).json({
      error: 'Mock 데이터 조회에 실패했습니다.',
      message: error.message
    });
  }
});

/**
 * Mock 대시보드 통계 데이터
 * GET /api/mock/dashboard/stats
 */
router.get('/dashboard/stats', (req, res) => {
  try {
    // 승인 상태별 통계
    const statusStats = {
      Pending: { count: 0, amount: 0 },
      Approved: { count: 0, amount: 0 },
      Rejected: { count: 0, amount: 0 },
      Draft: { count: 0, amount: 0 }
    };
    
    // 법인별 통계
    const companyStats = {};
    
    // 월별 통계
    const monthlyStats = {};
    
    // 카테고리별 통계
    const categoryStats = {};
    
    mockInvestments.forEach(item => {
      const status = item.fields.Status;
      const amount = item.fields.Amount;
      const company = item.fields.Company;
      const month = item.fields.Month;
      const category = item.fields.Category;
      
      // 상태별 통계
      statusStats[status].count++;
      statusStats[status].amount += amount;
      
      // 법인별 통계
      if (!companyStats[company]) {
        companyStats[company] = { count: 0, amount: 0 };
      }
      companyStats[company].count++;
      companyStats[company].amount += amount;
      
      // 월별 통계
      if (!monthlyStats[month]) {
        monthlyStats[month] = { count: 0, amount: 0 };
      }
      monthlyStats[month].count++;
      monthlyStats[month].amount += amount;
      
      // 카테고리별 통계
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, amount: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].amount += amount;
    });
    
    // 배열 형태로 변환
    const companyStatsArray = Object.entries(companyStats).map(([company, data]) => ({
      company,
      count: data.count,
      amount: data.amount
    }));
    
    const monthlyStatsArray = Object.entries(monthlyStats).map(([month, data]) => ({
      month,
      count: data.count,
      amount: data.amount
    }));
    
    const categoryStatsArray = Object.entries(categoryStats).map(([category, data]) => ({
      category,
      count: data.count,
      amount: data.amount
    }));
    
    res.json({
      success: true,
      data: {
        statusStats,
        companyStats: companyStatsArray,
        monthlyStats: monthlyStatsArray,
        categoryStats: categoryStatsArray,
        totalInvestments: mockInvestments.length,
        totalAmount: mockInvestments.reduce((sum, item) => sum + item.fields.Amount, 0)
      }
    });
  } catch (error) {
    console.error('Mock dashboard stats error:', error);
    res.status(500).json({
      error: 'Mock 대시보드 통계 조회에 실패했습니다.',
      message: error.message
    });
  }
});

/**
 * Mock 최근 투자비 요청
 * GET /api/mock/dashboard/recent
 */
router.get('/dashboard/recent', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // 최근 요청일 기준으로 정렬
    const sortedData = [...mockInvestments].sort((a, b) => 
      new Date(b.fields.RequestedDate) - new Date(a.fields.RequestedDate)
    );
    
    const limitedData = sortedData.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: limitedData
    });
  } catch (error) {
    console.error('Mock recent investments error:', error);
    res.status(500).json({
      error: 'Mock 최근 투자비 요청 조회에 실패했습니다.',
      message: error.message
    });
  }
});

/**
 * Mock 투자비 요청 생성 (임시 사용자용)
 * POST /api/mock/investments
 */
router.post('/investments', (req, res) => {
  try {
    const newInvestment = {
      id: `mock-${Date.now()}`,
      fields: {
        Title: req.body.title,
        Company: req.body.company,
        Team: req.body.team,
        User: req.body.user,
        Category: req.body.category,
        Detail: req.body.detail,
        Amount: req.body.amount,
        DetailAmount: req.body.detailAmount,
        DetailItems: JSON.stringify(req.body.detailItems || []),
        Month: req.body.month,
        Project: req.body.project,
        ProjectSOP: req.body.projectSOP,
        Status: req.body.status || 'Pending',
        RequestedBy: 'temp-user@company.com',
        RequestedDate: new Date().toISOString(),
        AdminComment: '',
        RequestDate: new Date().toISOString()
      }
    };

    // Mock 데이터에 추가
    mockInvestments.unshift(newInvestment);

    res.status(201).json({
      success: true,
      message: '투자비 승인 요청이 생성되었습니다.',
      data: newInvestment
    });

  } catch (error) {
    console.error('Mock investment creation error:', error);
    res.status(500).json({
      error: '투자비 요청 생성에 실패했습니다.',
      message: error.message
    });
  }
});

/**
 * Mock 투자비 요청 상태 변경 (임시 사용자용)
 * PATCH /api/mock/investments/:id/status
 */
router.patch('/investments/:id/status', (req, res) => {
  try {
    const { status, adminComment } = req.body;
    
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        error: '유효하지 않은 상태입니다.',
        message: '상태는 Approved, Rejected, Pending 중 하나여야 합니다.'
      });
    }

    const investment = mockInvestments.find(item => item.id === req.params.id);
    if (!investment) {
      return res.status(404).json({
        error: '투자비 요청을 찾을 수 없습니다.'
      });
    }

    investment.fields.Status = status;
    investment.fields.AdminComment = adminComment || '';
    investment.fields.ProcessedBy = 'temp-admin@company.com';
    investment.fields.ProcessedDate = new Date().toISOString();

    res.json({
      success: true,
      message: `투자비 요청이 ${status === 'Approved' ? '승인' : status === 'Rejected' ? '거절' : '보류'}되었습니다.`,
      data: investment
    });

  } catch (error) {
    console.error('Mock investment status update error:', error);
    res.status(500).json({
      error: '투자비 요청 상태 변경에 실패했습니다.',
      message: error.message
    });
  }
});

// 특정 투자비 조회
router.get('/investments/:id', (req, res) => {
  try {
    const investmentId = req.params.id;
    const investment = mockInvestments.find(item => item.id === investmentId);
    
    if (!investment) {
      return res.status(404).json({
        success: false,
        message: '투자비 요청을 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: investment
    });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 투자비 수정
router.put('/investments/:id', (req, res) => {
  try {
    const investmentId = req.params.id;
    const investmentIndex = mockInvestments.findIndex(item => item.id === investmentId);
    
    if (investmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '투자비 요청을 찾을 수 없습니다.'
      });
    }
    
    // 기존 투자비 데이터 업데이트
    const updatedInvestment = {
      ...mockInvestments[investmentIndex],
      fields: {
        ...mockInvestments[investmentIndex].fields,
        Title: req.body.title,
        Company: req.body.company,
        Team: req.body.team,
        User: req.body.user,
        Category: req.body.category,
        Detail: req.body.detail,
        Amount: req.body.amount,
        DetailAmount: req.body.detailAmount,
        DetailItems: JSON.stringify(req.body.detailItems || []),
        Month: req.body.month,
        Project: req.body.project,
        ProjectSOP: req.body.projectSOP,
        ModifiedBy: 'temp-user@company.com',
        ModifiedDate: new Date().toISOString(),
        RequestDate: new Date().toISOString()
      }
    };
    
    mockInvestments[investmentIndex] = updatedInvestment;
    
    res.json({
      success: true,
      message: '투자비 요청이 성공적으로 수정되었습니다.',
      data: updatedInvestment
    });
  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
