import React, { useState } from "react";
import { Link } from "react-router-dom";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { RiTrophyLine, RiCalendarLine, RiMapPinLine, RiTeamLine } from "react-icons/ri";

const dummyData = [
  {
    id: 1,
    title: "경기용인시보디빌딩 6회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 187,
    game: "180cm이하 클래식",
    grade: 1,
    date: "12-01",
    year: 2022,
  },
  {
    id: 2,
    title: "경기용인시보디빌딩 5회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 381,
    game: "170cm이하 클래식",
    grade: 3,
    date: "11-23",
    year: 2022,
  },
  {
    id: 3,
    title: "경기용인시보디빌딩 4회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 231,
    game: "180cm이하 클래식",
    grade: 6,
    date: "09-03",
    year: 2022,
  },
  {
    id: 4,
    title: "경기용인시보디빌딩 3회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 187,
    game: "180cm이하 클래식",
    grade: 4,
    date: "03-05",
    year: 2021,
  },
  {
    id: 5,
    title: "경기용인시보디빌딩 2회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 381,
    game: "170cm이하 클래식",
    grade: 5,
    date: "02-23",
    year: 2021,
  },
  {
    id: 6,
    title: "경기용인시보디빌딩 1회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 131,
    game: "180cm이하 클래식",
    grade: 8,
    date: "01-15",
    year: 2021,
  },
];

const Career = () => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex justify-center pb-28">
      <BottomMenu />
      <div className="w-full max-w-lg flex flex-col">
        <Header title="선수 공식 커리어" />
        
        {/* Hero Section */}
        <div className="p-4 sm:p-6 pb-2">
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 relative overflow-hidden">
            <div className="flex items-center gap-x-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center text-lg font-black">
                <RiTrophyLine />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-neutral-400">
                Official Hall of Fame
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              대회 출전 및 수상 기록
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              공식 심사 완료된 경기 기록 아카이브입니다.
            </p>
          </div>
        </div>

        {/* List of career items */}
        <div className="p-4 sm:p-6 pt-2 flex flex-col gap-y-4">
          {dummyData.map((item, idx) => {
            const isFirstOfYear = idx === 0 || dummyData[idx - 1].year !== item.year;
            return (
              <React.Fragment key={item.id}>
                {isFirstOfYear && (
                  <div className="flex items-center gap-x-3 mt-4 mb-1">
                    <span className="text-xl font-black tracking-tighter text-white">
                      {item.year}
                    </span>
                    <div className="flex-1 h-[1px] bg-neutral-800" />
                  </div>
                )}
                <Link to="/careerview" className="group">
                  <div className="bg-[#141414] hover:bg-[#1A1A1A] border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all duration-200 flex justify-between items-center">
                    <div className="flex flex-col gap-y-1.5 flex-1 pr-4">
                      <div className="flex items-center gap-x-2 text-xs font-semibold text-neutral-400">
                        <RiCalendarLine className="text-neutral-500" />
                        <span>{item.date}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-white font-bold">{item.game}</span>
                      </div>
                      <h3 className="text-base font-black text-white tracking-tight group-hover:text-neutral-200 transition">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-x-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-x-1">
                          <RiMapPinLine /> {item.location}
                        </span>
                        <span className="flex items-center gap-x-1">
                          <RiTeamLine /> {item.count}명 출전
                        </span>
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div className="flex flex-col items-center justify-center min-w-[70px] bg-neutral-900 border border-neutral-800 rounded-2xl p-3">
                      <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                        RANK
                      </span>
                      <span className={`text-3xl font-black tracking-tighter ${
                        item.grade === 1 ? "text-white" : "text-neutral-300"
                      }`}>
                        {item.grade}
                      </span>
                    </div>
                  </div>
                </Link>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Career;
