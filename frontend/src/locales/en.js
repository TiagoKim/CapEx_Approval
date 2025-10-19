// English
const en = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    refresh: 'Refresh',
    required: 'Required',
    optional: 'Optional',
    yes: 'Yes',
    no: 'No',
    user: 'User',
    admin: 'Admin',
    generalUser: 'General User',
    language: 'Language'
  },

  // Authentication
  auth: {
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome',
    loginSuccess: 'Login successful',
    logoutSuccess: 'Logout successful',
    loginFailed: 'Login failed',
    tempLogin: 'Temporary Login',
    itManagerLogin: 'IT Manager Login',
    generalUserLogin: 'General User Login',
    tempLoginSuccess: 'Temporary login successful (Development/Test)'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    investmentRequest: 'Investment Request',
    investmentList: 'Investment List',
    settings: 'Settings'
  },

  // Investment
  investment: {
    title: 'Investment Approval Request',
    createRequest: 'Create Investment Request',
    requestList: 'Investment Request List',
    requestDetail: 'Investment Request Detail',
    company: 'Company',
    team: 'Team',
    user: 'Requester',
    requestTitle: 'Request Title',
    category: 'Category',
    detail: 'Details',
    amount: 'Investment Amount (KRW)',
    month: 'Investment Month',
    project: 'Related Project',
    projectSOP: 'Project SOP',
    detailItems: 'Investment Detail Items',
    addItem: 'Add Item',
    removeItem: 'Remove Item',
    itemDescription: 'Description',
    itemAmount: 'Amount',
    totalAmount: 'Total Amount',
    difference: 'Difference',
    status: 'Status',
    requestedDate: 'Requested Date',
    processedDate: 'Processed Date',
    adminComment: 'Admin Comment',
    approve: 'Approve',
    reject: 'Reject',
    hold: 'Hold',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    onHold: 'On Hold'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    totalRequests: 'Total Requests',
    pendingRequests: 'Pending Requests',
    approvedRequests: 'Approved Requests',
    rejectedRequests: 'Rejected Requests',
    totalAmount: 'Total Investment',
    monthlyTrend: 'Monthly Investment Trend',
    categoryBreakdown: 'Category Breakdown',
    recentRequests: 'Recent Requests',
    statistics: 'Statistics',
    charts: 'Charts'
  },

  // Form
  form: {
    submit: 'Submit',
    reset: 'Reset',
    validation: {
      required: 'This field is required',
      minAmount: 'Must be 0 or greater',
      invalidEmail: 'Please enter a valid email',
      invalidDate: 'Please enter a valid date'
    }
  },

  // Messages
  messages: {
    requestCreated: 'Investment request created',
    requestUpdated: 'Investment request updated',
    requestDeleted: 'Investment request deleted',
    statusUpdated: 'Status updated',
    noData: 'No data available',
    networkError: 'Network error occurred',
    serverError: 'Server error occurred'
  }
};

export default en;
