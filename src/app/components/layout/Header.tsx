"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { MENU_LIST } from "@/app/constants/constants";

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 z-50 w-full h-20 mx-auto bg-white">
      <nav className="flex flex-col max-w-[1200px] h-full mx-auto justify-center items-center">
        <div className="flex w-full justify-between">
          <div className="font-bold text-[30px]">
            <Link href={"/"}>로고</Link>
          </div>
          <ul className="flex items-center gap-7">
            {MENU_LIST.map((menu) => {
              const isActive = pathname === menu.href;
              return (
                <li
                  key={menu.menu}
                  className={`${isActive ? "font-bold" : "font-normal"}`}
                >
                  <Link href={menu.href}>{menu.menu}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
