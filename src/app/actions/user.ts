"use server";

import { createClient } from "@/lib/supabase/server";
import { User } from "@/app/types/user";
import type { AuthResponse } from "@supabase/supabase-js";

// 회원가입
export async function signUp(
  userName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = await createClient();

  // 회원가입 API 호출 및 AuthResponse 반환
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        userName: userName,
      },
    },
  });

  if (error) {
    return {
      data: {
        user: null,
        session: null,
      },
      error: error,
    };
  }

  return {
    data: {
      user: data.user,
      session: data.session,
    },
    error: null,
  };
}

// 회원가입 시 중복 이메일 검사
export async function getUserByEmail(email: string): Promise<User | null> {
  const supabase = await createClient();

  // user 테이블에 회원 정보 조회
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.log("error : ", error);
    return null;
  }

  return data;
}

// 로그인
export async function Login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      data: {
        user: null,
        session: null,
      },
      error,
    };
  }

  return {
    data: {
      user: data.user,
      session: data.session,
    },
    error: null,
  };
}

// 로그인 유저 가져오기
export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user; // 로그인 안 돼 있으면 null
}

// 로그아웃
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
