import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { MdArrowForward, MdSearch, MdClose } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import PosterWallBackground from "../components/common/PosterWallBackground";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";
import { useLoginPrompt } from "../hooks/useLoginPrompt";
import { isGbbfContest } from "../services/contestService";
import { getContestDDayBadge } from "../utils/formatUtils";

const Home = () => {
  const {
    contests: allContests,
    invoices,
    isLoading,
    playerInfo: pInfo,
  } = useActiveContests();
  const {
    message,
    messageOpen,
    handleRequireLogin,
    redirectLogin,
    messageClose,
  } = useLoginPrompt();
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'gbbf' | 'sub'
  const [searchQuery, setSearchQuery] = useState("");
  const tabRefs = useRef({});
  const navigate = useNavigate();

  const handleTabSelect = (tabId) => {
    setActiveTab(tabId);
    const targetEl = tabRefs.current[tabId];
    if (targetEl && typeof targetEl.scrollIntoView === "function") {
      targetEl.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const trimmedQuery = searchQuery.trim().toLowerCase();

  const displayedContests = allContests.filter((item) => {
    if (activeTab === "gbbf" && !isGbbfContest(item)) {
      return false;
    }
    if (activeTab === "sub" && isGbbfContest(item)) {
      return false;
    }
    if (trimmedQuery) {
      const title = (item.contestTitle || "").toLowerCase();
      const location = (item.contestLocation || "").toLowerCase();
      const associate = (
        item.contestAssociate ||
        item.contestPromoter ||
        ""
      ).toLowerCase();
      return (
        title.includes(trimmedQuery) ||
        location.includes(trimmedQuery) ||
        associate.includes(trimmedQuery)
      );
    }
    return true;
  });

  const totalCount = allContests.length;
  const gbbfCount = allContests.filter(isGbbfContest).length;
  const subCount = allContests.filter((item) => !isGbbfContest(item)).length;
  const myAppliedCount = Object.keys(invoices || {}).length;

  // 가장 임박한 대회 D-Day 스포트라이트 (SNKRS / KREAM 드롭 티커)
  const featuredContest = allContests[0] || null;
  const featuredDDay = featuredContest
    ? getContestDDayBadge(featuredContest.contestDate)
    : null;

  const tabs = [
    { id: "all", label: "전체 접수대회", count: totalCount },
    { id: "gbbf", label: "경기도보디빌딩협회", count: gbbfCount },
    { id: "sub", label: "경기도 산하 보디빌딩협회", count: subCount },
  ];

  return (
    <div className="relative min-h-screen bg-[#F6F7F9] text-[#111111] font-sans antialiased pb-32">
      <PosterWallBackground />
      <BottomMenu />

      {/* Minimal Editorial Top Header (KREAM / 29CM Style) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-5xl mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-black tracking-[-0.04em] text-[#111111] cursor-pointer flex items-center gap-2.5"
          >
            <span>
              BDBDG<span className="text-[#FF3B30]">.</span>
            </span>
            <span className="w-px h-3 bg-neutral-300 hidden sm:inline-block" />
            <span className="text-[11px] font-semibold text-neutral-400 tracking-[0.08em] uppercase hidden sm:inline">
              OFFICIAL CONTEST PORTAL
            </span>
          </button>

          {pInfo?.playerUid ? (
            <button
              type="button"
              onClick={() => navigate("/myprofile")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200/80 text-xs sm:text-sm font-bold text-[#111111] transition cursor-pointer"
            >
              <RiUserLine className="text-sm text-neutral-600" />
              <span>{pInfo.pName || "선수 회원"} 님 · 마이페이지</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-[#111111] hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
            >
              로그인 / 회원가입
            </button>
          )}
        </div>
      </header>

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-6">
        {/* Minimal Editorial Hero Section */}
        <section className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col gap-7">
          {/* Top Drop Ticker Bar (SNKRS / KREAM Drop Notice Style) */}
          {featuredContest && (
            <div className="flex items-center justify-between gap-3 bg-[#FAFAFA] border border-neutral-200/70 rounded-xl px-3.5 py-2.5 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded-[4px] bg-[#111111] text-white font-extrabold text-[10px] tracking-wider uppercase shrink-0">
                  NEXT STAGE
                </span>
                {featuredDDay && (
                  <span className="font-black text-[#FF3B30] tabular-nums shrink-0">
                    {featuredDDay.label}
                  </span>
                )}
                <span className="text-neutral-700 font-bold truncate">
                  {featuredContest.contestTitle}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cid = featuredContest.id;
                  const invId =
                    invoices[cid] ||
                    (featuredContest.refContestId
                      ? invoices[featuredContest.refContestId]
                      : null);
                  if (invId) {
                    navigate(`/contestjoinedit/${invId}`);
                  } else if (pInfo?.playerUid) {
                    navigate(`/contestjoin/${cid}`);
                  } else {
                    handleRequireLogin(`/contestjoin/${cid}`);
                  }
                }}
                className="text-[#111111] font-extrabold hover:underline shrink-0 flex items-center gap-0.5 cursor-pointer"
              >
                <span>바로가기</span>
                <MdArrowForward className="text-xs" />
              </button>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col gap-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#FF3B30] tracking-[0.08em] uppercase w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                <span>LIVE REGISTRATION · 공식 대회 통합 접수</span>
              </div>
              <h1 className="text-2xl sm:text-[34px] font-black tracking-[-0.03em] text-[#111111] leading-[1.22] break-keep">
                보디빌딩 & 피트니스 공식 대회 참가접수
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-500 font-medium leading-relaxed break-keep">
                현재 접수 중인 대회의 모집 요강을 확인하고, 온라인 참가신청 및
                접수증 출력을 간편하게 진행하세요.
              </p>
            </div>

            {pInfo?.playerUid ? (
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>내 신청내역 및 접수증 출력</span>
                <MdArrowForward className="text-base" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>선수 로그인 / 참가 등록</span>
                <MdArrowForward className="text-base" />
              </button>
            )}
          </div>

          {/* Monochrome Architectural KPI Bar */}
          <div className="grid grid-cols-3 divide-x divide-neutral-200/80 border-t border-neutral-100 pt-5">
            <button
              type="button"
              onClick={() => handleTabSelect("all")}
              className="pr-3 sm:pr-6 text-left transition cursor-pointer group"
            >
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 group-hover:text-[#111111] transition block">
                전체 접수중
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] tabular-nums">
                  {totalCount}
                </span>
                <span className="text-xs font-bold text-neutral-400">건</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("gbbf")}
              className="px-3 sm:px-6 text-left transition cursor-pointer group"
            >
              <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 group-hover:text-[#111111] transition block truncate">
                경기도협회 주관
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] tabular-nums">
                  {gbbfCount}
                </span>
                <span className="text-xs font-bold text-neutral-400">건</span>
              </div>
            </button>

            {pInfo?.playerUid ? (
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="pl-3 sm:pl-6 text-left transition cursor-pointer group"
              >
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 group-hover:text-[#111111] transition block truncate">
                  내 신청완료
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#FF3B30] tabular-nums">
                    {myAppliedCount}
                  </span>
                  <span className="text-xs font-bold text-neutral-400">건</span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleTabSelect("sub")}
                className="pl-3 sm:pl-6 text-left transition cursor-pointer group"
              >
                <span className="text-[11px] sm:text-xs font-semibold text-neutral-400 group-hover:text-[#111111] transition block truncate">
                  시·군 산하 협회
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111] tabular-nums">
                    {subCount}
                  </span>
                  <span className="text-xs font-bold text-neutral-400">건</span>
                </div>
              </button>
            )}
          </div>
        </section>

        {/* Filter Bar + Instant Search (KREAM / 29CM Style) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth flex-1">
            <div className="inline-flex sm:flex items-center gap-1.5 p-1.5 bg-white border border-neutral-200/90 rounded-xl w-max sm:w-full shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    ref={(el) => {
                      tabRefs.current[tab.id] = el;
                    }}
                    type="button"
                    onClick={() => handleTabSelect(tab.id)}
                    className={`flex-1 px-4 sm:px-5 py-2.5 rounded-lg flex items-center justify-center gap-x-2 text-[13px] sm:text-sm font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? "bg-[#111111] text-white"
                        : "text-neutral-500 hover:bg-neutral-100 hover:text-[#111111]"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-[4px] font-extrabold tabular-nums ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-lg pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="대회명, 지역(화성·수원 등) 검색"
              className="w-full h-[46px] pl-10 pr-9 bg-white border border-neutral-200/90 focus:border-[#111111] rounded-xl text-xs sm:text-sm font-semibold text-[#111111] placeholder-neutral-400 focus:outline-none transition shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#111111] cursor-pointer"
              >
                <MdClose className="text-base" />
              </button>
            )}
          </div>
        </div>

        {/* Contest Cards List */}
        <div className="flex flex-col gap-y-5">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <RotatingLines
                strokeColor="#111111"
                strokeWidth="4"
                animationDuration="0.75"
                width="44"
                visible={true}
              />
            </div>
          ) : displayedContests.length === 0 ? (
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center text-neutral-400 font-semibold text-base">
              {trimmedQuery
                ? `"${searchQuery}" 검색 결과에 해당하는 대회가 없습니다.`
                : "현재 해당 부문에 접수 중인 대회가 없습니다."}
            </div>
          ) : (
            displayedContests.map((item) => {
              const contestId = item.id;
              const userInvoiceId =
                invoices[contestId] ||
                (item.refContestId ? invoices[item.refContestId] : null);

              return (
                <ContestCard
                  key={contestId}
                  contest={item}
                  userInvoiceId={userInvoiceId}
                  isLoggedIn={Boolean(pInfo?.playerUid)}
                  onRequireLogin={handleRequireLogin}
                  variant="horizontal"
                />
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
