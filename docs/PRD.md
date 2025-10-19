목적: 제조업 글로벌 법인/공장에서 사용하는 투자비 승인 웹페이지를 만들어 주세요.

환경 및 데이터:
1. 백엔드: Node.js + Express
2. 프론트엔드: React
3. 데이터베이스: SharePoint Online 리스트 (Microsoft Graph API 통해 CRUD)
4. Azure AD 앱 등록 사용: Access Token 발급, Graph API 호출

기능 요구사항:
1. 일반 사용자:
   - 투자비 승인 요청 작성
   - 요청 폼 항목: 
     - 법인명(company)
     - 담당팀명(team)
     - 담당자(user)
     - 제목(title)
     - 사용목적/카테고리(category)
     - 상세 투자비 내역(detail)
     - 투자비 금액(amount)
     - 투자비 내역 상세(detailAmount)
     - 사용월(month)
     - 관련 프로젝트(project)
     - 프로젝트 SOP(projectSOP)

2. 관리자:
   - 승인 / 거절 / 보류 버튼
   - 의견(adminComment) 입력
   - 대시보드에서 모든 요청 확인

3. 대시보드:
   - 승인 상태별 Pie 그래프
   - 법인별 투자비 합계 Bar 그래프
   - 월별 투자비 추이 Line 그래프
   - 요청 목록 테이블

4. 인증/권한:
   - Azure AD 앱을 통해 Graph API 호출 시 Access Token 사용
   - 일반 사용자와 관리자 권한 구분

5. 실행 환경:
   - 로컬에서 바로 실행 가능
   - 설치 및 실행 방법 포함
   - Cursor AI에서 복사하여 바로 프로젝트 세트 생성 가능

출력 파일 구조:

investment-approval-app/
├─ backend/
│   ├─ package.json
│   └─ server.js  (Graph API 기반 CRUD, Access Token 발급, 요청/승인 처리)
├─ frontend/
│   ├─ package.json
│   └─ src/
│       ├─ App.js  (권한 확인 후 Form / Dashboard 분기)
│       ├─ index.js
│       └─ components/
│           ├─ Form.js  (투자비 요청 작성)
│           └─ Dashboard.js  (관리자 대시보드 + 그래프)

추가 요구사항:

각 파일에 충분한 주석 포함

Graph API 호출 코드 포함

React 프론트엔드에서 Axios 사용하여 백엔드 호출

승인/거절/보류, 의견 입력, 대시보드 그래프 모두 구현

Cursor에서 그대로 실행 가능하도록 구성

필요 시 SharePoint 사이트 ID, 리스트 ID, Azure AD tenant/client ID 입력 방법 안내 포함