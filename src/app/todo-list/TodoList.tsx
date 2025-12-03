export const revalidate = 0;

import Actions from "@/components/TodoActions";
import { supabase } from "../supabaseClient";

export default async function TodoList() {
  const { data, error } = await supabase
    .from("todo")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  if (data.length === 0) {
    return (
      <div className="text-center pt-20 pb-10 text-[20px]">
        <p>작성된 리스트가 없습니다.</p>
        <br />
        <p>할 일을 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="pt-10">
        {data.map((todo) => (
          <li key={todo.id} className="py-3">
            <div className="flex justify-between items-center">
              <p>{todo.title}</p>
              <Actions todoId={todo.id} todoTitle={todo.title} />
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
