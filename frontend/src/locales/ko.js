// 한국어 (기본)
const ko = {
  // 공통
  common: {
    loading: '로딩 중...',
    error: '오류가 발생했습니다',
    success: '성공',
    cancel: '취소',
    confirm: '확인',
    save: '저장',
    delete: '삭제',
    edit: '수정',
    view: '보기',
    close: '닫기',
    back: '뒤로',
    next: '다음',
    previous: '이전',
    search: '검색',
    filter: '필터',
    sort: '정렬',
    refresh: '새로고침',
    required: '필수',
    optional: '선택',
    yes: '예',
    no: '아니오',
    user: '사용자',
    admin: '관리자',
    generalUser: '일반 사용자',
    language: '언어'
  },

  // 인증
  auth: {
    login: '로그인',
    logout: '로그아웃',
    welcome: '환영합니다',
    loginSuccess: '로그인되었습니다',
    logoutSuccess: '로그아웃되었습니다',
    loginFailed: '로그인에 실패했습니다',
    tempLogin: '임시 로그인',
    itManagerLogin: 'IT Manager 로그인',
    generalUserLogin: '일반 사용자 로그인',
    tempLoginSuccess: '임시 로그인 성공 (개발/테스트용)'
  },

  // 네비게이션
  nav: {
    dashboard: '대시보드',
    investmentRequest: '투자비 요청',
    investmentList: '투자비 목록',
    settings: '설정'
  },

  // 투자비 요청
  investment: {
    title: '투자비 승인 요청',
    createRequest: '투자비 요청 작성',
    requestList: '투자비 요청 목록',
    requestDetail: '투자비 요청 상세',
    company: '법인명',
    team: '팀명',
    user: '요청자',
    requestTitle: '요청 제목',
    category: '카테고리',
    detail: '상세 내용',
    amount: '투자비 금액 (원)',
    month: '투자 월',
    project: '관련 프로젝트',
    projectSOP: '프로젝트 SOP',
    detailItems: '투자비 내역 상세',
    addItem: '항목 추가',
    removeItem: '항목 삭제',
    itemDescription: '내역',
    itemAmount: '금액',
    totalAmount: '총 금액',
    difference: '차액',
    status: '상태',
    requestedDate: '요청일',
    processedDate: '처리일',
    adminComment: '관리자 코멘트',
    approve: '승인',
    reject: '거절',
    hold: '보류',
    pending: '대기',
    approved: '승인됨',
    rejected: '거절됨',
    onHold: '보류됨'
  },

  // 대시보드
  dashboard: {
    title: '대시보드',
    totalRequests: '총 요청 수',
    pendingRequests: '대기 중인 요청',
    approvedRequests: '승인된 요청',
    rejectedRequests: '거절된 요청',
    totalAmount: '총 투자비',
    monthlyTrend: '월별 투자비 추이',
    categoryBreakdown: '카테고리별 분포',
    recentRequests: '최근 요청',
    statistics: '통계',
    charts: '차트'
  },

  // 폼
  form: {
    submit: '제출',
    reset: '초기화',
    validation: {
      required: '필수 입력 항목입니다',
      minAmount: '0원 이상이어야 합니다',
      invalidEmail: '유효한 이메일을 입력하세요',
      invalidDate: '유효한 날짜를 입력하세요'
    }
  },

  // 메시지
  messages: {
    requestCreated: '투자비 요청이 생성되었습니다',
    requestUpdated: '투자비 요청이 수정되었습니다',
    requestDeleted: '투자비 요청이 삭제되었습니다',
    statusUpdated: '상태가 변경되었습니다',
    noData: '데이터가 없습니다',
    networkError: '네트워크 오류가 발생했습니다',
    serverError: '서버 오류가 발생했습니다'
  }
};

export default ko;
