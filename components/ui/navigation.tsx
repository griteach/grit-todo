"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "./button";

interface NavigationProps {
  initialUser?: { id: string; email?: string } | null;
}

export function Navigation({ initialUser }: NavigationProps) {
  const pathname = usePathname();

  const { user, loading, signOut, checkAuth, setUser, forceLogout } =
    useAuthStore();

  // 디버깅: store 상태 확인
  console.log("Navigation - useAuthStore 상태:", { user, loading });

  // 초기 사용자 정보가 있으면 로딩 상태를 false로 강제 설정
  const isActuallyLoading = initialUser ? false : loading;

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    // 초기 사용자 정보가 있으면 즉시 설정하고 로딩 상태 해제
    if (initialUser && !user) {
      setUser(initialUser);
    }

    // 초기 사용자 정보가 있으면 checkAuth를 건너뛰고 즉시 로딩 완료
    if (initialUser) {
      return;
    }

    checkAuth();
  }, [checkAuth, initialUser, user, setUser]);

  const handleLogout = async () => {
    try {
      console.log("로그아웃 시작...");
      console.log("현재 user 상태:", user);

      await signOut();
      console.log("로그아웃 완료, 홈페이지로 이동");
      console.log("signOut 후 user 상태:", user);

      // 강제로 사용자 상태를 null로 설정 (이중 안전장치)
      console.log("setUser(null) 호출...");
      setUser(null);
      console.log("setUser(null) 후 user 상태:", user);

      // 추가 안전장치: forceLogout 호출
      console.log("forceLogout 호출...");
      forceLogout();

      // 즉시 store 상태 확인 (user 변수가 아닌 실제 store 상태)
      const currentState = useAuthStore.getState();
      console.log("forceLogout 후 실제 store 상태:", currentState);
      console.log("forceLogout 후 user 변수 상태:", user);

      // 강제로 컴포넌트 리렌더링을 위한 상태 업데이트
      if (currentState.user !== null) {
        console.log(
          "⚠️ store 상태가 여전히 null이 아님, 강제 업데이트 시도..."
        );
        // 한 번 더 시도
        forceLogout();
        const finalState = useAuthStore.getState();
        console.log("최종 store 상태:", finalState);
      }

      // 강제 새로고침으로 모든 상태 초기화
      console.log("페이지 강제 새로고침으로 완전 초기화...");
      window.location.href = "/";
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      // 에러가 발생해도 로그아웃 상태로 설정하고 홈페이지로 이동
      console.log("에러 발생으로 로그아웃 상태 설정, 홈페이지로 이동");
      setUser(null);

      // 에러 발생 시에도 강제 새로고침
      console.log("에러 발생, 페이지 강제 새로고침...");
      window.location.href = "/";
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Grit Todo
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              홈
            </Link>
            <Link
              href="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/about"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              소개
            </Link>

            {/* 로딩 중일 때는 스켈레톤 UI 표시 */}
            {isActuallyLoading ? (
              <div className="flex items-center space-x-3">
                <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === "/dashboard"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-700">
                        {user.email}
                      </span>
                      <button
                        onClick={handleLogout}
                        type="button"
                        className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-gray-900 border-gray-300 hover:bg-gray-50"
                    >
                      <Link href="/auth/login">로그인</Link>
                    </Button>
                    <Button
                      size="sm"
                      asChild
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Link href="/auth/signup">회원가입</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
