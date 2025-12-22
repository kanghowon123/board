"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

import { AiOutlinePicture } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { FaRegTrashCan } from "react-icons/fa6";

interface onThumbnailChange {
  onThumbnailChange: (file: File | string | null) => void;
}

export default function ThumbnailUpload({
  onThumbnailChange,
}: onThumbnailChange) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (지피티 추가)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 사용자가 선택한 파일 목록중 첫번째를 file에 담음
    const file = e.target.files?.[0];

    // console.log(file);
    if (!file) return;

    // 5MB 이상이면 업로드 금지(지피티 추가)
    if (file.size > MAX_FILE_SIZE) {
      alert("이미지 파일은 5MB 이하만 업로드 가능합니다.");
      e.target.value = ""; // input 초기화
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setFileName(file.name);

      onThumbnailChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName("");

    onThumbnailChange(null);

    const input = document.getElementById(
      "thumbnail-input"
    ) as HTMLInputElement;
    if (input) input.value = "";
  };

  return (
    <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
      {preview ? (
        <>
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            {/* 로컬 URL의 경우 next/image가 최적화를 하지 않음 */}
            {/* 로컬 URL을 최적화를 시도하는 경우 자칫 에러가 발생할 수 있음 */}
            {/* unoptimized : 최적화 하지 않겠다는 의미 */}
            <Image
              src={preview}
              alt="썸네일 미리보기"
              className="object-contain"
              fill
              unoptimized
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600 flex-1">{fileName}</p>
            <Button type="button" size="sm" onClick={handleRemove}>
              <FaRegTrashCan />
              삭제
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <AiOutlinePicture className="w-10 h-10 text-gray-500" />
          <label
            htmlFor="thumbnail-input"
            className="flex  items-center gap-2 py-2 px-4 rounded-xl bg-blue-500 text-white cursor-pointer hover:bg-blue-600 duration-300"
          >
            <FiUpload />
            썸네일 이미지 선택
          </label>
          <input
            id="thumbnail-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-sm text-gray-500">JPG, PNG, GIF(최대 5 MB)</p>
        </div>
      )}
    </div>
  );
}
