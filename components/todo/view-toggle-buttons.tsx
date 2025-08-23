"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export type ViewMode = "list" | "grid" | "kanban";

interface ViewToggleButtonsProps {
  onViewChange?: (view: ViewMode) => void;
}

export function ViewToggleButtons({ onViewChange }: ViewToggleButtonsProps) {
  const [currentView, setCurrentView] = useState<ViewMode>("list");

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <Button
        variant={currentView === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("list")}
        className={`h-8 px-3 ${
          currentView === "list"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        리스트
      </Button>
      
      <Button
        variant={currentView === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("grid")}
        className={`h-8 px-3 ${
          currentView === "grid"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        그리드
      </Button>
      
      <Button
        variant={currentView === "kanban" ? "default" : "ghost"}
        size="sm"
        onClick={() => handleViewChange("kanban")}
        className={`h-8 px-3 ${
          currentView === "kanban"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        칸반
      </Button>
    </div>
  );
}
