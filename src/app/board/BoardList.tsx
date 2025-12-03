export const revalidate = 0;
import { supabase } from "../supabaseClient";
import Swal from "sweetalert2";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BoardList() {
  const { data: boards, error } = await supabase
    .from("board")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);

    Swal.fire({
      title: "Error!",
      text: "게시판 리스트 불러오는 중 에러",
      icon: "error",
      confirmButtonText: "확인",
    });
    return;
  }

  return (
    <div className="w-7xl mx-auto py-20">
      <ul>
        <li className="grid grid-cols-2 p-2 border-b font-bold">
          <p>제목</p>
          <p>작성일</p>
        </li>
        {boards?.map((board) => (
          <li key={board.id} className="grid grid-cols-2 p-2 border-b">
            <Link href={`/board/${board.id}`}>{board.title}</Link>
            <p>{board.created_at}</p>
          </li>
        ))}
        <li className="ml-0">
          <Button>
            <Link href={"/board/add-board"}>글쓰기</Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}
