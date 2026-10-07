import React from "react";
import { RxArrowLeft } from "react-icons/rx";

const Header = ({ title, banner, bgColor }) => {
  return (
    <div className="sticky top-0 z-30 w-full bg-black/90 backdrop-blur-xl border-b border-neutral-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between relative">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-x-1.5 text-neutral-300 hover:text-white transition text-xs font-bold cursor-pointer z-10 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 active:scale-95"
        >
          <RxArrowLeft className="text-base" />
          <span>이전</span>
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase">
            {title}
          </h1>
        </div>
        <div className="w-16"></div>
      </div>
      {banner}
    </div>
  );
};

export default Header;
