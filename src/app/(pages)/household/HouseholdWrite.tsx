"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useTransition } from "react";
import { addIncome } from "@/app/actions/household";
import { useRouter } from "next/navigation";

export default function HouseholdWrite() {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [classification, setClassification] = useState<string>("");
  const [property, setProperty] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [memo, setMemo] = useState<string>("");

  const Swal = require("sweetalert2");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handlePlusBtn = () => {
    setIsOpen((prev) => !prev);
  };

  const submitIncome = async () => {
    if (
      !date.trim() ||
      !amount.trim() ||
      !classification.trim() ||
      !property.trim() ||
      !content.trim() ||
      !memo.trim()
    ) {
      Swal.fire({
        title: "알림!",
        text: "빈 값을 입력해주세요!",
        icon: "warning",
        confirmButtonText: "확인",
      });
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("amount", amount);
      formData.append("classification", classification);
      formData.append("property", property);
      formData.append("content", content);
      formData.append("memo", memo);

      const { success, data } = await addIncome(formData);

      if (success) {
        setDate("");
        setAmount("");
        setClassification("");
        setProperty("");
        setContent("");
        setMemo("");
        setIsOpen(false);

        Swal.fire({
          title: "성공!",
          text: "게시글 작성 완료",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push(`/household`);
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
    submitIncome();
  };
  return (
    <div className="relative">
      <button
        onClick={handlePlusBtn}
        className="fixed right-4 bottom-4 w-15 h-15 bg-blue-500 rounded-full text-white font-bold text-[30px] cursor-pointer z-50"
      >
        {isOpen ? "-" : "+"}
      </button>
      <div
        className={`fixed top-20 right-0 h-full w-[450px] bg-gray-100 shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-10">
          <form onSubmit={handleSubmit}>
            <ul className="grid grid-cols-3 text-center gap-5">
              <li className="border border-red-500 py-1 rounded-[10px] ">
                수입
              </li>
              <li className="border border-blue-500 py-1 rounded-[10px]">
                지출
              </li>
              <li className="border border-black py-1 rounded-[10px]">이체</li>
            </ul>
            <div className="py-5 flex flex-col gap-2">
              <div>
                <label htmlFor="">날짜</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">금액</label>
                <Input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">분류</label>
                <select
                  className="w-full p-2 border rounded"
                  value={classification}
                  onChange={(e) => setClassification(e.target.value)}
                >
                  <option value=""></option>
                  <option value="식비">식비</option>
                  <option value="교통/차량">교통/차량</option>
                  <option value="문화생활">문화생활</option>
                  <option value="마트/편의점">마트/편의점</option>
                  <option value="패션/미용">패션/미용</option>
                  <option value="생활용품">생활용품</option>
                  <option value="주거/통신">주거/통신</option>
                  <option value="건강">건강</option>
                </select>
              </div>
              <div>
                <label htmlFor="">자산</label>
                <select
                  className="w-full p-2 border rounded"
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                >
                  <option value=""></option>
                  <option value="현금">현금</option>
                  <option value="카드">카드</option>
                  <option value="이체">이체</option>
                </select>
              </div>
              <div>
                <label htmlFor="">내용</label>
                <Input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="">메모</label>
                <Input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Button className="block w-full">
                {isPending ? "저장중..." : "저장"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
