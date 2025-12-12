"use server"; // 이 파일은 서버 액션 파일입니다.

import { createClient } from "@/lib/supabase/server";
import { Board } from "@/app/types/Board";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// 보드 리스트
export async function getAllBoards(): Promise<Board[] | null> {
  noStore();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("board")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching boards:", error);
    return null;
  }
  return data;
}

// 보드 아이디로 단일 보드 가져오기
export async function getBoardById(id: number): Promise<Board | null> {
  noStore();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("board")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error fetching board by ID:", error);
    return null;
  }
  return data;
}

// 게시물 작성
export async function addBoard(formData: FormData) {
  const supabase = await createClient();

  // formData에 담긴 값을 꺼냄
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title.trim() || !content.trim()) {
    return {
      success: false,
      error: "제목과 내용을 입력해주세요",
    };
  }

  const { data, error } = await supabase
    .from("board")
    .insert({ title, content })
    .select("*")
    .single();

  if (error) {
    console.error("게시물 작성 실패", error);

    return {
      success: false,
      error: "게시물 작성 실패",
    };
  }

  revalidatePath("/board");

  return {
    success: true,
    data,
  };
}

// 게시물 수정
export async function editBoard(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  if (!title.trim() || !content.trim()) {
    return {
      success: false,
      error: "제목과 내용을 입력해주세요",
    };
  }

  const { data, error } = await supabase
    .from("board")
    .update({ title, content })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("게시물 수정 실패", error);

    return {
      success: false,
      error: "게시물 수정 실패",
    };
  }

  revalidatePath("/board");
  revalidatePath(`/board/${data.id}`);

  return {
    success: true,
    data,
  };
}

// 게시물 삭제
export async function deleteBoard(id: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("board").delete().eq("id", id);

  if (error) {
    console.error("게시물 삭제 실패", error);

    return {
      success: false,
      error: "게시물 삭제 실패",
    };
  }

  revalidatePath("/board");

  return {
    success: true,
  };
}
