import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { LogIn, AlertCircle, Loader } from 'lucide-react';

import { authService } from '../services/authService';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const InfoMessage = styled.div`
  background: #e3f2fd;
  color: #1976d2;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Divider = styled.div`
  margin: 1.5rem 0;
  position: relative;
  text-align: center;
  color: #999;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #ddd;
  }

  span {
    background: white;
    padding: 0 1rem;
    position: relative;
  }
`;

const ManualLoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #218838;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

/**
 * Login Component
 * Azure AD OAuth 로그인 및 수동 로그인 처리
 */
function Login({ onLogin }) {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualLoginData, setManualLoginData] = useState({
    code: '',
    redirectUri: 'http://localhost:3000/callback'
  });

  useEffect(() => {
    // URL에서 인증 코드 확인
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code && state) {
      handleOAuthCallback(code);
    }
  }, [searchParams]);

  /**
   * OAuth 콜백 처리
   */
  const handleOAuthCallback = async (code) => {
    setLoading(true);
    setError('');

    try {
      const success = await onLogin({
        code,
        redirectUri: 'http://localhost:3000/callback'
      });

      if (!success) {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Azure AD 로그인 시작
   */
  const handleAzureLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const loginUrl = await authService.getLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      setError(error.message || '로그인 URL 생성에 실패했습니다.');
      setLoading(false);
    }
  };

  /**
   * 임시 로그인 처리 (IT Manager용)
   */
  const handleTempLogin = async (role) => {
    setLoading(true);
    setError('');

    try {
      const success = await onLogin({
        tempLogin: true,
        role: role
      });

      if (!success) {
        setError('임시 로그인에 실패했습니다.');
      }
    } catch (error) {
      setError(error.message || '임시 로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 수동 로그인 처리
   */
  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(manualLoginData);
      if (!success) {
        setError('로그인에 실패했습니다. 인증 코드를 확인해주세요.');
      }
    } catch (error) {
      setError(error.message || '로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 입력값 변경 처리
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setManualLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>CapEx Approval</Logo>
        <Subtitle>투자비 승인 시스템에 로그인하세요</Subtitle>

        {error && (
          <ErrorMessage>
            <AlertCircle size={18} />
            {error}
          </ErrorMessage>
        )}

        <InfoMessage>
          <strong>Azure AD 로그인:</strong><br />
          회사 계정으로 안전하게 로그인하세요.
        </InfoMessage>

        <LoginButton 
          onClick={handleAzureLogin}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner />
          ) : (
            <LogIn size={18} />
          )}
          {loading ? '로그인 중...' : 'Azure AD로 로그인'}
        </LoginButton>

        <Divider>
          <span>개발/테스트용</span>
        </Divider>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <LoginButton 
            onClick={() => handleTempLogin('admin')}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              flex: 1
            }}
          >
            <LogIn size={18} />
            IT Manager 로그인
          </LoginButton>

          <LoginButton 
            onClick={() => handleTempLogin('user')}
            disabled={loading}
            style={{ 
              background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
              flex: 1
            }}
          >
            <LogIn size={18} />
            일반 사용자 로그인
          </LoginButton>
        </div>

        <Divider>
          <span>또는</span>
        </Divider>

        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          style={{
            background: 'none',
            border: 'none',
            color: '#667eea',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem'
          }}
        >
          {showManualForm ? '수동 로그인 숨기기' : '수동 로그인'}
        </button>

        {showManualForm && (
          <ManualLoginForm onSubmit={handleManualLogin}>
            <Input
              type="text"
              name="code"
              placeholder="인증 코드"
              value={manualLoginData.code}
              onChange={handleInputChange}
              required
            />
            <Input
              type="url"
              name="redirectUri"
              placeholder="리다이렉트 URI"
              value={manualLoginData.redirectUri}
              onChange={handleInputChange}
              required
            />
            <SubmitButton type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </SubmitButton>
          </ManualLoginForm>
        )}

        <div style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.8rem', 
          color: '#999',
          lineHeight: '1.4'
        }}>
          <p><strong>설정 안내:</strong></p>
          <p>1. Azure AD 앱 등록 필요</p>
          <p>2. SharePoint 사이트 및 리스트 설정</p>
          <p>3. 환경변수 구성</p>
        </div>
      </LoginCard>
    </LoginContainer>
  );
}

export default Login;
