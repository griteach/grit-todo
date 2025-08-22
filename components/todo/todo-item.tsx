"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/utils";
import type { Todo } from "@/lib/supabase/utils";

interface TodoItemProps {
  todo: Todo;
  onUpdate: (updatedTodo: Todo) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const priorityLabels = {
  low: "낮음",
  medium: "보통",
  high: "높음",
};

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updatedTodo = await supabase
        .from("todos")
        .update({ 
          completed: !todo.completed,
          updated_at: new Date().toISOString()
        })
        .eq("id", todo.id)
        .select()
        .single();

      if (updatedTodo.data) {
        onUpdate(updatedTodo.data);
      }
    } catch (error) {
      console.error("Todo 업데이트 오류:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (isUpdating) return;
    
    if (confirm("정말로 이 할 일을 삭제하시겠습니까?")) {
      setIsUpdating(true);
      try {
        await supabase.from("todos").delete().eq("id", todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error("Todo 삭제 오류:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      todo.completed ? "opacity-75 bg-gray-50" : ""
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isUpdating}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`text-sm font-medium ${
                  todo.completed ? "line-through text-gray-500" : "text-gray-900"
                }`}>
                  {todo.title}
                </h3>
                
                {todo.description && (
                  <p className={`text-xs mt-1 ${
                    todo.completed ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {todo.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-2 mt-2">
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${priorityColors[todo.priority]}`}
                  >
                    {priorityLabels[todo.priority]}
                  </Badge>
                  
                  {todo.due_date && (
                    <Badge variant="outline" className="text-xs">
                      📅 {formatDate(todo.due_date)}
                    </Badge>
                  )}
                  
                  {todo.tags && todo.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {todo.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {todo.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{todo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-gray-400 mt-2">
              {new Date(todo.created_at).toLocaleDateString("ko-KR", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
