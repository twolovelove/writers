-- Supabase SQL 편집기(SQL Editor)에서 그대로 실행하세요. 여러 번 실행해도 안전합니다.

-- 아래에서 이름으로 지정해 재생성하는 정책 외에, 과거에 Table Editor 등으로 만들어졌다가
-- 잊혀진 정책(예: 기본 템플릿인 "Enable read access for all users")이 테이블에 남아있으면
-- RLS는 여러 정책을 OR로 평가하므로 그 legacy 정책 하나만으로 의도치 않게 전체 공개가 될 수 있다.
-- 그래서 이름을 몰라도 안전하게 정리되도록, admins/reviews/entries의 기존 정책을 전부 지우고
-- 아래에서 의도한 정책만 다시 만든다.
do $$
declare
  pol record;
begin
  for pol in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public' and tablename in ('admins', 'reviews', 'entries')
  loop
    execute format('drop policy if exists %I on %I', pol.policyname, pol.tablename);
  end loop;
end $$;

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

-- updated_at은 클라이언트 기기 시계가 아니라 항상 서버 시각을 기준으로 채운다.
-- (기기 시계가 어긋나 있으면 오래된 기기의 저장이 최신 저장을 덮어쓸 수 있었던 문제를 방지)
create or replace function set_entries_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists entries_set_updated_at on entries;
create trigger entries_set_updated_at
  before insert or update on entries
  for each row execute function set_entries_updated_at();

-- 회원 탈퇴 시 auth.users에서 계정이 완전히 삭제되면(supabase/functions/delete-account 참고)
-- 이 계정을 참조하던 entries/reviews/admins 행도 함께 정리되도록 cascade를 건다.
alter table entries drop constraint if exists entries_user_id_fkey;
alter table entries add constraint entries_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table reviews drop constraint if exists reviews_user_id_fkey;
alter table reviews add constraint reviews_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table admins drop constraint if exists admins_user_id_fkey;
alter table admins add constraint admins_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
