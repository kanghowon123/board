import { getAllHousehold } from "../actions/household";

export default async function HouseholdList() {
  const households = await getAllHousehold();
  if (households.length === 0) {
    return (
      <div className="text-center">
        <p className="text-[20px]">작성된 가계부가 없습니다</p>
        <p>우측 하단 버튼을 클릭해 추가해주세요</p>
      </div>
    );
  }
  return (
    <div>
      <ul className="w-full bg-white shadow-2xl rounded-2xl">
        <li className="grid grid-cols-4 text-center ">
          <p className="py-3 border-b-2 border-red-500">전체</p>
          <p className="py-3">수입</p>
          <p className="py-3">지출</p>
          <p className="py-3">이체</p>
        </li>
        <li className="grid grid-cols-7 py-3 border-b-2 border-t-2">
          <input type="checkbox" />
          <p>날짜</p>
          <p>자산</p>
          <p>분류</p>
          <p>금액</p>
          <p>내용</p>
          <p>메모</p>
        </li>
        {households.map((item) => (
          <li key={item.id} className="grid grid-cols-7 py-3 border-b">
            <input type="checkbox" />
            <p>{item.date}</p>
            <p>{Number(item.amount ?? 0).toLocaleString()} 원</p>
            <p>{item.classification}</p>
            <p>{item.property}</p>
            <p>{item.content}</p>
            <p>{item.memo}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
