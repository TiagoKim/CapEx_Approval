// 中文
const zh = {
  // 通用
  common: {
    loading: '加载中...',
    error: '发生错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    close: '关闭',
    back: '返回',
    next: '下一步',
    previous: '上一步',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    refresh: '刷新',
    required: '必填',
    optional: '可选',
    yes: '是',
    no: '否',
    user: '用户',
    admin: '管理员',
    generalUser: '普通用户',
    language: '语言'
  },

  // 认证
  auth: {
    login: '登录',
    logout: '登出',
    welcome: '欢迎',
    loginSuccess: '登录成功',
    logoutSuccess: '登出成功',
    loginFailed: '登录失败',
    tempLogin: '临时登录',
    itManagerLogin: 'IT经理登录',
    generalUserLogin: '普通用户登录',
    tempLoginSuccess: '临时登录成功（开发/测试用）'
  },

  // 导航
  nav: {
    dashboard: '仪表板',
    investmentRequest: '投资申请',
    investmentList: '投资列表',
    settings: '设置'
  },

  // 投资
  investment: {
    title: '投资审批申请',
    createRequest: '创建投资申请',
    requestList: '投资申请列表',
    requestDetail: '投资申请详情',
    company: '公司',
    team: '团队',
    user: '申请人',
    requestTitle: '申请标题',
    category: '类别',
    detail: '详细信息',
    amount: '投资金额（韩元）',
    month: '投资月份',
    project: '相关项目',
    projectSOP: '项目SOP',
    detailItems: '投资明细',
    addItem: '添加项目',
    removeItem: '删除项目',
    itemDescription: '说明',
    itemAmount: '金额',
    totalAmount: '总金额',
    difference: '差额',
    status: '状态',
    requestedDate: '申请日期',
    processedDate: '处理日期',
    adminComment: '管理员评论',
    approve: '批准',
    reject: '拒绝',
    hold: '暂停',
    pending: '待处理',
    approved: '已批准',
    rejected: '已拒绝',
    onHold: '已暂停'
  },

  // 仪表板
  dashboard: {
    title: '仪表板',
    totalRequests: '总申请数',
    pendingRequests: '待处理申请',
    approvedRequests: '已批准申请',
    rejectedRequests: '已拒绝申请',
    totalAmount: '总投资额',
    monthlyTrend: '月度投资趋势',
    categoryBreakdown: '类别分布',
    recentRequests: '最近申请',
    statistics: '统计',
    charts: '图表'
  },

  // 表单
  form: {
    submit: '提交',
    reset: '重置',
    validation: {
      required: '此字段为必填项',
      minAmount: '必须大于等于0',
      invalidEmail: '请输入有效的电子邮件',
      invalidDate: '请输入有效的日期'
    }
  },

  // 消息
  messages: {
    requestCreated: '投资申请已创建',
    requestUpdated: '投资申请已更新',
    requestDeleted: '投资申请已删除',
    statusUpdated: '状态已更新',
    noData: '暂无数据',
    networkError: '网络错误',
    serverError: '服务器错误'
  }
};

export default zh;
