import { getAllBoards } from "@/app/actions/board";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/app/uitils/dateForatter";

export default async function BoardList() {
  const boards = await getAllBoards();
  if (!boards) {
    return <div>게시물 목록 조회 실패</div>;
  }

  return (
    <div className="w-7xl mx-auto py-20">
      <div className="flex flex-col py-5">
        <Button className="ml-auto">
          <Link href={"/board/write"}>글쓰기</Link>
        </Button>
      </div>
      <ul className="grid lg:grid-cols-3 grid-cols-1 gap-5">
        {boards?.map((board) => (
          <li
            key={board.id}
            className="flex flex-col p-2 border transition-transform duration-200 hover:scale-105"
          >
            <Link href={`/board/${board.id}`}>
              {board.thumbnail_url ? (
                <div className="relative w-full flex flex-col justify-center items-center h-[300px]">
                  <Image
                    src={board.thumbnail_url}
                    alt="썸네일 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full flex flex-col justify-center items-center bg-gray-500 h-[300px] text-white">
                  <p>{board.id}</p>
                  <p>등록된 썸네일이 없습니다.</p>
                </div>
              )}
              <p className="text-[20px] font-bold truncate">{board.title}</p>
              <p className="text-[14px] text-gray-500">
                {formatDate(board.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
