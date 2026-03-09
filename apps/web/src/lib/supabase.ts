import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

const getSupabaseClient = () => {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase environment variables are not set');
  }

  _supabase = createClient(url, anonKey);
  return _supabase;
};

const getSupabaseAdmin = () => {
  if (_supabaseAdmin) return _supabaseAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase admin environment variables are not set');
  }

  _supabaseAdmin = createClient(url, serviceRoleKey);
  return _supabaseAdmin;
};

/** 공개 클라이언트 - 읽기 전용 (published 포스트만 조회 가능) */
export const supabase = { get: getSupabaseClient };

/** 서버 전용 클라이언트 - RLS 우회, 모든 CRUD 가능 */
export const supabaseAdmin = { get: getSupabaseAdmin };
