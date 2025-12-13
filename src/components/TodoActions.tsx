"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { FaEdit, FaTrashAlt, FaCheck } from "react-icons/fa";
import useSaveShortCut from "@/app/hooks/useSaveShortCut";
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
  const router = useRouter();
  const Swal = require("sweetalert2");

  const handleEditOpen = () => setIsEdit(true);

  const handleEdit = async () => {
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
  };

  useSaveShortCut(handleEdit, editTitle);

  const handleDelete = async () => {
    const formData = new FormData();
    formData.append("id", String(todoId));

    const { success, error } = await deleteTodo(formData);

    if (!success) {
      Swal.fire({ title: "Error!", text: error, icon: "error" });
      return;
    }

    Swal.fire({ title: "성공!", text: "삭제 완료", icon: "success" });
    router.push("/todo-list");
  };

  return (
    <div className="flex justify-between gap-3 items-center">
      {isEdit ? (
        <>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
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
