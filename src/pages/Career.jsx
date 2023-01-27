import React from "react";
import BottomMenu from "../components/BottomMenu";

const Career = () => {
  return (
    <div className="flex w-full h-full justify-center items-start align-top bg-slate-100">
      <BottomMenu />
      <div
        className="flex justify-center mt-3 flex-col gap-y-8 w-full"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full justify-between bg-slate-100">
          <div className="flex w-full h-full justify-start flex-col gap-y-3 mt-6">
            <p className="text-lg font-bold px-2">김진배님의 커리어</p>
            <div
              className="flex h-28 rounded-lg shadow-sm flex-col relative"
              style={{ maxWidth: "420px", maxHeight: "112px" }}
            >
              <img
                src="https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fbanner%2Fmaxresdefault.jpg?alt=media&token=a91c2cc7-0733-4445-8c3f-5b4edf125d77"
                className="object-cover"
                style={{ maxWidth: "420px", maxHeight: "112px" }}
              />
              <span
                className="absolute top-2/3 left-1/2 text-white text-lg font-bold drop-shadow-xl shadow-black"
                style={{ transform: "translate(-50%,-50%)" }}
              >
                용인대회 출전신청
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between">
          <div className="flex w-full h-full justify-start flex-col gap-y-3 mt-6 px-2">
            <div className="flex flex-col w-full gap-y-3">
              <p className="text-lg font-light px-2">2022</p>
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
  );
};

export default Career;
