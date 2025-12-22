"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import useSaveShortCut from "@/app/hooks/useSaveShortCut";

import Title from "@/components/Title";
import { IMAGE } from "@/app/constants/images";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addBoard } from "@/app/actions/board";
import ThumbnailUpload from "@/app/components/boards/ThumbnailUpload";
import { nanoid } from "nanoid";

import { createClient } from "@/lib/supabase/client";

export default function page() {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | string | null>(null);
  const [boardImage, setBoardImage] = useState<File | string | null>(null);
  const [isPending, startTransition] = useTransition(); //Next.js/React에서 비동기 업데이트가 UI를 멈추지 않게 하는 기능.

  const Swal = require("sweetalert2");
  const router = useRouter();

  const submitBoard = async () => {
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        title: "알림!",
        text: "제목과 내용을 입력해주세요!",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (thumbnail) {
        formData.append("thumbnail_url", thumbnail);
      }

      // ✅ 수정: 클라이언트에서 Supabase Storage 업로드 후 URL만 서버로 전달
      if (boardImage instanceof File) {
        const supabase = createClient(); // 브라우저용 클라이언트 생성
        const fileExt = boardImage.name.split(".").pop();
        const fileName = `${nanoid()}.${fileExt}`; // 중복 방지용
        const filePath = `boards/${fileName}`;

        // 업로드
        const { error: uploadError } = await supabase.storage
          .from("boards")
          .upload(filePath, boardImage);

        if (uploadError) {
          Swal.fire({
            title: "Error!",
            text: "이미지 업로드 실패",
            icon: "error",
            confirmButtonText: "확인",
          });
          return;
        }

        // URL 가져오기
        const { data } = supabase.storage.from("boards").getPublicUrl(filePath);

        // ✅ 수정: publicUrl 타입 안전하게 체크
        if (!data?.publicUrl) {
          Swal.fire({
            title: "Error!",
            text: "이미지 URL 생성 실패",
            icon: "error",
            confirmButtonText: "확인",
          });
          return;
        }

        const publicUrl = data.publicUrl; // 여기서 안전하게 URL 가져오기
        formData.append("board_url", publicUrl); // 서버로 URL만 전달
      }

      const { success, data } = await addBoard(formData);

      if (success) {
        setTitle("");
        setContent("");
        setThumbnail(null);
        setBoardImage(null);

        Swal.fire({
          title: "성공!",
          text: "게시글 작성 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push(`/board/${data.id}`);
      } else {
        Swal.fire({
          title: "Error!",
          text: "추가중 에러 발생",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitBoard();
  };

  useSaveShortCut(submitBoard, title, content);
  return (
    <div className="w-full">
      <Title image={IMAGE.board1}>게시글 작성</Title>
      <div className="py-20 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2">
          <form
            id="post-from"
            onSubmit={handleSubmit}
            className="flex flex-col gap-2"
          >
            <ThumbnailUpload onThumbnailChange={setThumbnail} />
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요."
            />
            <MDEditor
              height={300}
              value={content}
              onChange={(e) => setContent(e || "")}
            />
            <Input type="hidden" name="content" value={content} />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setBoardImage(file);
              }}
            />
            <Button disabled={isPending}>
              {isPending ? "추가중..." : "추가"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
