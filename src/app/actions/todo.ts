"use server";

import { Todo } from "../types/todo";
import { createClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

// 모든 투두 가져오기
export async function getAllTodos(): Promise<Todo[]> {
  noStore();

  const supabase = await createClient();
  const { data: todos, error } = await supabase
    .from("todo")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return todos || [];
}

// 투두 작성
export async function addTodo(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;

  if (!title.trim()) {
    return {
      success: false,
      error: "제목을 입력해 주세요",
    };
  }

  const { error } = await supabase
    .from("todo")
    .insert({ title })
    .select("*")
    .single();

  if (error) {
    console.log("투두 작성 실패", error);

    return {
      success: false,
      error: "투두 작성 실패",
    };
  }

  revalidatePath("/todo-list");

  return {
    success: true,
  };
}

// 투두 수정
export async function editTodo(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;

  if (!title.trim()) {
    return {
      success: false,
      error: "할 일을 입력해주세요",
    };
  }

  const { data, error } = await supabase
    .from("todo")
    .update({ title })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.log(error);
    return {
      success: false,
      error: "할 일 수정 실패",
    };
  }

  revalidatePath("/todo-list");

  return {
    success: true,
    data,
  };
}

// 투두 삭제
export async function deleteTodo(formData: FormData) {
  const supabase = await createClient();
  const id = Number(formData.get("id"));

  const { error } = await supabase.from("todo").delete().eq("id", id);
  if (error) {
    console.error(error);
    return {
      success: false,
      error: "에러발생",
    };
  }

  revalidatePath("/todo-list");
  return {
    success: true,
  };
}
