import React from "react";
import BottomMenu from "../components/BottomMenu";
import { DummyTable, DummyTable2 } from "../components/Dummy";
import Header from "../components/Header";
import { DEFAULT_AVATAR } from "../consts";
import { RiTrophyLine, RiCalendarLine, RiMapPinLine, RiImageLine } from "react-icons/ri";

const CareerView = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex justify-center pb-28">
      <BottomMenu />
      <div className="w-full max-w-lg flex flex-col">
        <Header title="대회기록 상세분석" />

        {/* Hero Banner with Dark Overlay */}
        <div className="relative w-full h-56 bg-neutral-900 overflow-hidden">
          <img
            src="http://www.idomin.com/news/photo/201908/705560_405176_1535.jpg"
            alt="Contest Cover"
            className="w-full h-full object-cover object-center filter brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/40 to-transparent" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-center gap-x-2 text-xs font-bold text-neutral-400 mb-1">
              <RiCalendarLine />
              <span>2022.11.11</span>
              <span>•</span>
              <RiMapPinLine />
              <span>용인시립체육관</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              경기용인시보디빌딩대회
            </h1>
          </div>
        </div>

        {/* Athlete Rank Hero Card */}
        <div className="p-4 sm:p-6 -mt-4 z-10 flex flex-col gap-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-2xl flex items-center justify-between">
            <div className="flex items-center gap-x-3.5">
              <img
                src={DEFAULT_AVATAR}
                alt="김진배 선수"
                className="w-12 h-12 rounded-full border-2 border-white object-cover bg-neutral-800"
              />
              <div>
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                  Athlete
                </span>
                <span className="text-base font-black text-white tracking-tight">
                  김진배 선수
                </span>
              </div>
            </div>

            <div className="flex items-center gap-x-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-2xl">
              <RiTrophyLine className="text-white text-lg" />
              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-400 block uppercase">RESULT</span>
                <span className="text-sm font-black text-white">125점 (1위)</span>
              </div>
            </div>
          </div>

          {/* Judges Scoring Table */}
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-black text-white tracking-tight uppercase mb-4 flex items-center gap-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              심사위원 채점 집계표
            </h3>
            <DummyTable />
          </div>

          {/* TOP 10 Comparison */}
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-black text-white tracking-tight uppercase mb-4 flex items-center gap-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              TOP 10 평균 격차 비교
            </h3>
            <DummyTable2 />
          </div>

          {/* Competition Photos */}
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-5 shadow-xl">
            <h3 className="text-sm font-black text-white tracking-tight uppercase mb-4 flex items-center gap-x-2">
              <RiImageLine />
              대회 공식 갤러리
            </h3>
            <div className="flex gap-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
              {[
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmsyrN_VtrlXd3FkyugXUBrmKvlowe_nq3aQ&usqp=CAU",
                "https://mblogthumb-phinf.pstatic.net/20160911_38/wju0504_1473605742521bF9uO_JPEG/2016_yongin_%281903%29_%BB%E7%BA%BB.jpg?type=w2",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG_glhcj_QrJsmWWhTsvPw5x4GxKsKSF7Lqg&usqp=CAU",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtP8XZJETvg0drg8cUGXENNaD9IclYEgSWGQ&usqp=CAU",
              ].map((imgUrl, i) => (
                <div key={i} className="min-w-[130px] h-44 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <img
                    src={imgUrl}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerView;
