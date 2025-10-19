const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ 
    message: 'CapEx Approval Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// 간단한 테스트 라우트
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working!',
    data: {
      server: 'CapEx Backend',
      version: '1.0.0',
      status: 'running'
    }
  });
});

// 404 핸들러
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`📊 CapEx Approval Backend API ready`);
  console.log(`🌍 Environment: development`);
  console.log(`🔗 Access at: http://localhost:${PORT}`);
});

module.exports = app;
