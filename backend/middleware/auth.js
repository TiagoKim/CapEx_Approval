const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 인증 미들웨어
 * Authorization 헤더에서 Bearer 토큰을 추출하고 검증
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Authorization 헤더에 Bearer 토큰이 필요합니다.'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'temp-secret-key-for-development-only-please-change-in-production', (err, user) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ 
        error: 'Invalid or expired token',
        message: '유효하지 않거나 만료된 토큰입니다.'
      });
    }
    
    req.user = user;
    next();
  });
}

/**
 * 관리자 권한 확인 미들웨어
 * authenticateToken 후에 사용해야 함
 */
function requireAdmin(req, res, next) {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      error: 'Admin access required',
      message: '관리자 권한이 필요합니다.'
    });
  }
  next();
}

/**
 * 선택적 인증 미들웨어
 * 토큰이 있으면 검증하고, 없으면 다음으로 진행
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET || 'temp-secret-key-for-development-only-please-change-in-production', (err, user) => {
    if (err) {
      console.warn('Optional auth failed:', err.message);
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

module.exports = {
  authenticateToken,
  requireAdmin,
  optionalAuth
};
