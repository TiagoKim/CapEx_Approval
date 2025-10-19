# CapEx Approval System - 상세 설정 가이드

이 가이드는 CapEx Approval System을 처음부터 설정하는 방법을 단계별로 안내합니다.

## 📋 목차

1. [시스템 요구사항](#시스템-요구사항)
2. [Azure AD 설정](#azure-ad-설정)
3. [SharePoint 설정](#sharepoint-설정)
4. [프로젝트 설정](#프로젝트-설정)
5. [환경변수 구성](#환경변수-구성)
6. [실행 및 테스트](#실행-및-테스트)
7. [문제 해결](#문제-해결)

## 🖥 시스템 요구사항

### 필수 소프트웨어
- **Node.js**: v16.0.0 이상
- **npm**: v8.0.0 이상 (또는 yarn v1.22.0 이상)
- **Git**: 최신 버전
- **웹 브라우저**: Chrome, Firefox, Safari, Edge (최신 버전)

### 권한 요구사항
- **Azure AD**: 테넌트 관리자 권한 또는 앱 등록 권한
- **SharePoint**: 사이트 소유자 권한
- **Microsoft Graph API**: 적절한 API 권한

## 🔐 Azure AD 설정

### 1단계: 앱 등록 생성

1. [Azure Portal](https://portal.azure.com)에 로그인
2. **Azure Active Directory** 서비스 선택
3. **앱 등록** > **새 등록** 클릭
4. 다음 정보 입력:
   ```
   이름: CapEx Approval System
   지원되는 계정 유형: 이 조직 디렉터리의 계정만
   리디렉션 URI: 
     - 플랫폼: Web
     - URI: http://localhost:3000/callback
   ```
5. **등록** 클릭

### 2단계: 클라이언트 비밀 생성

1. 앱 등록 페이지에서 **인증서 및 비밀** 선택
2. **새 클라이언트 비밀** 클릭
3. 다음 정보 입력:
   ```
   설명: CapEx App Secret
   만료: 24개월 (권장)
   ```
4. **추가** 클릭
5. **값** 필드의 값을 복사하여 안전한 곳에 저장 (한 번만 표시됨)

### 3단계: API 권한 설정

1. **API 사용 권한** 선택
2. **권한 추가** > **Microsoft Graph** 선택
3. **위임된 권한** 탭에서 다음 권한 추가:
   - `User.Read`
   - `User.ReadBasic.All`
4. **애플리케이션 권한** 탭에서 다음 권한 추가:
   - `Sites.ReadWrite.All`
   - `Group.Read.All`
5. **관리자 동의 부여** 클릭 (각 권한에 대해)

### 4단계: 인증 설정

1. **인증** 선택
2. **플랫폼 구성** 섹션에서:
   - **Web** 플랫폼 선택
   - **리디렉션 URI** 추가:
     - `http://localhost:3000/callback`
     - `http://localhost:3000` (선택사항)
3. **고급 설정** 섹션에서:
   - **액세스 토큰** 체크
   - **ID 토큰** 체크
4. **저장** 클릭

### 5단계: 관리자 그룹 생성 (선택사항)

1. **Azure Active Directory** > **그룹** 선택
2. **새 그룹** 클릭
3. 다음 정보 입력:
   ```
   그룹 유형: 보안
   그룹 이름: CapEx Administrators
   설명: CapEx 시스템 관리자
   ```
4. **만들기** 클릭
5. 그룹 ID를 복사하여 저장

## 📊 SharePoint 설정

### 1단계: 사이트 생성 또는 확인

1. SharePoint Online 사이트에 로그인
2. 기존 사이트 사용 또는 새 사이트 생성
3. 사이트 URL에서 사이트 ID 확인:
   ```
   https://{tenant}.sharepoint.com/sites/{sitename}
   사이트 ID는 URL의 마지막 부분
   ```

### 2단계: 사이트 ID 확인 (Graph API 사용)

1. [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) 접속
2. 다음 URL로 요청:
   ```
   GET https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{sitename}
   ```
3. 응답에서 `id` 필드 값 복사

### 3단계: 투자비 리스트 생성

1. SharePoint 사이트에서 **새로 만들기** > **앱** > **사용자 지정 목록**
2. 목록 이름: `CapEx Investments`
3. 설명: `투자비 승인 요청 관리`
4. **만들기** 클릭

### 4단계: 리스트 컬럼 추가

다음 컬럼들을 순서대로 추가:

| 컬럼명 | 타입 | 필수 | 기본값 | 설명 |
|--------|------|------|--------|------|
| Title | 단일 텍스트 | 예 | - | 제목 |
| Company | 단일 텍스트 | 예 | - | 법인명 |
| Team | 단일 텍스트 | 예 | - | 담당팀명 |
| User | 단일 텍스트 | 예 | - | 담당자 |
| Category | 선택 | 예 | - | 사용목적/카테고리 |
| Detail | 여러 줄 텍스트 | 예 | - | 상세 투자비 내역 |
| Amount | 숫자 | 예 | 0 | 투자비 금액 |
| DetailAmount | 숫자 | 아니오 | 0 | 투자비 내역 상세 |
| Month | 단일 텍스트 | 예 | - | 사용월 |
| Project | 단일 텍스트 | 아니오 | - | 관련 프로젝트 |
| ProjectSOP | 단일 텍스트 | 아니오 | - | 프로젝트 SOP |
| Status | 선택 | 예 | Pending | 승인 상태 |
| RequestedBy | 단일 텍스트 | 예 | - | 요청자 |
| RequestedDate | 날짜 및 시간 | 예 | - | 요청일 |
| ProcessedBy | 단일 텍스트 | 아니오 | - | 처리자 |
| ProcessedDate | 날짜 및 시간 | 아니오 | - | 처리일 |
| AdminComment | 여러 줄 텍스트 | 아니오 | - | 관리자 의견 |

#### 선택 컬럼 옵션 설정

**Category 컬럼 옵션:**
- 설비투자
- IT인프라
- 연구개발
- 마케팅
- 인사관리
- 기타

**Status 컬럼 옵션:**
- Pending
- Approved
- Rejected

### 5단계: 리스트 ID 확인

1. 리스트 설정 > **리스트 정보**
2. **리스트 ID** 복사
3. 또는 Graph API로 확인:
   ```
   GET https://graph.microsoft.com/v1.0/sites/{site-id}/lists
   ```

## 🚀 프로젝트 설정

### 1단계: 프로젝트 다운로드

```bash
# 프로젝트 클론 (Git 사용 시)
git clone https://github.com/your-repo/capex-approval-app.git
cd capex-approval-app

# 또는 압축 파일 다운로드 후 압축 해제
```

### 2단계: 백엔드 의존성 설치

```bash
cd backend
npm install
```

### 3단계: 프론트엔드 의존성 설치

```bash
cd ../frontend
npm install
```

## ⚙️ 환경변수 구성

### 1단계: 백엔드 환경변수 설정

`backend` 폴더에 `.env` 파일 생성:

```env
# Azure AD Configuration
AZURE_TENANT_ID=your-tenant-id-here
AZURE_CLIENT_ID=your-client-id-here
AZURE_CLIENT_SECRET=your-client-secret-here

# SharePoint Configuration
SHAREPOINT_SITE_ID=your-sharepoint-site-id-here
SHAREPOINT_LIST_ID=your-sharepoint-list-id-here

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Admin Group ID (선택사항)
ADMIN_GROUP_ID=your-admin-group-id-here
```

### 2단계: 프론트엔드 환경변수 설정

`frontend` 폴더에 `.env` 파일 생성:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3단계: 환경변수 값 확인

각 환경변수 값을 확인하고 올바르게 설정했는지 검증:

```bash
# 백엔드 환경변수 확인
cd backend
node -e "require('dotenv').config(); console.log('Tenant ID:', process.env.AZURE_TENANT_ID);"

# 프론트엔드 환경변수 확인
cd ../frontend
node -e "console.log('API URL:', process.env.REACT_APP_API_URL);"
```

## 🧪 실행 및 테스트

### 1단계: 백엔드 서버 시작

```bash
cd backend
npm start
```

정상 실행 시 다음과 같은 메시지가 표시됩니다:
```
🚀 Server running on port 5000
📊 CapEx Approval Backend API ready
🌍 Environment: development
```

### 2단계: 프론트엔드 서버 시작

새 터미널에서:

```bash
cd frontend
npm start
```

정상 실행 시 브라우저가 자동으로 열리고 `http://localhost:3000`에 접속됩니다.

### 3단계: 기본 기능 테스트

1. **로그인 테스트**
   - Azure AD 로그인 버튼 클릭
   - 회사 계정으로 로그인
   - 로그인 성공 확인

2. **투자비 요청 테스트**
   - 투자비 요청 폼 작성
   - 필수 필드 입력 확인
   - 제출 버튼 클릭
   - 성공 메시지 확인

3. **관리자 기능 테스트** (관리자 계정으로)
   - 대시보드 접근 확인
   - 통계 차트 표시 확인
   - 승인/거절 기능 테스트

## 🔧 문제 해결

### 일반적인 문제 및 해결방법

#### 1. 인증 관련 오류

**문제**: "Authentication failed" 오류
**해결방법**:
- Azure AD 앱 등록 설정 확인
- 리디렉션 URI 정확성 확인
- 클라이언트 비밀 만료 여부 확인
- 테넌트 ID 정확성 확인

#### 2. SharePoint 접근 오류

**문제**: "SharePoint access denied" 오류
**해결방법**:
- API 권한 확인 및 재부여
- 사이트 ID 정확성 확인
- 리스트 ID 정확성 확인
- 사용자 권한 확인

#### 3. CORS 오류

**문제**: "CORS policy" 오류
**해결방법**:
- 백엔드 CORS 설정 확인
- 프론트엔드 프록시 설정 확인
- 브라우저 개발자 도구에서 네트워크 탭 확인

#### 4. 환경변수 오류

**문제**: "Environment variable not found" 오류
**해결방법**:
- `.env` 파일 위치 확인
- 환경변수 이름 정확성 확인
- 값에 공백이나 특수문자 포함 여부 확인

### 로그 확인 방법

#### 백엔드 로그
```bash
cd backend
npm run dev
# 콘솔에서 상세 로그 확인
```

#### 프론트엔드 로그
```bash
cd frontend
npm start
# 브라우저 개발자 도구 콘솔에서 확인
```

### 디버깅 팁

1. **네트워크 탭 확인**
   - 브라우저 개발자 도구 > 네트워크 탭
   - API 요청/응답 상태 확인
   - 오류 코드 및 메시지 확인

2. **콘솔 로그 확인**
   - 브라우저 개발자 도구 > 콘솔 탭
   - JavaScript 오류 확인
   - API 응답 데이터 확인

3. **서버 로그 확인**
   - 백엔드 터미널에서 상세 로그 확인
   - 오류 스택 트레이스 분석

## 📞 지원 및 문의

문제가 지속되거나 추가 도움이 필요한 경우:

1. **GitHub Issues**: 프로젝트 저장소의 Issues 탭
2. **이메일 지원**: support@company.com
3. **문서 참조**: README.md 및 Wiki 페이지

## 🔄 업데이트 및 유지보수

### 정기 점검 사항

1. **의존성 업데이트**
   ```bash
   # 백엔드
   cd backend
   npm audit
   npm update
   
   # 프론트엔드
   cd frontend
   npm audit
   npm update
   ```

2. **보안 업데이트**
   - Azure AD 앱 비밀 갱신
   - JWT 시크릿 키 변경
   - 환경변수 보안 점검

3. **성능 모니터링**
   - API 응답 시간 확인
   - 메모리 사용량 모니터링
   - 오류 로그 분석

---

이 가이드를 따라하면 CapEx Approval System을 성공적으로 설정하고 실행할 수 있습니다. 추가 질문이나 문제가 있으시면 언제든지 문의해주세요.
