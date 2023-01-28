import React, { useState } from "react";
import { Banner2 } from "../components/Banners";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { FaMedal, FaLaughBeam, FaSadCry, FaFlushed } from "react-icons/fa";
import AnalyzeLineType from "../components/AnalyzeLineType";
import AnalyzeMariType from "../components/AnalyzeMariType";
import AnalyzeBarType from "../components/AnalyzeBarType";

const AnalyzeDetail = () => {
  const [selectMenu, setSelectMenu] = useState("1");
  return (
    <div className="flex w-full justify-center">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="나의 모습 상세분석" banner={<Banner2 />} />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-3">
          <div className="flex w-full h-full justify-start align-top flex-wrap box-border">
            <div className="flex w-full h-full justify-center items-start bg-white pt-2">
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "1" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "1"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">순위</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      1<span className="text-xs font-medium ml-1">위</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-yellow-400">
                    <FaMedal />
                  </span>
                </div>
              </div>
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "2" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "2"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">신체</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      11<span className="text-xs font-medium ml-1">점</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-red-400">
                    <FaSadCry />
                  </span>
                </div>
              </div>
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "3" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "3"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">예술</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      10<span className="text-xs font-medium ml-1">점</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-blue-400">
                    <FaLaughBeam />
                  </span>
                </div>
              </div>
            </div>
            <div className="flex w-full h-full justify-center items-start bg-white">
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "4" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "4"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">독창</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      10<span className="text-xs font-medium ml-1">점</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-slate-400">
                    <FaFlushed />
                  </span>
                </div>
              </div>
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "5" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "5"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">규정</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      16<span className="text-xs font-medium ml-1">점</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-red-400">
                    <FaSadCry />
                  </span>
                </div>
              </div>
              <div
                className={`flex w-1/3 h-24 flex-col justify-center items-center ${
                  selectMenu === "6" ? "bg-orange-300" : "bg-white"
                }`}
                onClick={() => setSelectMenu((prev) => (prev = "6"))}
              >
                <div className="flex h-1/3 items-center">
                  <span className="text-xs font-medium">의상</span>
                </div>
                <div className="flex w-full justify-center h-1/3">
                  <div className="flex items-end">
                    <span className="text-2xl font-semibold align-text-bottom">
                      12<span className="text-xs font-medium ml-1">점</span>
                    </span>
                  </div>
                </div>
                <div className="flex h-1/3 items-center">
                  <span className="font-medium text-slate-400">
                    <FaFlushed />
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 중간 메뉴 끝 */}
          {/* 개별 그래프 시작 */}
          <div className="flex w-full h-full justify-start align-top flex-wrap box-border px-2 rounded-lg mb-32">
            <div className="flex w-full h-full flex-col bg-white rounded-lg ">
              <div className="flex w-full h-14 justify-center items-center border-b border-gray-200">
                <span className="flex h-full text-lg text-gray-600 align-middle items-center">
                  순위
                </span>
              </div>
              <div className="flex w-full px-3">
                <AnalyzeLineType />
              </div>
              <div className="flex w-full px-3 mb-3">
                <span className="text-sm text-gray-600">
                  최근경기 Top3와의 비교
                </span>
              </div>
              <div className="flex w-full px-3 mb-3">
                <AnalyzeBarType />
              </div>
            </div>
          </div>
          {/* 개별 그래프 끝 */}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeDetail;
