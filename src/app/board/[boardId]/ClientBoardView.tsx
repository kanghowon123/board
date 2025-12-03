"use client";

import BoardActions from "@/components/BoardActions";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Link from "next/link";

// MDEditor를 dynamic import로 클라이언트에서만 렌더링
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function ClientBoardView({ board }: { board: any }) {
  return (
    <div>
      <div>
        <span className="font-bold">작성일:</span>
        <span> {board.created_at}</span>
      </div>
      <p className="font-bold text-[30px] py-5">{board.title}</p>
      <MDEditor value={board.content} preview="preview" />
      <div className="flex">
        <Button>
          <Link href={`/board/${board.id}/edit`}>수정</Link>
        </Button>
        <BoardActions boardId={board.id} />
      </div>
    </div>
  );
}
