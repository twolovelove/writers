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
drop policy if exists "Users can insert their own reviews" on reviews;
create policy "Users can insert their own reviews"
  on reviews for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 관리자 계정만 모든 리뷰를 조회할 수 있음 (이메일은 프로젝트에 맞게 필요 시 수정)
drop policy if exists "Admin can read all reviews" on reviews;
create policy "Admin can read all reviews"
  on reviews for select
  to authenticated
  using (auth.jwt() ->> 'email' = 'twolovelove2232@gmail.com');

-- entries 테이블: 사용자가 쓴 글(초고)을 기기 간 백업/동기화하기 위한 저장소.
-- 본인 외에는 관리자를 포함해 누구도 읽을 수 없다 (reviews 테이블과의 차이).
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  date date not null,
  category text not null,
  prompt_id text not null,
  title text not null default '',
  content text not null default '',
  char_count int not null default 0,
  completed boolean not null default false,
  feedback jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, date, category)
);

alter table entries enable row level security;

drop policy if exists "Users can manage their own entries" on entries;
create policy "Users can manage their own entries"
  on entries for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
