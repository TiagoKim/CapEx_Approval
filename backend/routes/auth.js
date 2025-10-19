const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * Azure AD 인증 및 Access Token 발급
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { code, redirectUri } = req.body;

    if (!code || !redirectUri) {
      return res.status(400).json({ 
        error: 'Authorization code and redirect URI are required' 
      });
    }

    // Azure AD에서 Access Token 요청
    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        code: code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: 'https://graph.microsoft.com/.default'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // 사용자 정보 조회
    const userResponse = await axios.get('https://graph.microsoft.com/v1.0/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });

    const user = userResponse.data;
    
    // 관리자 권한 확인 (실제 구현에서는 Azure AD 그룹 멤버십 확인)
    const isAdmin = await checkAdminRole(access_token, user.id);

    // JWT 토큰 생성
    const jwtToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.mail || user.userPrincipalName,
        name: user.displayName,
        isAdmin: isAdmin
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: {
        id: user.id,
        email: user.mail || user.userPrincipalName,
        name: user.displayName,
        isAdmin: isAdmin
      },
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresIn: expires_in
    });

  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).json({ 
      error: 'Authentication failed',
      message: error.response?.data?.error_description || 'Invalid authorization code'
    });
  }
});

/**
 * Access Token 갱신
 * POST /api/auth/refresh
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const tokenResponse = await axios.post(
      `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.AZURE_CLIENT_ID,
        client_secret: process.env.AZURE_CLIENT_SECRET,
        refresh_token: refresh_token,
        grant_type: 'refresh_token',
        scope: 'https://graph.microsoft.com/.default'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    res.json({
      success: true,
      accessToken: access_token,
      expiresIn: expires_in
    });

  } catch (error) {
    console.error('Token refresh error:', error.response?.data || error.message);
    res.status(401).json({ 
      error: 'Token refresh failed',
      message: 'Invalid or expired refresh token'
    });
  }
});

/**
 * 사용자 권한 확인
 * GET /api/auth/me
 */
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * Azure AD 로그인 URL 생성
 * GET /api/auth/login-url
 */
router.get('/login-url', (req, res) => {
  const redirectUri = req.query.redirect_uri || 'http://localhost:3000/callback';
  
  const loginUrl = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?` +
    `client_id=${process.env.AZURE_CLIENT_ID}&` +
    `response_type=code&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `scope=${encodeURIComponent('https://graph.microsoft.com/.default')}&` +
    `response_mode=query&` +
    `state=12345`;

  res.json({
    success: true,
    loginUrl: loginUrl
  });
});

/**
 * 임시 로그인 (개발/테스트용)
 * POST /api/auth/temp-login
 */
router.post('/temp-login', (req, res) => {
  try {
    const { email, role } = req.body;
    
    // 임시 사용자 데이터
    const tempUsers = {
      'admin@company.com': {
        id: 'temp-admin-001',
        email: 'admin@company.com',
        name: 'IT Manager',
        isAdmin: true
      },
      'user@company.com': {
        id: 'temp-user-001',
        email: 'user@company.com',
        name: 'General User',
        isAdmin: false
      }
    };

    // 이메일 또는 역할로 사용자 찾기
    let user;
    if (email && tempUsers[email]) {
      user = tempUsers[email];
    } else if (role === 'admin') {
      user = tempUsers['admin@company.com'];
    } else {
      user = tempUsers['user@company.com'];
    }

    // JWT 토큰 생성
    const jwtToken = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        isTempUser: true // 임시 사용자 표시
      },
      process.env.JWT_SECRET || 'temp-secret-key-for-development-only-please-change-in-production',
      { 
        expiresIn: '24h',
        issuer: 'capex-approval-app',
        audience: 'capex-users'
      }
    );

    res.json({
      success: true,
      token: jwtToken,
      user: user,
      message: '임시 로그인 성공 (개발/테스트용)',
      isTempLogin: true
    });

  } catch (error) {
    console.error('Temp login error:', error);
    res.status(500).json({ 
      error: '임시 로그인 실패',
      message: error.message
    });
  }
});

/**
 * JWT 토큰 인증 미들웨어
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

/**
 * 관리자 권한 확인 함수
 * 실제 구현에서는 Azure AD 그룹 멤버십을 확인해야 함
 */
async function checkAdminRole(accessToken, userId) {
  try {
    // Azure AD 그룹 멤버십 확인 (예시)
    const groupsResponse = await axios.get(
      `https://graph.microsoft.com/v1.0/me/memberOf`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    const groups = groupsResponse.data.value;
    const adminGroupId = process.env.ADMIN_GROUP_ID; // 환경변수로 설정
    
    return groups.some(group => group.id === adminGroupId);
  } catch (error) {
    console.error('Admin role check error:', error);
    return false;
  }
}

module.exports = router;
