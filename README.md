# CapEx Approval System

제조업 글로벌 법인/공장에서 사용하는 투자비 승인 웹 애플리케이션입니다.

## 🚀 주요 기능

### 일반 사용자
- 투자비 승인 요청 작성 및 제출
- 요청 상태 확인 및 수정
- 임시 저장 기능

### 관리자
- 투자비 요청 승인/거절/보류 처리
- 관리자 의견 입력
- 대시보드를 통한 통계 확인
- 승인 상태별, 법인별, 월별 차트 표시

## 🛠 기술 스택

### Backend
- **Node.js** + **Express**
- **Microsoft Graph API** (SharePoint Online 연동)
- **Azure AD** 인증
- **JWT** 토큰 기반 인증

### Frontend
- **React 18**
- **React Router** (라우팅)
- **Recharts** (차트 라이브러리)
- **Styled Components** (스타일링)
- **React Hook Form** (폼 관리)
- **Axios** (API 통신)

## 📋 사전 요구사항

1. **Node.js** (v16 이상)
2. **npm** 또는 **yarn**
3. **Azure AD** 앱 등록
4. **SharePoint Online** 사이트 및 리스트
5. **Microsoft Graph API** 권한

## 🔧 설치 및 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 백엔드 의존성 설치
cd backend
npm install

# 프론트엔드 의존성 설치
cd ../frontend
npm install
```

### 2. Azure AD 앱 등록

1. [Azure Portal](https://portal.azure.com)에 로그인
2. **Azure Active Directory** > **앱 등록** > **새 등록**
3. 앱 정보 입력:
   - **이름**: CapEx Approval System
   - **지원되는 계정 유형**: 조직 디렉터리의 계정만
   - **리디렉션 URI**: `http://localhost:3000/callback`
4. **등록** 클릭

### 3. API 권한 설정

1. 앱 등록 페이지에서 **API 사용 권한** 클릭
2. **권한 추가** > **Microsoft Graph** 선택
3. 다음 권한 추가:
   - `User.Read` (위임)
   - `Sites.ReadWrite.All` (애플리케이션)
   - `Group.Read.All` (애플리케이션)
4. **관리자 동의 부여** 클릭

### 4. 클라이언트 비밀 생성

1. **인증서 및 비밀** > **새 클라이언트 비밀**
2. 설명 입력 후 **만료** 기간 선택
3. **추가** 클릭 후 **값** 복사 (한 번만 표시됨)

### 5. SharePoint 리스트 생성

1. SharePoint 사이트에서 **새로 만들기** > **앱** > **사용자 지정 목록**
2. 목록 이름: `CapEx Investments`
3. 다음 컬럼 추가:

| 컬럼명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| Title | 단일 텍스트 | 예 | 제목 |
| Company | 단일 텍스트 | 예 | 법인명 |
| Team | 단일 텍스트 | 예 | 담당팀명 |
| User | 단일 텍스트 | 예 | 담당자 |
| Category | 선택 | 예 | 사용목적/카테고리 |
| Detail | 여러 줄 텍스트 | 예 | 상세 투자비 내역 |
| Amount | 숫자 | 예 | 투자비 금액 |
| DetailAmount | 숫자 | 아니오 | 투자비 내역 상세 |
| Month | 단일 텍스트 | 예 | 사용월 |
| Project | 단일 텍스트 | 아니오 | 관련 프로젝트 |
| ProjectSOP | 단일 텍스트 | 아니오 | 프로젝트 SOP |
| Status | 선택 | 예 | 승인 상태 |
| RequestedBy | 단일 텍스트 | 예 | 요청자 |
| RequestedDate | 날짜 및 시간 | 예 | 요청일 |
| ProcessedBy | 단일 텍스트 | 아니오 | 처리자 |
| ProcessedDate | 날짜 및 시간 | 아니오 | 처리일 |
| AdminComment | 여러 줄 텍스트 | 아니오 | 관리자 의견 |

### 6. 환경변수 설정

#### Backend 환경변수 (backend/.env)

```env
# Azure AD Configuration
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# SharePoint Configuration
SHAREPOINT_SITE_ID=your-sharepoint-site-id
SHAREPOINT_LIST_ID=your-sharepoint-list-id

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-jwt-secret-key

# Admin Group ID (선택사항)
ADMIN_GROUP_ID=your-admin-group-id
```

#### Frontend 환경변수 (frontend/.env)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 7. SharePoint 사이트 및 리스트 ID 확인

#### 사이트 ID 확인
1. SharePoint 사이트 URL에서 `sites/` 다음의 GUID 추출
2. 또는 Graph API로 확인: `https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{sitename}`

#### 리스트 ID 확인
1. SharePoint 사이트에서 리스트 설정 > **리스트 정보**
2. **리스트 ID** 복사
3. 또는 Graph API로 확인: `https://graph.microsoft.com/v1.0/sites/{site-id}/lists`

## 🚀 실행 방법

### 1. 백엔드 서버 시작

```bash
cd backend
npm start
# 또는 개발 모드
npm run dev
```

### 2. 프론트엔드 서버 시작

```bash
cd frontend
npm start
```

### 3. 애플리케이션 접속

브라우저에서 `http://localhost:3000` 접속

## 📱 사용 방법

### 일반 사용자
1. **Azure AD 로그인** 또는 **수동 로그인**
2. **투자비 요청** 페이지에서 요청서 작성
3. **임시저장** 또는 **승인 요청 제출**
4. **요청 목록**에서 상태 확인

### 관리자
1. Azure AD 로그인 (관리자 권한 필요)
2. **대시보드**에서 통계 및 차트 확인
3. **승인 관리** 탭에서 요청 승인/거절/보류 처리
4. 관리자 의견 입력

## 🔐 권한 설정

### Azure AD 그룹 기반 권한 관리

1. Azure AD에서 관리자 그룹 생성
2. 그룹 ID를 `ADMIN_GROUP_ID` 환경변수에 설정
3. 사용자를 해당 그룹에 추가

### 수동 권한 설정

`backend/routes/auth.js`의 `checkAdminRole` 함수에서 권한 로직 수정:

```javascript
async function checkAdminRole(accessToken, userId) {
  // 사용자 이메일 기반 권한 확인
  const adminEmails = ['admin@company.com', 'manager@company.com'];
  return adminEmails.includes(user.email);
}
```

## 🐛 문제 해결

### 일반적인 문제

1. **인증 실패**
   - Azure AD 앱 등록 설정 확인
   - 리디렉션 URI 일치 여부 확인
   - 클라이언트 비밀 만료 확인

2. **SharePoint 접근 오류**
   - API 권한 확인
   - 사이트/리스트 ID 정확성 확인
   - 테넌트 ID 확인

3. **CORS 오류**
   - 백엔드 CORS 설정 확인
   - 프론트엔드 프록시 설정 확인

### 로그 확인

```bash
# 백엔드 로그
cd backend
npm run dev

# 프론트엔드 로그
cd frontend
npm start
```

## 📊 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/refresh` - 토큰 갱신
- `GET /api/auth/me` - 사용자 정보
- `GET /api/auth/login-url` - 로그인 URL

### 투자비 관리
- `POST /api/investments` - 투자비 요청 생성
- `GET /api/investments` - 투자비 요청 목록
- `GET /api/investments/:id` - 투자비 요청 상세
- `PUT /api/investments/:id` - 투자비 요청 수정
- `DELETE /api/investments/:id` - 투자비 요청 삭제
- `PATCH /api/investments/:id/status` - 상태 변경

### 대시보드
- `GET /api/dashboard/stats` - 통계 데이터
- `GET /api/dashboard/recent` - 최근 요청
- `GET /api/dashboard/user-stats` - 사용자별 통계

## 🔒 보안 고려사항

1. **HTTPS 사용** (프로덕션 환경)
2. **환경변수 보안** 관리
3. **JWT 토큰 만료** 시간 설정
4. **API 요청 제한** (Rate Limiting)
5. **입력값 검증** 및 **XSS 방지**

## 📈 성능 최적화

1. **데이터베이스 인덱싱** (SharePoint 컬럼)
2. **API 응답 캐싱**
3. **이미지 최적화**
4. **코드 분할** (React)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 다음으로 연락해주세요:

- **이메일**: support@company.com
- **이슈 트래커**: GitHub Issues
- **문서**: [Wiki 페이지](https://github.com/your-repo/wiki)

## 🔄 업데이트 내역

### v1.0.0 (2024-01-01)
- 초기 릴리스
- 기본 투자비 승인 기능
- Azure AD 인증
- SharePoint 연동
- 관리자 대시보드

---

**CapEx Approval System** - 효율적인 투자비 승인 관리 솔루션
