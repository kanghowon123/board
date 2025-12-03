"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { supabase } from "../supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import MDEditor from "@uiw/react-md-editor";

export default function AddBoard() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const Swal = require("sweetalert2");
  const router = useRouter();

  const handleAdd = async () => {
    const { error } = await supabase.from("board").insert({ title, content });

    if (!title.trim() || !content.trim()) {
      return;
    }

    if (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "추가중 에러 발생",
        icon: "error",
        confirmButtonText: "확인",
      });
      return;
    }

    setTitle("");
    setContent("");
    Swal.fire({
      title: "성공!",
      text: "게시글 작성 완료",
      icon: "success",
      confirmButtonText: "확인",
    });
    router.push("/board");
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요."
      />
      <MDEditor
        height={300}
        value={content}
        onChange={(e) => setContent(e || "")}
      />
      <Button onClick={handleAdd}>추가</Button>
    </div>
  );
}
