import { create } from "zustand";
import { supabase } from "@/lib/supabase/utils";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Actions
  signIn: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
  updateProfile: (
    updates: Partial<{
      full_name: string;
      display_name: string;
      bio: string;
      timezone: string;
    }>
  ) => Promise<{ success: boolean; error?: string }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        set({ user: data.user, loading: false, error: null });

        // 프로필 정보도 함께 로드
        await get().checkAuth();

        return { success: true };
      }

      return { success: false, error: "로그인에 실패했습니다." };
    } catch (err) {
      const errorMessage = "로그인 중 오류가 발생했습니다.";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        set({ error: error.message, loading: false });
        return { success: false, error: error.message };
      }

      if (data.user) {
        // 회원가입 성공 시 프로필 생성
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          is_verified: false,
        });

        if (profileError) {
          console.error("프로필 생성 오류:", profileError);
        }

        set({ loading: false, error: null });
        return { success: true };
      }

      return { success: false, error: "회원가입에 실패했습니다." };
    } catch (err) {
      const errorMessage = "회원가입 중 오류가 발생했습니다.";
      set({ error: errorMessage, loading: false });
      return { success: false, error: errorMessage };
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      set({ user: null, loading: false, error: null });
    } catch (err) {
      console.error("로그아웃 오류:", err);
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    try {
      set({ loading: true });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("인증 확인 오류:", error);
        set({ user: null, loading: false });
        return;
      }

      if (user) {
        set({ user, loading: false, error: null });
      } else {
        set({ user: null, loading: false });
      }
    } catch (err) {
      console.error("인증 확인 중 오류:", err);
      set({ user: null, loading: false });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  updateProfile: async (updates) => {
    try {
      const { user } = get();
      if (!user) {
        return { success: false, error: "사용자가 로그인되지 않았습니다." };
      }

      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // 사용자 정보 업데이트
      set({
        user: { ...user, user_metadata: { ...user.user_metadata, ...updates } },
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: "프로필 업데이트 중 오류가 발생했습니다.",
      };
    }
  },
}));

// 인증 상태 변경 감지
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(async (event, session) => {
    const { checkAuth } = useAuthStore.getState();

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      await checkAuth();
    } else if (event === "SIGNED_OUT") {
      useAuthStore.setState({ user: null, loading: false, error: null });
    }
  });
}
