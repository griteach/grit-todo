export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          completed: boolean;
          priority: "low" | "medium" | "high";
          due_date: string | null;
          tags: string[] | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          is_shared: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          user_id: string;
          is_shared?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          completed?: boolean;
          priority?: "low" | "medium" | "high";
          due_date?: string | null;
          tags?: string[] | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string;
          is_shared?: boolean;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          timezone: string | null;
          preferences: Json | null;
          is_verified: boolean;
          last_login_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          timezone?: string | null;
          preferences?: Json | null;
          is_verified?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          timezone?: string | null;
          preferences?: Json | null;
          is_verified?: boolean;
          last_login_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
