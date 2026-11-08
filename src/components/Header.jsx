import React from "react";
import { RxArrowLeft } from "react-icons/rx";

const Header = ({ title, banner, rightElement }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-xl border-b border-slate-200/80 text-[#0F172A]">
      <div className="max-w-5xl mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between relative">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-x-1.5 text-slate-700 hover:bg-slate-100 transition text-sm font-semibold cursor-pointer z-10 px-3 py-1.5 rounded-lg border border-slate-200 bg-white active:scale-95"
        >
          <RxArrowLeft className="text-base" />
          <span>이전</span>
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-28">
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] truncate">
            {title}
          </h1>
        </div>
        {rightElement ? (
          <div className="z-10 flex items-center">{rightElement}</div>
        ) : (
          <div className="w-16" />
        )}
      </div>
      {banner}
    </header>
  );
};

export default Header;
