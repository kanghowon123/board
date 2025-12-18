"use server";
import { createClient } from "@/lib/supabase/server";
import { Household } from "../types/households";

// 리스트 불러오기
export async function getAllHousehold(): Promise<Household[]> {
  const supabase = await createClient();

  const { data: households, error } = await supabase
    .from("household")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
  }
  return households || [];
}

export async function addIncome(formData: FormData) {
  const supabase = await createClient();

  const date = formData.get("date") as string;
  const amount = formData.get("amount") as string;
  const classification = formData.get("classification") as string;
  const property = formData.get("property") as string;
  const content = formData.get("content") as string;
  const memo = formData.get("memo") as string;

  if (
    !date.trim() ||
    !amount.trim() ||
    !classification.trim() ||
    !property.trim() ||
    !content.trim() ||
    !memo.trim()
  ) {
    return {
      seccess: false,
      error: "빈 값을 채워 주세요",
    };
  }
  const { data, error } = await supabase
    .from("household")
    .insert({ date, amount, classification, property, content, memo })
    .select("*")
    .single();

  if (error) {
    console.log(error);
    return {
      success: false,
      error: "수입 작성 실패",
    };
  }

  return {
    success: true,
    data,
  };
}
