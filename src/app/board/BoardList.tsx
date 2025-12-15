import { getAllBoards } from "@/app/actions/board";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/uitils/dateForatter";

export default async function BoardList() {
  const boards = await getAllBoards();

  if (!boards) {
    return <div>게시물 목록 조회 실패</div>;
  }

  return (
    <div className="w-7xl mx-auto py-20">
      <ul className="flex flex-col">
        <li className="ml-auto">
          <Button>
            <Link href={"/board/write"}>글쓰기</Link>
          </Button>
        </li>
        <li className="grid grid-cols-2 p-2 border-b font-bold">
          <p>제목</p>
          <p>작성일</p>
        </li>
        {boards?.map((board) => (
          <li key={board.id} className="grid grid-cols-2 p-2 border-b">
            <Link href={`/board/${board.id}`}>{board.title}</Link>
            <p>{formatDate(board.created_at)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
