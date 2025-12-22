"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useSaveShortCut from "@/app/hooks/useSaveShortCut";
import { addTodo } from "@/app/actions/todo";

export default function WriteTodo() {
  const [title, setTitle] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const Swal = require("sweetalert2");
  const router = useRouter();

  const submitTodo = async () => {
    if (!title.trim()) {
      Swal.fire({
        title: "알림!",
        text: "할 일을 입력해주세요!",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title);

      const { success } = await addTodo(formData);

      if (success) {
        Swal.fire({
          title: "성공!",
          text: "할 일 작성 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        setTitle("");
        router.push("/todo-list");
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
    submitTodo();
  };

  useSaveShortCut(submitTodo, title);
  return (
    <div>
      <div>
        <form className="flex gap-5" onSubmit={handleSubmit}>
          <Input
            placeholder="할 일을 작성해 주세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button disabled={isPending}>
            {isPending ? "추가중..." : "추가"}
          </Button>
        </form>
      </div>
    </div>
  );
}
