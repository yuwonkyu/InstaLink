"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase";
import { sendEmail, welcomeEmail } from "@/lib/resend";
import { applyReferral } from "@/lib/referral";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ──────────────────────────────────────────────
// 회원가입
// ──────────────────────────────────────────────
export async function signUp(formData: FormData) {
  const email    = (formData.get("email")    as string).trim();
  const password =  formData.get("password") as string;
  const name     = (formData.get("name")     as string).trim();
  const ref      = (formData.get("ref")      as string | null)?.trim() ?? "";

  if (!email || !password || !name) {
    redirect("/auth/signup?error=모든 항목을 입력해주세요.");
  }
  if (password.length < 8) {
    redirect("/auth/signup?error=비밀번호는 8자 이상이어야 합니다.");
  }

  const supabase = await getSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
  }

  // 추천 코드가 있으면 가입 직후 자동 적용 (비동기, 실패해도 가입은 성공 처리)
  // Supabase 트리거가 auth.users INSERT 즉시 profiles 행을 생성하므로 바로 적용 가능
  if (ref && data.user) {
    applyReferral(data.user.id, ref).catch(() => {});
  }

  // 환영 이메일 발송
  const slugBase = email.split("@")[0];
  const tmpl = welcomeEmail(name, slugBase, SITE_URL);
  sendEmail({ to: email, ...tmpl }).catch(() => {});

  redirect("/auth/signup?success=1");
}

// ──────────────────────────────────────────────
// 로그인
// ──────────────────────────────────────────────
export async function signIn(formData: FormData) {
  const email    = (formData.get("email")    as string).trim();
  const password =  formData.get("password") as string;

  if (!email || !password) {
    redirect("/auth/login?error=이메일과 비밀번호를 입력해주세요.");
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

// ──────────────────────────────────────────────
// 로그아웃
// ──────────────────────────────────────────────
export async function signOut() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
