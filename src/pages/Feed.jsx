import React, { useState } from "react";
import { Banner1 } from "../components/Banners";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";

const dummyFeeds = [
  {
    id: 1,
    photourl:
      "http://fmtv.co.kr/data/cheditor4/1412/20141216154206_etytiobh.jpg",
  },
  {
    id: 2,
    photourl:
      "https://cdn.gukjenews.com/news/photo/202205/2461440_2457168_322.jpg",
  },
  {
    id: 3,
    photourl:
      "https://img.seoul.co.kr/img/upload/2016/06/08/SSI_20160608150335_O2.jpg",
  },
  {
    id: 4,
    photourl:
      "http://www.siminsori.com/news/photo/201911/219333_68261_5526.jpg",
  },
  {
    id: 5,
    photourl: "https://cdn.onews.tv/news/photo/202106/77801_81112_4839.jpg",
  },
  {
    id: 6,
    photourl:
      "http://www.siminsori.com/news/photo/201911/219334_68262_5726.jpg",
  },
];

const dummyMys = [
  {
    id: 1,
    photourl:
      "http://ptgym.co.kr/files/attach/images/246/256/010/56e15c84a3d5457be4df26bfaabbb07b.jpg",
  },
  {
    id: 2,
    photourl:
      "http://www.siminsori.com/news/photo/201811/205937_55895_1747.jpg",
  },
  {
    id: 3,
    photourl:
      "https://cdn.wonnews.co.kr/news/photo/201804/200934_35982_141.jpg",
  },
];

const Feed = () => {
  const [tab, setTab] = useState("all");
  return (
    <div className="flex w-full justify-center ">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="포토" banner={<Banner1 />} />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-3 bg-slate-100">
          <div className="flex w-full h-12 bg-white">
            <div
              className={`flex w-1/2 h-full justify-center items-center ${
                tab === "all" && "border-b-2 border-orange-500"
              } hover:cursor-pointer`}
              onClick={() => setTab((prev) => (prev = "all"))}
            >
              피드
            </div>
            <div
              className={`flex w-1/2 h-full  justify-center items-center ${
                tab === "my" && "border-b-2 border-orange-500"
              }  hover:cursor-pointer`}
              onClick={() => setTab((prev) => (prev = "my"))}
            >
              내 대회사진
            </div>
          </div>
          {tab === "all"
            ? dummyFeeds.map((item, idx) => (
                <div className="flex w-full h-72 bg-white justify-center">
                  <img
                    src={item.photourl}
                    className=" object-cover object-top"
                  />
                </div>
              ))
            : dummyMys.map((item, idx) => (
                <div className="flex w-full h-72 bg-white">
                  <img
                    src={item.photourl}
                    className=" object-cover object-top flex justify-center items-center"
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
