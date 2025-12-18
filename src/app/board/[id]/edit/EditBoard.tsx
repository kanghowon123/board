"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import MDEditor from "@uiw/react-md-editor";

import useSaveShortCut from "@/app/hooks/useSaveShortCut";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Board } from "../../../types/boards";
import { editBoard } from "@/app/actions/board";

export default function EditBoard({ board }: { board: Board }) {
  const [title, setTitle] = useState<string>(board.title);
  const [content, setContent] = useState<string>(board.content);

  const router = useRouter();
  const Swal = require("sweetalert2");
  const [isPending, startTransition] = useTransition();

  const submitBoard = async () => {
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        title: "알림!",
        text: "제목과 내용을 입력해주세요!",
        icon: "warning",
        confirmButtonText: "확인",
      });

      return;
    }

    startTransition(async () => {
      const formData = new FormData();

      formData.append("id", board.id.toString());
      formData.append("title", title);
      formData.append("content", content);

      const { success, data } = await editBoard(formData);

      setTitle("");
      setContent("");

      if (success) {
        Swal.fire({
          title: "성공!",
          text: "게시글 수정 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push(`/board/${data.id}`);
      } else {
        Swal.fire({
          title: "Error!",
          text: "수정중 에러 발생",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitBoard();
  };

  useSaveShortCut(submitBoard, title, content);
  return (
    <div className="max-w-7xl mx-auto py-20">
      <form id="board-form" onSubmit={handleSubmit}>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <MDEditor
          height={300}
          value={content}
          onChange={(e) => setContent(e || "")}
        />
        <Input type="hidden" name="content" value={content} />
        <Button type="submit" disabled={isPending}>
          {isPending ? "수정중..." : "수정"}
        </Button>
      </form>
    </div>
  );
}
