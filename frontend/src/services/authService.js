import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * 인증 관련 서비스
 */
class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // 요청 인터셉터 - 토큰 자동 추가
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

    // 응답 인터셉터 - 토큰 만료 처리
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // 토큰 만료 시 자동 갱신 시도
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            try {
              await this.refreshToken();
              // 원래 요청 재시도
              return this.api.request(error.config);
            } catch (refreshError) {
              // 갱신 실패 시 로그아웃 처리
              this.logout();
              window.location.href = '/login';
            }
          } else {
            this.logout();
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Azure AD 로그인 URL 생성
   */
  async getLoginUrl(redirectUri = 'http://localhost:3000/callback') {
    try {
      const response = await this.api.get('/auth/login-url', {
        params: { redirect_uri: redirectUri }
      });
      return response.data.loginUrl;
    } catch (error) {
      console.error('Login URL generation error:', error);
      throw new Error('로그인 URL 생성에 실패했습니다.');
    }
  }

  /**
   * OAuth 인증 코드로 로그인
   */
  async login(loginData) {
    try {
      const response = await this.api.post('/auth/login', loginData);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(
        error.response?.data?.message || 
        '로그인에 실패했습니다. 다시 시도해주세요.'
      );
    }
  }

  /**
   * 토큰 갱신
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('Refresh token not found');
      }

      const response = await this.api.post('/auth/refresh', {
        refresh_token: refreshToken
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.accessToken);
        return response.data;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * 현재 사용자 정보 조회
   */
  async getCurrentUser() {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      throw new Error('사용자 정보 조회에 실패했습니다.');
    }
  }

  /**
   * 토큰 유효성 검증
   */
  async verifyToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }

      const response = await this.api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      console.error('Token verification error:', error);
      return null;
    }
  }

  /**
   * 임시 로그인 (개발/테스트용)
   */
  async tempLogin(role = 'admin') {
    try {
      const response = await this.api.post('/auth/temp-login', { role });
      return response.data;
    } catch (error) {
      console.error('Temp login error:', error);
      throw new Error(
        error.response?.data?.message || 
        '임시 로그인에 실패했습니다.'
      );
    }
  }

  /**
   * 로그아웃
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  /**
   * 인증 상태 확인
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  /**
   * 관리자 권한 확인
   */
  isAdmin() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.isAdmin || false;
  }
}

export const authService = new AuthService();
