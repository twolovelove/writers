-- Supabase SQL 편집기(SQL Editor)에서 그대로 실행하세요. 여러 번 실행해도 안전합니다.

-- admins 테이블: 관리자 권한을 부여할 계정의 user_id를 담아두는 단일 기준.
-- 프론트엔드(관리자 메뉴 노출)와 RLS 정책(리뷰 전체 조회 등)이 모두 이 테이블 하나만 참조하므로,
-- 관리자를 바꾸거나 추가할 때 여러 곳을 손대며 값이 어긋날 걱정이 없다.
create table if not exists admins (
  user_id uuid primary key references auth.users(id)
);

alter table admins enable row level security;

-- 로그인한 사용자는 자기 자신이 관리자인지만 확인할 수 있음 (다른 사람 목록은 볼 수 없음)
drop policy if exists "Users can check their own admin status" on admins;
create policy "Users can check their own admin status"
  on admins for select
  to authenticated
  using (auth.uid() = user_id);

-- 최초 1회, 관리자로 지정할 계정을 아래처럼 추가하세요 (이메일로 auth.users에서 조회):
-- insert into admins (user_id)
-- select id from auth.users where email = 'twolovelove2232@gmail.com'
-- on conflict do nothing;

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

-- admins 테이블에 등록된 계정만 모든 리뷰를 조회할 수 있음
drop policy if exists "Admin can read all reviews" on reviews;
create policy "Admin can read all reviews"
  on reviews for select
  to authenticated
  using (exists (select 1 from admins where admins.user_id = auth.uid()));

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
