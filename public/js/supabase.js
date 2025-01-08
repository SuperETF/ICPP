const SUPABASE_URL = "https://tytfpjqyufjsmflvrvia.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dGZwanF5dWZqc21mbHZydmlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMjY0NjUsImV4cCI6MjA1MDgwMjQ2NX0.USH-D_E5wAg6_zzlg3wHB6uJRrkCgMbsDAqqrZ8mXX0";

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 로그인 함수
async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("로그인 실패:", error.message);
    return null;
  }
  return data;
}

// 로그아웃 함수
async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("로그아웃 실패:", error.message);
  }
}

// 현재 세션 조회 함수
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("세션 조회 실패:", error.message);
    return null;
  }
  return data.session;
}
