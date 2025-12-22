"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

import Link from "next/link";
import { MENU_LIST } from "@/app/constants/constants";
import { getCurrentUser, signOut } from "@/app/actions/user";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  // user안에 id,userName.email 등 들어있음
  const [user, setUser] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    fetchUser();
  }, [pathname]);

  const handleLogout = () => {
    startTransition(async () => {
      await signOut();
      setUser(null);
      router.push("/");
    });
  };

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
          <ul className="flex items-center gap-3">
            {user ? (
              <>
                <li className="text-[14px] flex items-center">
                  <p className="font-bold">{user?.user_metadata?.userName}</p>
                  <p>님 환영합니다.</p>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-[14px] cursor-pointer"
                    disabled={isPending}
                  >
                    로그아웃
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="text-[14px]">
                  <Link href="/login">로그인</Link>
                </li>
                <li className="text-[14px]">
                  <Link href="/sign-up">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
