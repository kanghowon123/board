import { supabase } from "@/app/supabaseClient";
import ClientBoardView from "./ClientBoardView";

export default async function BoardItemPage({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { boardId } = await params;
  const { data: board, error } = await supabase
    .from("board")
    .select("*")
    .eq("id", boardId)
    .single();

  if (error) {
    console.log(error);
    return;
  }

  if (!board) {
    return <div>게시글을 찾을 수 없습니다</div>;
  }

  return (
    <div className="max-w-7xl mx-auto py-20">
      <ClientBoardView board={board} />
    </div>
  );
}
