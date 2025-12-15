// lib/uploadImage.ts
import { createServiceRoleClient } from "@/lib/supabase/server";

// 지피티가 짜준 문제있는 코드
// export async function uploadImage(file: File): Promise<string> {
//   const supabase = createServiceRoleClient();
//   const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

//   // File 객체 그대로 업로드
//   const { error } = await supabase.storage
//     .from("board-images")
//     .upload(fileName, file);

//   if (error) {
//     console.error("이미지 업로드 실패", error);
//     throw new Error("이미지 업로드 실패");
//   }

//   const { data } = supabase.storage.from("board-images").getPublicUrl(fileName);
//   return data.publicUrl;
// }

// 공식문서 보고 찾아서 작성한 코드
export async function uploadFile(file: File) {
  const supabase = createServiceRoleClient();
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error } = await supabase.storage
    .from("board-images")
    .upload(fileName, file);
  const { data } = supabase.storage.from("board-images").getPublicUrl(fileName);
  if (error) {
    console.log(error);
    return {
      success: false,
      error: "서버 파일 업로드 실패",
    };
  } else {
    return {
      success: true,
      data,
    };
  }
}
