#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 CapEx Approval System 환경 설정을 시작합니다...\n');

  try {
    // 백엔드 환경변수 설정
    console.log('📝 백엔드 환경변수 설정');
    const backendEnv = await setupBackendEnv();
    await writeEnvFile('backend/.env', backendEnv);

    // 프론트엔드 환경변수 설정
    console.log('📝 프론트엔드 환경변수 설정');
    const frontendEnv = await setupFrontendEnv();
    await writeEnvFile('frontend/.env', frontendEnv);

    console.log('\n✅ 환경 설정이 완료되었습니다!');
    console.log('\n📋 다음 단계:');
    console.log('1. Azure AD 앱 등록 및 권한 설정');
    console.log('2. SharePoint 리스트 생성');
    console.log('3. npm run start 명령으로 애플리케이션 실행');
    console.log('\n📖 자세한 설정 방법은 SETUP_GUIDE.md를 참조하세요.');

  } catch (error) {
    console.error('❌ 환경 설정 중 오류가 발생했습니다:', error.message);
  } finally {
    rl.close();
  }
}

async function setupBackendEnv() {
  console.log('\n🔧 백엔드 환경변수 입력:');
  
  const tenantId = await question('Azure AD Tenant ID: ');
  const clientId = await question('Azure AD Client ID: ');
  const clientSecret = await question('Azure AD Client Secret: ');
  const siteId = await question('SharePoint Site ID: ');
  const listId = await question('SharePoint List ID: ');
  const jwtSecret = await question('JWT Secret (Enter for auto-generate): ') || generateJWTSecret();
  const adminGroupId = await question('Admin Group ID (선택사항): ');

  return {
    'AZURE_TENANT_ID': tenantId,
    'AZURE_CLIENT_ID': clientId,
    'AZURE_CLIENT_SECRET': clientSecret,
    'SHAREPOINT_SITE_ID': siteId,
    'SHAREPOINT_LIST_ID': listId,
    'PORT': '5000',
    'NODE_ENV': 'development',
    'JWT_SECRET': jwtSecret,
    'ADMIN_GROUP_ID': adminGroupId || ''
  };
}

async function setupFrontendEnv() {
  console.log('\n🔧 프론트엔드 환경변수 입력:');
  
  const apiUrl = await question('API URL (Enter for default): ') || 'http://localhost:5000/api';

  return {
    'REACT_APP_API_URL': apiUrl
  };
}

async function writeEnvFile(filePath, envVars) {
  const envContent = Object.entries(envVars)
    .filter(([key, value]) => value !== '')
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, envContent);
  console.log(`✅ ${filePath} 파일이 생성되었습니다.`);
}

function generateJWTSecret() {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
}

// 스크립트 실행
if (require.main === module) {
  setupEnvironment();
}

module.exports = { setupEnvironment };
