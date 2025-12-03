"use client";

import { supabase } from "@/app/supabaseClient";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function BoardActions({ boardId }: { boardId: string }) {
  const router = useRouter();
  const Swal = require("sweetalert2");
  const handleDelete = async () => {
    const { error } = await supabase.from("board").delete().eq("id", boardId);

    if (error) {
      console.log(error);
    }
    Swal.fire({
      title: "성공!",
      text: "삭제 완료",
      icon: "success",
      confirmButtonText: "확인",
    });
    router.push("/board");
  };
  return (
    <div>
      <Button onClick={handleDelete}>삭제</Button>
    </div>
  );
}
