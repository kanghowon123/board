import { IMAGE } from "@/app/constants/images";
import { MenuList, MainImages } from "./types";

export const MENU_LIST: MenuList[] = [
  { menu: "TodoList", href: "/todo-list" },
  { menu: "게시판", href: "/board" },
  { menu: "가계부", href: "/household" },
  { menu: "제작 설명", href: "/description" },
];

export const MAIN_IMAGES: MainImages[] = [
  {
    id: 1,
    image: IMAGE.main1img,
  },
  {
    id: 2,
    image: IMAGE.main2img,
  },
  {
    id: 3,
    image: IMAGE.main3img,
  },
];
