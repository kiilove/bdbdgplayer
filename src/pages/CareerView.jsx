import React from "react";
import { Banner1 } from "../components/Banners";
import BottomMenu from "../components/BottomMenu";
import { DummyTable, DummyTable2 } from "../components/Dummy";
import Header from "../components/Header";
import { DEFAULT_AVATAR } from "../consts";

const CareerView = () => {
  return (
    <div className="flex w-full justify-center">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="대회기록 상세보기" banner={<Banner1 />} />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-3">
          <div
            className="flex w-full h-15 bg-local"
            style={{
              width: "100%",
              height: "220px",
              backgroundSize: "cover",
              backgroundImage:
                "url(http://www.idomin.com/news/photo/201908/705560_405176_1535.jpg)",
            }}
          >
            <div className="flex w-full h-full flex-col p-5">
              <div className="flex w-full justify-center h-20">
                <span className="text-white font-semibold drop-shadow-xl shadow-black">
                  2022.11.11
                </span>
              </div>
              <div className="flex w-full justify-center items-center h-20">
                <span className="text-white font-semibold text-3xl drop-shadow-xl shadow-black">
                  경기용인시보디빌딩대회
                </span>
              </div>
              <div className="flex w-full justify-center items-center h-20">
                <span className="text-white font-semibold drop-shadow-xl shadow-black">
                  용인시립체육관
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full gap-y-3 px-2">
            <div className="flex bg-white rounded-lg p-0 shadow-sm w-full">
              <div className="flex w-full justify-center items-start flex-col">
                <div className="flex w-full items-center justify-between p-5">
                  <div className="flex items-center">
                    <img src={DEFAULT_AVATAR} className="rounded-full w-10" />
                    <span className="text-sm ml-3">김진배 선수</span>
                  </div>
                  <div className="flex items-center justify-end mr-5 text-sm">
                    125(1위)
                  </div>
                </div>
                <div className="flex w-full items-center mb-2">
                  <DummyTable />
                </div>
              </div>
            </div>
            <div className="flex bg-white rounded-lg p-0 shadow-sm w-full">
              <div className="flex w-full justify-center items-start flex-col">
                <div className="flex w-full items-center justify-between p-5">
                  <div className="flex items-center">
                    <span className="text-sm ml-3">TOP10 비교</span>
                  </div>
                </div>
                <div className="flex w-full items-center px-5">
                  <DummyTable2 />
                </div>
              </div>
            </div>
            <div className="flex bg-white rounded-lg p-0 shadow-sm w-full mb-20">
              <div className="flex w-full justify-center items-start flex-col">
                <div className="flex w-full items-center justify-between p-5">
                  <div className="flex items-center">
                    <span className="text-sm ml-3">대회사진</span>
                  </div>
                </div>

                <div className="flex h-60 bg-white w-full rounded-lg shadow-sm p-5 gap-x-2 overflow-x-auto overflow-y-hidden flex-nowrap">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmsyrN_VtrlXd3FkyugXUBrmKvlowe_nq3aQ&usqp=CAU"
                    className="w-32 h-48 object-cover rounded-lg"
                  />

                  <img
                    src="https://mblogthumb-phinf.pstatic.net/20160911_38/wju0504_1473605742521bF9uO_JPEG/2016_yongin_%281903%29_%BB%E7%BA%BB.jpg?type=w2"
                    className="w-32 h-48 object-cover rounded-lg"
                  />

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG_glhcj_QrJsmWWhTsvPw5x4GxKsKSF7Lqg&usqp=CAU"
                    className="w-32 h-48 object-cover rounded-lg"
                  />

                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtP8XZJETvg0drg8cUGXENNaD9IclYEgSWGQ&usqp=CAU"
                    className="w-32 h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerView;
