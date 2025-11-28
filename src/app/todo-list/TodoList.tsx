import { supabase } from "../supabaseClient";

import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

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
      <div>
        <p>작성된 리스트가 없습니다</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="pt-5">
        {data.map((todo) => (
          <li key={todo.id} className="py-2">
            <div className="flex justify-between items-center">
              <p>{todo.title}</p>
              <div className="flex gap-3">
                <FaEdit className="text-green-500 w-[30px] h-[30px]" />
                <FaTrashAlt className="text-red-500 w-[30px] h-[30px]" />
              </div>
            </div>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}
