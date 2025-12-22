"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { getUserByEmail, signUp } from "@/app/actions/user";

// 스키마 정의
const signUpSchema = z
  .object({
    userName: z.string().min(1, "이름을 입력해주세요."),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식을 입력해주세요."),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
    passwordConfirm: z
      .string()
      .min(1, "비밀번호 확인을 입력해주세요")
      .min(6, "비밀번호는 최소 6자 이상이어야 합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "비밀번호가 일치하지 않습니다.",
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    // Zod 유효성 검사
    const result = signUpSchema.safeParse({
      userName,
      email,
      password,
      passwordConfirm,
    });

    // console.log("result : ", result);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignUpFormData, string>> = {};

      // result.error.issues : 에러에 대한 배열
      // 발견 된 모든 에러를 배열로 모아줌
      // console.log("result.error.issues : ", result.error.issues);
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof SignUpFormData;
        if (field) {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      const oldUser = await getUserByEmail(email);

      if (oldUser) {
        Swal.fire({
          title: "회원가입 실패",
          text: "이미 등록된 이메일입니다.",
          icon: "error",
          confirmButtonText: "확인",
        });

        setErrors({ email: "이미 등록된 이메일입니다." });
        return;
      }
      // auth 테이블에 회원 정보 등록
      const user = await signUp(userName, email, password);

      if (user.error) {
        Swal.fire({
          title: "회원가입 실패",
          text: user.error.message,
          icon: "error",
          confirmButtonText: "확인",
        });

        setErrors({ email: user.error.message });
        return;
      }

      // 회원가입 성공 처리
      if (user) {
        await Swal.fire({
          title: "회원가입 완료!",
          text: "회원가입이 완료되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        router.push("/");
      }
    });
  };

  return (
    <div className="py-20">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center">회원가입</CardTitle>
          <CardDescription className="text-center">
            새 계정을 만들어 시작하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">이름</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (errors.userName) {
                      setErrors((prev) => ({ ...prev, userName: undefined }));
                    }
                  }}
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">{errors.userName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="이메일을 입력해주세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }
                  }}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                <Input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => {
                    setPasswordConfirm(e.target.value);
                    if (errors.passwordConfirm) {
                      setErrors((prev) => ({
                        ...prev,
                        passwordConfirm: undefined,
                      }));
                    }
                  }}
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                {isPending ? "처리중..." : "회원가입"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <CardDescription className="flex items-center">
            이미 계정이 존재하나요?
            <CardAction>
              <Button
                variant="link"
                className="cursor-pointer"
                onClick={() => router.push("/login")}
              >
                로그인
              </Button>
            </CardAction>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}
