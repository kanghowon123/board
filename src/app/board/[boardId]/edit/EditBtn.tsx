"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";

import { supabase } from "@/app/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditBtn({
  boardId,
  editTitle,
  editContent,
}: {
  boardId: string;
  editTitle: string;
  editContent: string;
}) {
  const [title, setTitle] = useState(editTitle || "");
  const [content, setContent] = useState(editContent || "");
  const router = useRouter();
  const Swal = require("sweetalert2");

  const handleEdit = async () => {
    const { error } = await supabase
      .from("board")
      .update({ title, content })
      .eq("id", boardId);

    if (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "추가중 에러 발생",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    Swal.fire({
      title: "성공!",
      text: "게시글 수정 완료",
      icon: "success",
      confirmButtonText: "확인",
    });
    router.push("/board");
  };
  return (
    <div className="max-w-7xl mx-auto py-20">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      <MDEditor
        height={300}
        value={content}
        onChange={(e) => setContent(e || "")}
      />

      <Button onClick={handleEdit}>완료</Button>
    </div>
  );
}
