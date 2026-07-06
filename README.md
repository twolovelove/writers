# 매일 1,000자 글쓰기

[![CI](https://github.com/twolovelove/writers/actions/workflows/ci.yml/badge.svg)](https://github.com/twolovelove/writers/actions/workflows/ci.yml)

하루에 1,000자씩, 매일 조금씩 글쓰기 습관을 만들어주는 웹앱입니다. 카테고리별 글감을 받아 원고지처럼 편안하게 글을 쓰고, 완료하면 규칙 기반 첨삭 노트를 받아볼 수 있습니다.

## 주요 기능

- **오늘의 글감**: 에세이 / 상상·소설 / 자기계발 / 비평 / 자유주제 5개 카테고리별 글감 제공
- **글쓰기 에디터**: 벨로그 스타일 서식(굵게·기울임·밑줄·취소선·인용구), 실시간 글자 수와 진행률, 1초 디바운스 자동 저장
- **첨삭 노트**: 문장 길이·접속사 반복·강조어 남용·문장 시작 반복·문단 구성·마무리·서식 활용을 훑어보고 칭찬과 제안, 종합 총평을 알려주는 규칙 기반 첨삭 (완료 후엔 지난 글 보기에서도 다시 확인 가능)
- **아카이브**: 글을 쓴 날짜를 달력으로 한눈에 확인하고, 지난 글을 읽기 전용으로 다시 볼 수 있음
- **모음집**: 지금까지 쓴 글을 책처럼 엮어 월별로 보거나 목차와 함께 인쇄·PDF로 저장
- **로그인**: Supabase 기반 Google 로그인, 글 데이터를 계정에 백업해 기기 간 동기화
- **설정**: 개인정보 안내, 기기 데이터 삭제, 회원 탈퇴(로그아웃 + 데이터 삭제)
- **리뷰 위젯 & 관리자 페이지**: 사용자 피드백을 남기면 관리자 계정만 볼 수 있는 페이지에서 확인

## 기술 스택

- React 19 + TypeScript
- Vite 8
- Tailwind CSS
- Supabase (Auth, 글 데이터, 리뷰 데이터)
- lucide-react (아이콘)

글쓰기 초고는 이 기기의 LocalStorage에 즉시 저장되고, 로그인 계정에 연결된 Supabase에도 백업됩니다.
로그인할 때마다 이 기기와 서버의 글을 비교해 더 최신 쪽으로 맞추기 때문에, 다른 기기에서 로그인해도
지금까지 쓴 글을 이어서 볼 수 있습니다.

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

`VITE_GA_MEASUREMENT_ID`(GA4 측정 ID, `G-`로 시작)는 선택 사항입니다. 설정하면 페이지뷰와 함께
글쓰기 시작(`writing_started`)·완료(`writing_completed`)·미완료 이탈(`writing_exited_incomplete`)
이벤트가 GA4로 전송됩니다. 비워두면 분석 코드(`src/lib/analytics.ts`)가 아무 것도 하지 않습니다.

`VITE_SENTRY_DSN`도 선택 사항입니다. 설정하면 화면에서 잡히지 않는 에러(렌더링 오류, 글 동기화
실패 등)가 Sentry로 전송됩니다. 비워두면 모니터링 코드(`src/lib/monitoring.ts`)가 아무 것도 하지
않고 콘솔 경고만 남깁니다.

### Supabase 설정

`supabase/schema.sql`을 Supabase SQL 편집기에서 실행해야 글 데이터 백업(`entries`)과 리뷰 위젯·관리자 페이지(`reviews`, `admins`)가 동작합니다. 관리자 권한은 `admins` 테이블에 등록된 계정인지 여부로만 판단하므로(프론트엔드·RLS 공통 기준), 관리자를 추가하려면 SQL 편집기에서 다음을 실행하세요.

```sql
insert into admins (user_id)
select id from auth.users where email = '관리자로_지정할_이메일'
on conflict do nothing;
```

글 데이터(`entries`)는 LocalStorage 없이 Supabase에만 저장됩니다. 회원 탈퇴 시 계정 자체(`auth.users`)를
지우려면 `supabase/functions/delete-account` Edge Function도 배포해야 합니다 — 정확한 배포 명령은
`OPERATIONS.md`의 "배포 시점 직전 (P0.5)" 체크리스트를 참고하세요. 배포 전까지는 탈퇴 시 글 데이터만
삭제되고 로그인 계정 자체는 남아있습니다.

## 스크립트

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 타입 체크 후 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | Oxlint 실행 |
| `npm run test` | Vitest로 유닛 테스트 실행 |

## CI

`main` 브랜치에 push하거나 그쪽으로 PR을 열면 [GitHub Actions](.github/workflows/ci.yml)가 lint, 테스트, 타입 체크·빌드를 자동으로 실행합니다. 아직 별도 배포(호스팅)는 연결돼 있지 않습니다.
