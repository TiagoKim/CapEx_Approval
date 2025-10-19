import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * API 통신 서비스
 */
class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
    });

    // 요청 인터셉터
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // 토큰 만료 시 로그인 페이지로 리다이렉트
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 인증 토큰 설정
   */
  setAuthToken(token) {
    if (token) {
      this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.api.defaults.headers.common['Authorization'];
    }
  }

  /**
   * 인증 토큰 제거
   */
  clearAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // ========== 투자비 관련 API ==========

  /**
   * 투자비 요청 생성
   */
  async createInvestment(investmentData) {
    try {
      // 임시 사용자인 경우 Mock API 사용
      const isTempUser = localStorage.getItem('isTempUser') === 'true';
      const endpoint = isTempUser ? '/mock/investments' : '/investments';
      
      const response = await this.api.post(endpoint, investmentData);
      return response.data;
    } catch (error) {
      console.error('Create investment error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 생성에 실패했습니다.'
      );
    }
  }

  /**
   * 투자비 요청 목록 조회
   */
  async getInvestments(params = {}) {
    try {
      // 임시 사용자인 경우 Mock API 사용
      const isTempUser = localStorage.getItem('isTempUser') === 'true';
      const endpoint = isTempUser ? '/mock/investments' : '/investments';
      
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Get investments error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 목록 조회에 실패했습니다.'
      );
    }
  }

  /**
   * 특정 투자비 요청 조회
   */
  async getInvestment(id) {
    try {
      const response = await this.api.get(`/investments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get investment error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 조회에 실패했습니다.'
      );
    }
  }

  /**
   * 투자비 요청 수정
   */
  async updateInvestment(id, investmentData) {
    try {
      const response = await this.api.put(`/investments/${id}`, investmentData);
      return response.data;
    } catch (error) {
      console.error('Update investment error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 수정에 실패했습니다.'
      );
    }
  }

  /**
   * 투자비 요청 삭제
   */
  async deleteInvestment(id) {
    try {
      const response = await this.api.delete(`/investments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete investment error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 삭제에 실패했습니다.'
      );
    }
  }

  /**
   * 투자비 요청 상태 변경 (관리자만)
   */
  async updateInvestmentStatus(id, status, adminComment = '') {
    try {
      // 임시 사용자인 경우 Mock API 사용
      const isTempUser = localStorage.getItem('isTempUser') === 'true';
      const endpoint = isTempUser ? `/mock/investments/${id}/status` : `/investments/${id}/status`;
      
      const response = await this.api.patch(endpoint, {
        status,
        adminComment
      });
      return response.data;
    } catch (error) {
      console.error('Update investment status error:', error);
      throw new Error(
        error.response?.data?.message || 
        '투자비 요청 상태 변경에 실패했습니다.'
      );
    }
  }

  // ========== 대시보드 관련 API ==========

  /**
   * 대시보드 통계 데이터 조회
   */
  async getDashboardStats() {
    try {
      // 임시 사용자인 경우 Mock API 사용
      const isTempUser = localStorage.getItem('isTempUser') === 'true';
      const endpoint = isTempUser ? '/mock/dashboard/stats' : '/dashboard/stats';
      
      const response = await this.api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw new Error(
        error.response?.data?.message || 
        '대시보드 통계 조회에 실패했습니다.'
      );
    }
  }

  /**
   * 최근 투자비 요청 조회
   */
  async getRecentInvestments(limit = 10) {
    try {
      // 임시 사용자인 경우 Mock API 사용
      const isTempUser = localStorage.getItem('isTempUser') === 'true';
      const endpoint = isTempUser ? '/mock/dashboard/recent' : '/dashboard/recent';
      
      const response = await this.api.get(endpoint, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Get recent investments error:', error);
      throw new Error(
        error.response?.data?.message || 
        '최근 투자비 요청 조회에 실패했습니다.'
      );
    }
  }

  /**
   * 사용자별 통계 조회 (관리자만)
   */
  async getUserStats() {
    try {
      const response = await this.api.get('/dashboard/user-stats');
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw new Error(
        error.response?.data?.message || 
        '사용자 통계 조회에 실패했습니다.'
      );
    }
  }

  // ========== 유틸리티 메서드 ==========

  /**
   * 에러 메시지 추출
   */
  getErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return '알 수 없는 오류가 발생했습니다.';
  }

  /**
   * API 상태 확인
   */
  async healthCheck() {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw new Error('API 서버에 연결할 수 없습니다.');
    }
  }
}

export const apiService = new ApiService();
