import Title from "@/components/Title";
import AddBoard from "../AddBoard";

import { IMAGE } from "@/app/constants/images";

export default function page() {
  return (
    <div className="w-full">
      <Title image={IMAGE.board1}>게시글 작성</Title>
      <div className="py-20 max-w-7xl mx-auto">
        <AddBoard />
      </div>
    </div>
  );
}
