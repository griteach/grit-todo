"use client";

import { useRef } from "react";
import { TodoList } from "./todo-list";
import { TodoForm } from "./todo-form";
import { ViewToggleButtons } from "./view-toggle-buttons";

interface TodoSectionProps {
  userId: string;
  isShared: boolean;
}

export function TodoSection({ userId, isShared }: TodoSectionProps) {
  const todoListRef = useRef<{ refreshTodos: () => void }>(null);

  const handleTodoCreated = () => {
    console.log("TodoSection - handleTodoCreated 호출됨");
    // TodoList를 다시 로드
    todoListRef.current?.refreshTodos();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">개인 할 일</h2>
          <div className="flex items-center space-x-3">
            {/* 뷰 모드 전환 버튼들 */}
            <ViewToggleButtons />
            <TodoForm userId={userId} onTodoCreated={handleTodoCreated} />
          </div>
        </div>
      </div>

      <div className="p-6">
        <TodoList 
          ref={todoListRef}
          userId={userId} 
          isShared={isShared} 
        />
      </div>
    </div>
  );
}
