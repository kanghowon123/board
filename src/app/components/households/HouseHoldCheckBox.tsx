"use client";

import { FaRegTrashAlt } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";

export default function HouseHoldCheckBox() {
  const [isCheck, setIsCheck] = useState(false);

  const handleCheck = () => {
    setIsCheck((prev) => !prev);
  };
  return (
    <>
      {isCheck ? (
        <div className="flex items-center py-3 px-10 justify-between bg-blue-900 text-white">
          <div className="flex items-center gap-5">
            <input type="checkbox" onClick={handleCheck} />
            <p>{}건이 선택되었습니다.</p>
          </div>
          <div className="flex items-center gap-5">
            <p>{}원</p>
            <FaRegTrashAlt className="w-5 h-5" />
            <BsThreeDotsVertical className="w-5 h-5" />
            <IoCloseOutline className="w-5 h-5" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-7 py-3 border-b-2 border-t-2">
          <input type="checkbox" onClick={handleCheck} />
          <p>날짜</p>
          <p>자산</p>
          <p>분류</p>
          <p>금액</p>
          <p>내용</p>
          <p>메모</p>
        </div>
      )}

      {/* 체크시 가려지는 부분 */}
    </>
  );
}
