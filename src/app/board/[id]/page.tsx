import { getBoardById } from "@/app/actions/board";

import { formatDate } from "@/app/uitils/dateForatter";
import MarkdownViewer from "@/components/MarkdownViewer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import BoardActions from "@/components/BoardActions";

export default async function BoardItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const paramId = parseInt(id, 10);

  const board = await getBoardById(paramId);

  if (!board) {
    return <div>게시글을 찾을 수 없습니다</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-20">
      <div>
        <span className="font-bold">작성일:</span>
        <span> {formatDate(board.created_at)}</span>
      </div>
      <p className="font-bold text-[30px] py-5">{board.title}</p>

      <div className="border p-4">
        {board.image && (
          <div className="py-5">
            <Image
              src={board.image}
              alt={board.title}
              width={800} // 원하는 가로 크기
              height={600} // 원하는 세로 크기
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
        <MarkdownViewer content={board.content} />
      </div>
      <div className="flex justify-end py-5 gap-3">
        <Button>
          <Link href={`/board/${board.id}/edit`}>수정</Link>
        </Button>
        <BoardActions id={board.id} />
        <Button>
          <Link href={`/board`}>목록으로</Link>
        </Button>
      </div>
    </div>
  );
}
