"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase/utils";
import type { Profile } from "@/lib/supabase/utils";

interface ProfileFormProps {
  userId: string;
  onUpdate?: (profile: Profile) => void;
}

export function ProfileForm({ userId, onUpdate }: ProfileFormProps) {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("프로필 로드 오류:", error);
        return;
      }

      if (data) {
        setProfile(data);
      }
    } catch {
      console.error("프로필 로드 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updates = {
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("profiles")
        .upsert(updates)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }

      if (data) {
        setSuccess(true);
        setProfile(data);
        onUpdate?.(data);

        // 성공 메시지 숨기기
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("프로필 업데이트 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>프로필 로딩 중...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 설정</CardTitle>
        <CardDescription>개인 정보와 계정 설정을 관리하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>프로필이 성공적으로 업데이트되었습니다!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="full_name"
                className="text-sm font-medium text-gray-700"
              >
                전체 이름
              </Label>
              <Input
                id="full_name"
                type="text"
                value={profile.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                placeholder="홍길동"
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="display_name"
                className="text-sm font-medium text-gray-700"
              >
                표시 이름
              </Label>
              <Input
                id="display_name"
                type="text"
                value={profile.display_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, display_name: e.target.value })
                }
                placeholder="길동"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              이메일 주소
            </Label>
            <Input
              id="email"
              type="email"
              value={profile.email || ""}
              disabled
              className="h-11 bg-gray-50"
            />
            <p className="text-xs text-gray-500">이메일은 변경할 수 없습니다</p>
          </div>

          <div className="space-y-3">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
              자기소개
            </Label>
            <Textarea
              id="bio"
              value={profile.bio || ""}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="자신에 대해 간단히 소개해주세요..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="space-y-3">
            <Label
              htmlFor="timezone"
              className="text-sm font-medium text-gray-700"
            >
              시간대
            </Label>
            <select
              id="timezone"
              value={profile.timezone || ""}
              onChange={(e) =>
                setProfile({ ...profile, timezone: e.target.value })
              }
              className="w-full h-11 px-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">시간대 선택</option>
              <option value="Asia/Seoul">Asia/Seoul (한국 표준시)</option>
              <option value="UTC">UTC (협정 세계시)</option>
              <option value="America/New_York">
                America/New_York (동부 표준시)
              </option>
              <option value="Europe/London">
                Europe/London (그리니치 표준시)
              </option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>저장 중...</span>
                </div>
              ) : (
                "프로필 저장"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={loadProfile}
              disabled={saving}
            >
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
