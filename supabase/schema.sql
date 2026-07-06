-- Supabase SQL 편집기(SQL Editor)에서 그대로 실행하세요.
-- reviews 테이블: 사용자 피드백/리뷰를 저장하고, 관리자 계정만 전체를 조회할 수 있습니다.

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

-- 로그인한 사용자는 자기 자신의 리뷰만 추가할 수 있음
create policy "Users can insert their own reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 관리자 계정만 모든 리뷰를 조회할 수 있음 (이메일은 프로젝트에 맞게 필요 시 수정)
create policy "Admin can read all reviews"
  on reviews for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'twolovelove2232@gmail.com');
