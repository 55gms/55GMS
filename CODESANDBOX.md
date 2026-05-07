# CodeSandbox 실행 가이드

## CodeSandbox에서 55GMS 실행하기

이 프로젝트는 이제 CodeSandbox에서 직접 실행할 수 있습니다.

### 빠른 시작

1. **이 저장소를 CodeSandbox에 가져오기**
   - https://codesandbox.io에 방문
   - "Create Sandbox" 클릭
   - "Import Project" 선택
   - GitHub 저장소 URL 입력

2. **자동 실행**
   - 자동으로 `npm install` 실행
   - `npm start`로 서버 시작
   - 포트 3000에서 미리보기 제공

### 환경 설정 (선택사항)

CodeSandbox에서는 `.env` 파일을 생성할 수 있습니다:

```
API_KEY=your_api_key
workerAUTH=your_worker_auth_token
hcaptchaSecret=your_hcaptcha_secret
```

**주의**: `POSTGRES_URL`은 설정하지 마세요. CodeSandbox에서는 자동으로 SQLite 인메모리 데이터베이스를 사용합니다.

### 주요 변경사항

CodeSandbox 호환성을 위해 다음이 수정되었습니다:

- ✅ **데이터베이스**: PostgreSQL 미설정 시 자동으로 SQLite 사용
- ✅ **포트**: 자동으로 3000 사용 (CodeSandbox 기본)
- ✅ **CORS**: CodeSandbox 미리보기와 호환되도록 설정
- ✅ **에러 처리**: 데이터베이스 연결 실패 시 서버 계속 실행

### 제한사항

CodeSandbox 인메모리 데이터베이스 사용 시:

- 데이터는 서버 재시작 시 초기화됨
- 영구 저장이 필요한 경우 외부 PostgreSQL 데이터베이스 설정 필요

### 로컬 개발

로컬에서 PostgreSQL과 함께 실행하려면:

```bash
# .env 파일 생성
cp EXAMPLE.env .env

# POSTGRES_URL 설정
nano .env

# 데이터베이스 초기화 (처음 1회만)
node setup-db.js

# 서버 시작
npm start
# 또는
node .
```

### 배포

- **Render**: 자동으로 `node .` 실행
- **Vercel**: 제한적 지원 (서버리스 환경이므로 Socket.IO는 완전하지 않음)
