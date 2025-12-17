"use server"; // 이 파일은 서버 액션 파일입니다.

import { createClient } from "@/lib/supabase/server";
import { Board } from "@/app/types/Board";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

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

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const thumbnail = formData.get("thumbnail_url") as File | string | null;

  if (!title?.trim() || !content?.trim()) {
    return { success: false, error: "제목과 내용을 입력해주세요" };
  }

  let thumbnailUrl: string | null = null;
  if (thumbnail && thumbnail instanceof File) {
    const fileExt = thumbnail.name.split(".").pop();
    const fileName = `${nanoid()}.${fileExt}`;
    const filePath = `boards/${fileName}`; // 버킷에 있는 파일 경로를 입력

    const { error: uploadError } = await supabase.storage
      .from("boards")
      .upload(filePath, thumbnail);

    if (uploadError) {
      console.log("이미지 업로드 실패", uploadError);
      return { success: false, error: "이미지 업로드 실패" };
    }

    const { data } = supabase.storage.from("boards").getPublicUrl(filePath);

    if (!data) {
      console.log("이미지 URL 생성 실패");
      return { success: false, error: "이미지 URL 생성 실패" };
    }

    thumbnailUrl = data.publicUrl;
  }

  if (!thumbnailUrl) {
    thumbnailUrl = null; // 이미지를 넣지 않으면 null을 넣게끔 구현
  }

  const { data, error } = await supabase
    .from("board")
    .insert({ title, content, thumbnail_url: thumbnailUrl })
    .select("*")
    .single();

  if (error) {
    console.error("게시물 작성 실패", error);
    return { success: false, error: "게시물 작성 실패" };
  }
  revalidatePath("/board");

  return { success: true, data };
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

  const { error } = await supabase.from("board").delete().eq("id", id).single();

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
