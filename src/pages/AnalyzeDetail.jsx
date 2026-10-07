import React, { useState } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { RiTrophyLine, RiFlashlightLine, RiHeartPulseLine, RiStarLine, RiShieldStarLine, RiShirtLine } from "react-icons/ri";
import AnalyzeLineType from "../components/AnalyzeLineType";
import AnalyzeBarType from "../components/AnalyzeBarType";

const metrics = [
  { id: "1", title: "순위", score: "1위", icon: RiTrophyLine },
  { id: "2", title: "신체", score: "11점", icon: RiHeartPulseLine },
  { id: "3", title: "예술", score: "10점", icon: RiStarLine },
  { id: "4", title: "독창", score: "10점", icon: RiFlashlightLine },
  { id: "5", title: "규정", score: "16점", icon: RiShieldStarLine },
  { id: "6", title: "의상", score: "12점", icon: RiShirtLine },
];

const AnalyzeDetail = () => {
  const [selectMenu, setSelectMenu] = useState("1");

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex justify-center pb-28">
      <BottomMenu />
      <div className="w-full max-w-lg flex flex-col">
        <Header title="선수 역량 상세분석" />

        {/* 6 Category Selection Grid */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="grid grid-cols-3 gap-2.5">
            {metrics.map((item) => {
              const Icon = item.icon;
              const isSelected = selectMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectMenu(item.id)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                    isSelected
                      ? "bg-white text-black border-white shadow-xl scale-[1.02]"
                      : "bg-[#141414] hover:bg-[#1A1A1A] text-neutral-400 border-neutral-800"
                  }`}
                >
                  <Icon className={`text-xl mb-1 ${isSelected ? "text-black" : "text-neutral-400"}`} />
                  <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? "text-black" : "text-neutral-400"}`}>
                    {item.title}
                  </span>
                  <span className={`text-lg font-black tracking-tight mt-0.5 ${isSelected ? "text-black" : "text-white"}`}>
                    {item.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts Container */}
        <div className="p-4 sm:p-6 pt-2 flex flex-col gap-4">
          {/* Trend Chart */}
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-2">
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                  Performance Trend
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  대회별 순위 추이
                </h3>
              </div>
              <span className="text-xs font-black bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-300">
                최근 7개 대회
              </span>
            </div>
            <AnalyzeLineType />
          </div>

          {/* Benchmark Chart */}
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-xl flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-2">
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                  Benchmark Analytics
                </span>
                <h3 className="text-base font-black text-white tracking-tight">
                  최근 경기 Top3 비교
                </h3>
              </div>
              <span className="text-xs font-black bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full text-neutral-300">
                심사 부문별
              </span>
            </div>
            <AnalyzeBarType />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeDetail;
