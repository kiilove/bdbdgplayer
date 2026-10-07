import React from "react";
import { RiCalendarCheckLine, RiArrowRightLine } from "react-icons/ri";

export const Banner1 = () => (
  <div className="w-full bg-[#141414] border-b border-neutral-800 p-4 text-white flex flex-col justify-center">
    <div className="flex items-center justify-between">
      <div>
        <div className="flex items-center gap-x-2 text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-0.5">
          <RiCalendarCheckLine />
          <span>대회일정 : 2024-03-01</span>
        </div>
        <h4 className="text-sm font-black text-white tracking-tight">
          경기용인시보디빌딩 13회 출전선수 접수중
        </h4>
      </div>
      <button className="flex items-center gap-x-1 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-black tracking-tight transition active:scale-95 cursor-pointer">
        <span>신청</span>
        <RiArrowRightLine />
      </button>
    </div>
  </div>
);

export const Banner2 = () => (
  <div className="relative w-full h-28 bg-[#141414] border-b border-neutral-800 overflow-hidden flex items-center justify-between px-6">
    <div className="z-10">
      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
        Official Competition
      </span>
      <h3 className="text-lg font-black text-white tracking-tight">
        용인대회 참가접수
      </h3>
    </div>
    <div className="z-10">
      <span className="px-4 py-2 rounded-full bg-white text-black text-xs font-black tracking-tight uppercase">
        Join Now
      </span>
    </div>
  </div>
);
