"use client";

import { Bell } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="h-16 bg-[#050510] border-b border-[#1A1A2E] flex items-center justify-between px-6 lg:px-8 sticky top-0 z-10">
      <div>
        <h1 className="text-[#FFF2EA] font-semibold text-lg leading-none">{title}</h1>
        {subtitle && (
          <p className="text-[#888888] text-xs mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-[#888888] hover:text-[#FFF2EA] hover:bg-[#1A1A2E] transition-colors">
          <Bell size={18} />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1A1A2E]">
          <div className="w-8 h-8 bg-[#C41C3B] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-[#FFF2EA] text-sm font-medium leading-none">Cavanha</p>
            <p className="text-[#888888] text-xs leading-none mt-0.5">Founder</p>
          </div>
        </div>
      </div>
    </header>
  );
}
