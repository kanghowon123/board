"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/app/actions/board";
import { useTransition } from "react";

export default function BoardActions({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const Swal = require("sweetalert2");

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제 후에는 복구할 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (!result.isConfirmed) {
      return;
    }

    startTransition(async () => {
      const { success } = await deleteBoard(id);

      if (success) {
        Swal.fire({
          title: "성공!",
          text: "삭제 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push("/board");
      } else {
        Swal.fire({
          title: "Error!",
          text: "삭제중 에러 발생",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    });
  };
  return (
    <div>
      <Button onClick={handleDelete}>
        {isPending ? "삭제 중..." : "삭제"}
      </Button>
    </div>
  );
}
