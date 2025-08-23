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
  const { user, loading, signOut, checkAuth, setUser } = useAuthStore();

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
    await signOut();
    window.location.href = "/";
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
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        size="sm"
                      >
                        로그아웃
                      </Button>
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
