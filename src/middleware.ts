// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  console.log("🔍 미들웨어 실행:", request.nextUrl.pathname);

  const publicPaths = ["/login", "/signup"];
  const pathname = request.nextUrl.pathname;

  // 정확히 일치하는지 체크 (/ 는 따로 체크)
  const isPublicPath =
    pathname === "/" ||
    publicPaths.some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    );

  if (isPublicPath) {
    console.log("✅ 공개 경로 - 통과");
    return NextResponse.next();
  }

  console.log("🔒 보호된 경로 - 인증 체크");

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("👤 유저 상태:", user ? "로그인됨" : "로그인안됨");

  if (!user) {
    console.log("❌ 리다이렉트 to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.log("✅ 인증 통과");
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
