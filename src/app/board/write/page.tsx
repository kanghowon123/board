"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import useSaveShortCut from "@/app/hooks/useSaveShortCut";

import Title from "@/components/Title";
import { IMAGE } from "@/app/constants/images";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addBoard } from "@/app/actions/board";

export default function page() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPending, startTransition] = useTransition(); //Next.js/React에서 비동기 업데이트가 UI를 멈추지 않게 하는 기능.

  const Swal = require("sweetalert2");
  const router = useRouter();

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
      formData.append("title", title);
      formData.append("content", content);

      const { success, data } = await addBoard(formData);

      setTitle("");
      setContent("");

      if (success) {
        Swal.fire({
          title: "성공!",
          text: "게시글 작성 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push(`/board/${data.id}`);
      } else {
        Swal.fire({
          title: "Error!",
          text: "추가중 에러 발생",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitBoard();
  };

  useSaveShortCut(submitBoard, title, content);
  return (
    <div className="w-full">
      <Title image={IMAGE.board1}>게시글 작성</Title>
      <div className="py-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <form
            id="post-from"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
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
            <Input type="hidden" name="content" value={content} />
            <Input type="file" />
            <Button disabled={isPending}>
              {isPending ? "추가중..." : "추가"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
