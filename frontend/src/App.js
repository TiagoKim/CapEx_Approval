import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';

// Components
import Header from './components/Header';
import Login from './components/Login';
import Form from './components/Form';
import Dashboard from './components/Dashboard';
import InvestmentList from './components/InvestmentList';

// Services
import { authService } from './services/authService';
import { apiService } from './services/apiService';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';

// Styled Components
const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const MainContent = styled.main`
  padding-top: 80px; /* Header height */
  min-height: calc(100vh - 80px);
`;

/**
 * Main App Component
 * 권한 확인 후 Form / Dashboard 분기
 */
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  /**
   * 앱 초기화 - 토큰 확인 및 사용자 정보 로드
   */
  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // 토큰 유효성 검증
        const userData = await authService.verifyToken();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          apiService.setAuthToken(token);
        } else {
          // 유효하지 않은 토큰 제거
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      toast.error('앱 초기화 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그인 처리
   */
  const handleLogin = async (loginData) => {
    try {
      setLoading(true);
      
      // 임시 로그인 처리
      if (loginData.tempLogin) {
        const response = await authService.tempLogin(loginData.role);
        
        if (response.success) {
          setUser(response.user);
          setIsAuthenticated(true);
          apiService.setAuthToken(response.token);
          
          // 토큰 저장
          localStorage.setItem('token', response.token);
          localStorage.setItem('isTempUser', 'true');
          
          toast.success(`환영합니다, ${response.user.name}님! (임시 로그인)`);
          return true;
        }
      } else {
        // 일반 Azure AD 로그인
        const response = await authService.login(loginData);
        
        if (response.success) {
          setUser(response.user);
          setIsAuthenticated(true);
          apiService.setAuthToken(response.token);
          
          // 토큰 저장
          localStorage.setItem('token', response.token);
          if (response.refreshToken) {
            localStorage.setItem('refreshToken', response.refreshToken);
          }
          
          toast.success(`환영합니다, ${response.user.name}님!`);
          return true;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || '로그인에 실패했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그아웃 처리
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isTempUser');
    setUser(null);
    setIsAuthenticated(false);
    apiService.clearAuthToken();
    toast.info('로그아웃되었습니다.');
  };

  /**
   * 로딩 화면
   */
  if (loading) {
    return (
      <AppContainer>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>로딩 중...</span>
        </div>
      </AppContainer>
    );
  }

  return (
    <LanguageProvider>
      <AppContainer>
        <Header 
          user={user} 
          isAuthenticated={isAuthenticated} 
          onLogout={handleLogout}
        />
        
        <MainContent>
        <Routes>
          {/* 로그인 페이지 */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to={user?.isAdmin ? "/dashboard" : "/form"} replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          
          {/* 투자비 요청 작성 페이지 */}
          <Route 
            path="/form" 
            element={
              isAuthenticated ? 
                <Form user={user} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* 투자비 요청 목록 페이지 */}
          <Route 
            path="/list" 
            element={
              isAuthenticated ? 
                <InvestmentList user={user} /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* 관리자 대시보드 */}
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated && user?.isAdmin ? 
                <Dashboard user={user} /> : 
                isAuthenticated ? 
                  <Navigate to="/form" replace /> : 
                  <Navigate to="/login" replace />
            } 
          />
          
          {/* 기본 경로 리다이렉트 */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to={user?.isAdmin ? "/dashboard" : "/form"} replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* 404 페이지 */}
          <Route 
            path="*" 
            element={
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#666'
              }}>
                <h2>페이지를 찾을 수 없습니다</h2>
                <p>요청하신 페이지가 존재하지 않습니다.</p>
              </div>
            } 
          />
        </Routes>
        </MainContent>
      </AppContainer>
    </LanguageProvider>
  );
}

export default App;
