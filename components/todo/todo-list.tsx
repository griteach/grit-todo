"use client";

import { useState, useEffect } from "react";
import { TodoItem } from "./todo-item";
import { supabase } from "@/lib/supabase/utils";
import type { Todo } from "@/lib/supabase/utils";

interface TodoListProps {
  userId: string;
  isShared: boolean;
}

export function TodoList({ userId, isShared }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTodos();
  }, [userId, isShared]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", userId)
        .eq("is_shared", isShared)
        .order("priority", { ascending: false })
        .order("due_date", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setTodos(data || []);
    } catch {
      setError("할 일을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleTodoUpdate = (updatedTodo: Todo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleTodoDelete = (todoId: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <svg
            className="mx-auto h-8 w-8"
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
        </div>
        <p className="text-sm text-gray-600 mb-4">{error}</p>
        <button
          onClick={loadTodos}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {isShared ? "공유된 할 일이 없습니다" : "할 일이 없습니다"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isShared
            ? "팀원과 함께 할 일을 공유해보세요!"
            : "새로운 할 일을 추가해보세요!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onUpdate={handleTodoUpdate}
          onDelete={handleTodoDelete}
        />
      ))}
    </div>
  );
}
