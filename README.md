# 매일 1,000자 글쓰기

하루에 1,000자씩, 매일 조금씩 글쓰기 습관을 만들어주는 웹앱입니다. 카테고리별 글감을 받아 원고지처럼 편안하게 글을 쓰고, 완료하면 규칙 기반 첨삭 노트를 받아볼 수 있습니다.

## 주요 기능

- **오늘의 글감**: 에세이 / 상상·소설 / 자기계발 / 비평 / 자유주제 5개 카테고리별 글감 제공
- **글쓰기 에디터**: 벨로그 스타일 서식(굵게·기울임·밑줄·취소선·인용구), 실시간 글자 수와 진행률, 1초 디바운스 자동 저장
- **첨삭 노트**: 문장 길이·접속사 반복·강조어 남용·문장 시작 반복·문단 구성·마무리·서식 활용을 훑어보고 칭찬과 제안, 종합 총평을 알려주는 규칙 기반 첨삭 (완료 후엔 지난 글 보기에서도 다시 확인 가능)
- **아카이브**: 글을 쓴 날짜를 달력으로 한눈에 확인하고, 지난 글을 읽기 전용으로 다시 볼 수 있음
- **모음집**: 지금까지 쓴 글을 책처럼 엮어 월별로 보거나 목차와 함께 인쇄·PDF로 저장
- **로그인**: Supabase 기반 Google 로그인
- **설정**: 개인정보 안내, 기기 데이터 삭제, 회원 탈퇴(로그아웃 + 데이터 삭제)
- **리뷰 위젯 & 관리자 페이지**: 사용자 피드백을 남기면 관리자 계정만 볼 수 있는 페이지에서 확인

## 기술 스택

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Supabase (Auth, 리뷰 데이터)
- lucide-react (아이콘)

글쓰기 초고 자체는 아직 기기별 LocalStorage에만 저장되며, 로그인해도 기기 간 동기화는 되지 않습니다.

## 시작하기

```bash
npm install
npm run dev
```

### 환경 변수

`.env.example`을 참고해 `.env.local`을 만들고 Supabase 프로젝트 정보를 채워주세요.

```bash
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Supabase 설정

리뷰 위젯과 관리자 페이지를 쓰려면 `supabase/schema.sql`을 Supabase SQL 편집기에서 실행해야 합니다. 관리자 이메일은 [src/config.ts](src/config.ts)의 `ADMIN_EMAIL`과 `schema.sql`의 RLS 정책이 항상 같은 값이어야 합니다.

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 실행 |
