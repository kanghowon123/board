import { supabase } from "@/app/supabaseClient";
import EditBtn from "./EditBtn";

export default async function EditPage({
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
  return (
    <div>
      <EditBtn
        boardId={board.id}
        editTitle={board.title}
        editContent={board.content}
      />
    </div>
  );
}
