# Dockerized NodeJS, PostgreSQL, and Prisma Project

This project is a full-stack to-do application that is containerized using Docker. It uses a Node.js backend, a PostgreSQL database, the Prisma ORM, and server-side sessions for authentication.

## Description

This application allows users to register, log in, and manage their to-do lists. The backend is built with Node.js and Express, and it uses a PostgreSQL database with the Prisma ORM to store user and to-do data. Authentication is handled using server-side sessions (HttpOnly cookies). The entire application is containerized using Docker for easy deployment and scalability.

## Getting Started

### Prerequisites

* Docker
* Docker Compose

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/Eddie000321/backend-nodejs-expressjs-postgresqlPrisma-with-docker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd startWithDocker
   ```
3. Create a `.env` file in the root of the project and add the following environment variables:
   ```
   DATABASE_URL="postgresql://user:password@db:5432/db_name"
   SESSION_SECRET="your_session_secret"
   ```
4. Build and run the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

The application will be available at `http://localhost:5001`.

## Testing

- Automated API tests are included. To run inside Docker:
  - `docker compose run --rm app sh -c "npx prisma migrate deploy && node --test"`

## API Endpoints

The following API endpoints are available:

### Authentication

* `POST /auth/register`: Registers a new user and establishes a session (cookie).
* `POST /auth/login`: Logs in a user and establishes a session (cookie).
* `GET /auth/me`: Returns the current session user.
* `POST /auth/logout`: Destroys the current session.

### To-Dos

* `GET /todos`: Fetches all to-dos for the authenticated user.
* `POST /todos`: Creates a new to-do for the authenticated user.
* `PUT /todos/:id`: Updates a to-do for the authenticated user.
* `DELETE /todos/:id`: Deletes a to-do for the authenticated user.

You can use the `todo-app.rest` file to test the API endpoints.

<details>
<summary>테스트/품질 노트 — 클릭하여 펼치기</summary>

## 자동화 테스트의 의의
- 수동 REST 호출 대비, 회귀 방지/재현성/커버리지 면에서 신뢰도를 높입니다.
- 세션 쿠키 흐름을 Supertest agent로 실제 시나리오처럼 검증합니다.

## 실행 팁
- 컨테이너 내부에서 DB 마이그레이션 후 `node --test`로 실행하는 방식을 권장합니다.
- 케이스: 회원가입/중복가입/비인증 접근 거절/로그인 후 TODO CRUD 등 핵심 플로우 포함.

</details>

## Database Schema

The database schema is defined in the `prisma/schema.prisma` file. It consists of two models: `User` and `Todo`.

### User Model

* `id`: The unique identifier for the user.
* `username`: The user's username.
* `password`: The user's hashed password.

### Todo Model

* `id`: The unique identifier for the to-do.
* `task`: The description of the to-do.
* `completed`: A boolean indicating whether the to-do is completed.
* `userId`: The ID of the user who owns the to-do.

<details>
<summary>설계 노트(인증/세션) — 클릭하여 펼치기</summary>

## 선택 배경
- 기존 인프라(Postgres) 재사용: 추가 인프라/비용 없이 세션을 영속 저장.
- 단순 운영: 컴포넌트 수 최소화, 배포/백업/모니터링 단순화.
- 즉시 무효화: 서버 저장소 기반이라 로그아웃·권한변경 시 즉각 차단.
- 보안 기본기: HttpOnly 쿠키 기반으로 프론트 저장소(XSS) 유출 위험 감소.

## 포트폴리오 어필 포인트
- 요구사항 기반 아키텍처 판단: JWT(무상태) vs 서버 세션(상태) 트레이드오프 설명 가능.
- 엔드투엔드 리팩터링: 라우트/미들웨어/프론트 전반 수정 역량.
- 보안 감수성: 쿠키 플래그(HttpOnly/SameSite/Secure), 세션 만료·재생성 등 적용 설명.
- 비용 효율: 추가 캐시 없이 DB로 충분한 성능/지속성 달성.

## 트레이드오프
- 성능/지연: 초고트래픽에선 인메모리 캐시(Redis)보다 느릴 수 있음.
- DB 부하: 세션 읽기/쓰기 증가 → TTL/청소·인덱스 관리 필요.
- 상태성: 완전 무상태(JWT) 대비 수평확장 시 고려 지점 존재.

## 운영 메모
- 세션 저장소: 개발용으로는 메모리, 프로덕션은 Postgres 스토어 권장.
- 쿠키 설정: HttpOnly, SameSite=Lax/Strict, 프로덕션에서 Secure + `app.set('trust proxy', 1)` 고려.
- 세션 정책: 로그인 시 세션 재생성(regenerate), 롤링, Idle/Absolute TTL.
- CSRF: `csurf` 등 토큰 기반 방어 도입 권장.
- 구성 값: `SESSION_SECRET` 사용, JWT 토큰은 미사용(필요 시 의존성/환경변수 제거 권장).

</details>
