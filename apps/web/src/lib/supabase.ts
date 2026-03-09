import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/** 공개 클라이언트 - 읽기 전용 (published 포스트만 조회 가능) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** 서버 전용 클라이언트 - RLS 우회, 모든 CRUD 가능 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
