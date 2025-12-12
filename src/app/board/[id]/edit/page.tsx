import { getBoardById } from "@/app/actions/board";
import EditBoard from "./EditBoard";

export default async function EditPage({
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
    <div>
      <EditBoard board={board} />
    </div>
  );
}
