"use client";

import { supabase } from "@/app/supabaseClient";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddTodo() {
  const router = useRouter();
  const [title, setTitle] = useState<string>("");
  const Swal = require("sweetalert2");

  const handleAdd = async () => {
    const { error } = await supabase.from("todo").insert({ title });

    if (!title.trim()) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }

    Swal.fire({
      title: "성공!",
      text: "투두 작성 완료",
      icon: "success",
      confirmButtonText: "확인",
    });
    // alert("추가 완료");
    setTitle("");
    router.push("/todo-list");
  };
  return (
    <div>
      <div className="flex gap-5">
        <Input
          placeholder="할 일을 작성해 주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={handleAdd}>추가</Button>
      </div>
    </div>
  );
}
