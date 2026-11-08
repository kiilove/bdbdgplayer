import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { MdArrowForward } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";
import { useLoginPrompt } from "../hooks/useLoginPrompt";
import { isGbbfContest } from "../services/contestService";

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

  // 탭 필터링에 따른 동적 카드 목록
  const displayedContests = allContests.filter((item) => {
    if (activeTab === "gbbf") {
      return isGbbfContest(item);
    }
    if (activeTab === "sub") {
      return !isGbbfContest(item);
    }
    return true;
  });

  const totalCount = allContests.length;
  const gbbfCount = allContests.filter(isGbbfContest).length;
  const subCount = allContests.filter((item) => !isGbbfContest(item)).length;
  const myAppliedCount = Object.keys(invoices || {}).length;

  const tabs = [
    { id: "all", label: "전체 접수대회", count: totalCount },
    { id: "gbbf", label: "경기도보디빌딩협회", count: gbbfCount },
    { id: "sub", label: "경기도 산하 보디빌딩협회", count: subCount },
  ];

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#191F28] font-sans antialiased pb-32">
      <BottomMenu />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-black tracking-tighter text-[#191F28] cursor-pointer flex items-center gap-2"
          >
            <span className="text-[#2563EB]">BDBDG</span>
            <span className="text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-full hidden sm:inline">
              OFFICIAL ATHLETE PORTAL
            </span>
          </button>

          {pInfo?.playerUid ? (
            <button
              type="button"
              onClick={() => navigate("/myprofile")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/90 hover:bg-blue-100/80 border border-blue-200/80 text-xs sm:text-sm font-bold text-[#2563EB] transition cursor-pointer"
            >
              <RiUserLine className="text-base" />
              <span>{pInfo.pName || "선수 회원"} 님 · 마이페이지</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-bold shadow-[0_2px_10px_rgba(37,99,235,0.22)] transition cursor-pointer"
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-7">
        {/* Bright Editorial Bento Hero Section */}
        <section className="rounded-[28px] bg-gradient-to-br from-white via-white to-blue-50/60 border border-slate-200/80 p-6 sm:p-9 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-200/80 text-xs font-bold w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
                <span>LIVE REGISTRATION · 공식 대회 통합 접수</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#191F28] leading-[1.28] break-keep">
                보디빌딩 & 피트니스 <br className="sm:hidden" />
                공식 대회 참가접수
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed break-keep">
                현재 접수 중인 대회의 모집 요강을 확인하고,{" "}
                <br className="sm:hidden" />
                온라인 참가신청 및 접수증 출력을 간편하게 진행하세요.
              </p>
            </div>

            {pInfo?.playerUid ? (
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>내 신청내역 및 접수증 출력</span>
                <MdArrowForward className="text-base" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-7 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>선수 로그인 / 참가 등록</span>
                <MdArrowForward className="text-lg" />
              </button>
            )}
          </div>

          {/* Interactive Bento Summary Strip (Soft & Bright Tones) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-5 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleTabSelect("all")}
              className={`rounded-2xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                activeTab === "all"
                  ? "bg-blue-50/90 text-[#2563EB] border-blue-200 shadow-sm"
                  : "bg-[#F8FAFC] text-[#191F28] border-slate-100 hover:border-blue-200"
              }`}
            >
              <span
                className={`text-[11px] font-bold block ${
                  activeTab === "all" ? "text-blue-600" : "text-slate-500"
                }`}
              >
                전체 접수중
              </span>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5 block tabular-nums">
                {totalCount}
                <span className="text-xs font-bold ml-0.5">건</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabSelect("gbbf")}
              className={`rounded-2xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                activeTab === "gbbf"
                  ? "bg-blue-50/90 text-[#2563EB] border-blue-200 shadow-sm"
                  : "bg-[#F8FAFC] text-[#191F28] border-slate-100 hover:border-blue-200"
              }`}
            >
              <span
                className={`text-[11px] font-bold block truncate ${
                  activeTab === "gbbf" ? "text-blue-600" : "text-slate-500"
                }`}
              >
                경기도협회
              </span>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5 block tabular-nums">
                {gbbfCount}
                <span className="text-xs font-bold ml-0.5">건</span>
              </span>
            </button>

            {pInfo?.playerUid ? (
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="rounded-2xl p-3.5 sm:p-4 text-left transition cursor-pointer bg-emerald-50/80 hover:bg-emerald-100/70 border border-emerald-200/80 text-emerald-900"
              >
                <span className="text-[11px] font-bold text-emerald-700 block truncate">
                  내 신청완료
                </span>
                <span className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5 block tabular-nums">
                  {myAppliedCount}
                  <span className="text-xs font-bold ml-0.5">건</span>
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleTabSelect("sub")}
                className={`rounded-2xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                  activeTab === "sub"
                    ? "bg-blue-50/90 text-[#2563EB] border-blue-200 shadow-sm"
                    : "bg-[#F8FAFC] text-[#191F28] border-slate-100 hover:border-blue-200"
                }`}
              >
                <span
                  className={`text-[11px] font-bold block truncate ${
                    activeTab === "sub" ? "text-blue-600" : "text-slate-500"
                  }`}
                >
                  시·군 산하 협회
                </span>
                <span className="text-lg sm:text-2xl font-extrabold tracking-tight mt-0.5 block tabular-nums">
                  {subCount}
                  <span className="text-xs font-bold ml-0.5">건</span>
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Filter Tabs (Bright Royal Blue Active Pill) */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-2 w-max sm:w-full pb-1 pr-4 sm:pr-0">
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
                  className={`px-4 sm:px-5 py-2.5 rounded-full flex items-center gap-x-2 text-[13px] sm:text-sm font-bold transition cursor-pointer whitespace-nowrap shrink-0 ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.24)]"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-blue-300 hover:text-[#2563EB]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold tabular-nums ${
                      isActive
                        ? "bg-white/25 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Contest Cards List */}
        <div className="flex flex-col gap-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <RotatingLines
                strokeColor="#2563EB"
                strokeWidth="4"
                animationDuration="0.75"
                width="48"
                visible={true}
              />
            </div>
          ) : displayedContests.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-[28px] p-16 text-center text-slate-500 font-semibold text-base shadow-sm">
              현재 해당 부문에 접수 중인 대회가 없습니다.
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
