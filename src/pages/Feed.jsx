import React, { useState } from "react";
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

  const activePhotos = tab === "all" ? dummyFeeds : dummyMys;

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex justify-center pb-28">
      <BottomMenu />
      <div className="w-full max-w-lg flex flex-col">
        <Header title="선수 갤러리 피드" />

        {/* Nike Minimal Horizontal Tabs */}
        <div className="w-full bg-[#0B0B0B] border-b border-neutral-800 flex sticky top-16 z-20">
          <button
            className={`flex-1 py-4 text-center text-xs font-black tracking-widest uppercase transition-all relative ${
              tab === "all"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent"
            }`}
            onClick={() => setTab("all")}
          >
            피드 탐색
          </button>
          <button
            className={`flex-1 py-4 text-center text-xs font-black tracking-widest uppercase transition-all relative ${
              tab === "my"
                ? "text-white border-b-2 border-white"
                : "text-neutral-500 hover:text-neutral-300 border-b-2 border-transparent"
            }`}
            onClick={() => setTab("my")}
          >
            내 대회사진
          </button>
        </div>

        {/* Photo Stream */}
        <div className="p-4 flex flex-col gap-4">
          {activePhotos.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-3xl bg-[#141414] border border-neutral-800 shadow-xl transition-all duration-300"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-900">
                <img
                  src={item.photourl}
                  alt={`Feed item ${item.id}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
