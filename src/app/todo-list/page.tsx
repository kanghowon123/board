"use client";

import { supabase } from "@/app/supabaseClient";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IMAGE } from "@/app/constants/images";

import Title from "@/components/Title";
import TodoList from "./TodoList";

export default function TodoListPage() {
  const [title, setTitle] = useState<string>("");

  const handleAdd = async () => {
    const { error } = await supabase.from("todo").insert({ title });

    if (!title.trim()) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }

    alert("추가 완료");
    setTitle("");
  };
  return (
    <section>
      <Title image={IMAGE.todo1img}>투두 리스트</Title>
      <div className="py-20">
        <div className="max-w-[1200px] mx-auto p-10 bg-gray-50 rounded-2xl">
          <div className="flex gap-5">
            <Input
              placeholder="할 일을 작성해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={handleAdd}>추가</Button>
          </div>
          <TodoList />
        </div>
      </div>
    </section>
  );
}
