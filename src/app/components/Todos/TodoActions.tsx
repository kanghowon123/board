"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { FaEdit, FaTrashAlt, FaCheck } from "react-icons/fa";
import { editTodo, deleteTodo } from "@/app/actions/todo";

export default function TodoItem({
  todoId,
  todoTitle,
}: {
  todoId: number;
  todoTitle: string;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(todoTitle);
  const [isPending, startTransition] = useTransition();

  const router = useRouter();
  const Swal = require("sweetalert2");

  const handleEditOpen = () => setIsEdit(true);

  const handleEdit = () => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(todoId));
      formData.append("title", editTitle);

      const { success, error } = await editTodo(formData);

      if (!success) {
        Swal.fire({ title: "Error!", text: error, icon: "error" });
        return;
      }

      Swal.fire({ title: "성공!", text: "수정 완료", icon: "success" });
      setIsEdit(false);
      router.push("/todo-list");
    });
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제 후에는 복구할 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) {
      return;
    }
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(todoId));

      const { success, error } = await deleteTodo(formData);

      if (!success) {
        Swal.fire({ title: "Error!", text: error, icon: "error" });
        return;
      }

      Swal.fire({ title: "성공!", text: "삭제 완료", icon: "success" });
      router.push("/todo-list");
    });
  };

  return (
    <div className="flex justify-between gap-3 items-center">
      {isEdit ? (
        <>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            disabled={isPending}
          />
          <div className="flex gap-2">
            <button onClick={handleEdit}>
              <FaCheck className="text-green-500 w-[30px] h-[30px]" />
            </button>
            <button onClick={handleDelete}>
              <FaTrashAlt className="text-red-500 w-[30px] h-[30px]" />
            </button>
          </div>
        </>
      ) : (
        <>
          <p>{todoTitle}</p>
          <div className="flex gap-2">
            <button onClick={handleEditOpen}>
              <FaEdit className="text-green-500 w-[30px] h-[30px]" />
            </button>
            <button onClick={handleDelete}>
              <FaTrashAlt className="text-red-500 w-[30px] h-[30px]" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
