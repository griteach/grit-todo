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
  setUser: (user: { id: string; email?: string } | null) => void;
  forceLogout: () => void;
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

// 초기 상태 정의
const initialState = {
  user: null,
  loading: true,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,

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
    } catch (e) {
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
      console.log("signOut 시작...");
      set({ loading: true });

      console.log("supabase.auth.signOut() 호출...");
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Supabase 로그아웃 에러:", error);
        throw error;
      }

      console.log("Supabase 로그아웃 성공, 상태 업데이트...");
      set({ user: null, loading: false, error: null });
      console.log("signOut 완료");
    } catch (err) {
      console.error("로그아웃 오류:", err);
      // 에러가 발생해도 사용자 상태는 초기화
      set({ user: null, loading: false, error: null });
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

  setUser: (user: { id: string; email?: string } | null) => {
    console.log("setUser 호출됨, 파라미터:", user);
    console.log("setUser 호출 전 store 상태:", get());

    if (user) {
      // User 타입에 맞는 객체 생성 (최소한의 필수 속성만)
      const userObj = {
        id: user.id,
        email: user.email,
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        role: "authenticated",
        email_confirmed_at: new Date().toISOString(),
        phone: null,
        confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        banned_until: null,
        reauthentication_sent_at: null,
        recovery_sent_at: null,
        email_change_sent_at: null,
        phone_change_sent_at: null,
        new_email: null,
        new_phone: null,
        email_change_confirm_status: null,
        phone_change_confirm_status: null,
        factors: null,
        identities: [],
      } as unknown as User;
      console.log("setUser: user 객체 생성, 상태 업데이트...");
      set({ user: userObj, loading: false, error: null });
    } else {
      console.log("setUser: user를 null로 설정, 상태 업데이트...");
      // 완전히 초기 상태로 리셋 (loading: false로 설정)
      set(() => ({
        ...initialState,
        loading: false,
      }));

      // 추가 확인용 로그
      setTimeout(() => {
        console.log("setTimeout 후 store 상태:", get());
      }, 100);
    }

    console.log("setUser 완료 후 store 상태:", get());
  },

  clearError: () => {
    set({ error: null });
  },

  // 강제 로그아웃 함수 추가
  forceLogout: () => {
    console.log("forceLogout 호출됨");
    console.log("forceLogout 전 상태:", get());

    // 완전히 새로운 상태 객체 생성
    const newState = {
      user: null,
      loading: false,
      error: null,
    };

    console.log("새로운 상태 객체:", newState);

    // 여러 방법으로 상태 업데이트 시도
    set(() => newState);

    // 즉시 확인
    const afterSet = get();
    console.log("set() 직후 상태:", afterSet);

    // 여전히 null이 아니면 강제로 다시 시도
    if (afterSet.user !== null) {
      console.log("⚠️ 첫 번째 시도 실패, 다시 시도...");
      set(newState); // 객체 직접 전달

      const finalState = get();
      console.log("최종 상태:", finalState);
    }
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
