import React from "react";
import { Link } from "react-router-dom";
import { Banner2 } from "../components/Banners";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";

const Career = () => {
  return (
    <div className="flex w-full justify-center">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="김진배 선수의 커리어" banner={<Banner2 />} />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-3">
          <div className="flex w-full justify-between mb-20">
            <div className="flex w-full h-full justify-start flex-col gap-y-3 mt-6 px-2">
              <div className="flex flex-col w-full gap-y-3">
                <p className="text-lg font-light px-2">2022</p>
                <Link to="/careerview">
                  <div className="flex bg-white rounded-lg p-5 shadow-sm">
                    <div className="flex w-2/3 justify-center items-start flex-col">
                      <span className="text-sm font-light">12.01</span>
                      <span className="text-xl font-bold mt-2 mb-2">
                        경기용인보디빌딩대회
                      </span>
                      <span className="text-sm font-light">
                        용인운동장 / 총참가인원 : 283명
                      </span>
                    </div>
                    <div className="flex w-1/3 justify-end items-center flex-col">
                      <span className="text-sm font-light">180 클래식</span>
                      <span className="text-6xl font-bold">3</span>
                    </div>
                  </div>
                </Link>
                <div className="flex bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex w-2/3 justify-center items-start flex-col">
                    <span className="text-sm font-light">11.01</span>
                    <span className="text-xl font-bold mt-2 mb-2">
                      경기안성보디빌딩대회
                    </span>
                    <span className="text-sm font-light">
                      안성체육관 / 총참가인원 : 152명
                    </span>
                  </div>
                  <div className="flex w-1/3 justify-end items-center flex-col">
                    <span className="text-sm font-light">스포츠</span>
                    <span className="text-6xl font-bold">4</span>
                  </div>
                </div>
                <div className="flex bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex w-2/3 justify-center items-start flex-col">
                    <span className="text-sm font-light">9.11</span>
                    <span className="text-xl font-bold mt-2 mb-2">
                      경기성남보디빌딩대회
                    </span>
                    <span className="text-sm font-light">
                      성남시청 / 총참가인원 : 380명
                    </span>
                  </div>
                  <div className="flex w-1/3 justify-end items-center flex-col">
                    <span className="text-sm font-light">보디빌딩</span>
                    <span className="text-6xl font-bold">1</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col w-full gap-y-3 bg-slate-100">
                <p className="text-lg font-light px-2">2021</p>
                <div className="flex bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex w-2/3 justify-center items-start flex-col">
                    <span className="text-sm font-light">12.01</span>
                    <span className="text-xl font-bold mt-2 mb-2">
                      경기용인보디빌딩대회
                    </span>
                    <span className="text-sm font-light">
                      용인운동장 / 총참가인원 : 283명
                    </span>
                  </div>
                  <div className="flex w-1/3 justify-end items-center flex-col">
                    <span className="text-sm font-light">180 클래식</span>
                    <span className="text-6xl font-bold">3</span>
                  </div>
                </div>
                <div className="flex bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex w-2/3 justify-center items-start flex-col">
                    <span className="text-sm font-light">11.01</span>
                    <span className="text-xl font-bold mt-2 mb-2">
                      경기안성보디빌딩대회
                    </span>
                    <span className="text-sm font-light">
                      안성체육관 / 총참가인원 : 152명
                    </span>
                  </div>
                  <div className="flex w-1/3 justify-end items-center flex-col">
                    <span className="text-sm font-light">스포츠</span>
                    <span className="text-6xl font-bold">4</span>
                  </div>
                </div>
                <div className="flex bg-white rounded-lg p-5 shadow-sm">
                  <div className="flex w-2/3 justify-center items-start flex-col">
                    <span className="text-sm font-light">9.11</span>
                    <span className="text-xl font-bold mt-2 mb-2">
                      경기성남보디빌딩대회
                    </span>
                    <span className="text-sm font-light">
                      성남시청 / 총참가인원 : 380명
                    </span>
                  </div>
                  <div className="flex w-1/3 justify-end items-center flex-col">
                    <span className="text-sm font-light">보디빌딩</span>
                    <span className="text-6xl font-bold">1</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
