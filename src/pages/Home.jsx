import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { MdArrowForward } from "react-icons/md";
import { RiUserLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import PosterWallBackground from "../components/common/PosterWallBackground";
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
    <div className="relative min-h-screen bg-[#E6E9F2] text-[#0F172A] font-sans antialiased">
      <PosterWallBackground />
      <BottomMenu />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <div className="max-w-[1080px] mx-auto h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2.5"
          >
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#FF2E54] bg-clip-text text-transparent">
              BDBDG
            </span>
            <span className="w-px h-3.5 bg-slate-300 hidden sm:inline-block" />
            <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase hidden sm:inline">
              SPORT & STAGE PORTAL
            </span>
          </button>

          {pInfo?.playerUid ? (
            <button
              type="button"
              onClick={() => navigate("/myprofile")}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-xs sm:text-sm font-bold text-indigo-700 transition cursor-pointer"
            >
              <RiUserLine className="text-base text-indigo-600" />
              <span>{pInfo.pName || "선수 회원"} 님 · 마이페이지</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-[0_4px_14px_rgba(99,102,241,0.30)] transition cursor-pointer"
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

      {/* 중앙 컨텐츠 영역 전체를 확실하게 받쳐주는 불투명 솔리드 스테이지 컨테이너 */}
      <div className="relative z-10 max-w-[1080px] mx-auto min-h-[calc(100vh-4rem)] bg-[#F5F6FA] border-x border-slate-200/90 shadow-[0_0_60px_rgba(15,23,42,0.16)] pb-32">
        <main className="px-4 sm:px-8 py-6 md:py-9 flex flex-col gap-y-7">
          {/* Sportainment Stage Hero Section (100% 불투명 배경으로 뒤 포스터 비침 완전 차단) */}
          <section className="rounded-2xl bg-white bg-gradient-to-br from-[#F5F4FF] via-white to-[#FFF2F5] border border-slate-200/90 p-6 sm:p-9 shadow-[0_8px_28px_rgba(15,23,42,0.05)] flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col gap-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 border-l-2 border-[#FF2E54] pl-2.5 text-xs font-extrabold text-[#FF2E54] tracking-wider uppercase w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E54] animate-pulse" />
                  <span>LIVE STAGE · 공식 대회 통합 접수</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0F172A] leading-[1.28] break-keep">
                  보디빌딩 & 피트니스 <br className="sm:hidden" />
                  <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#FF2E54] bg-clip-text text-transparent">
                    공식 대회 참가접수
                  </span>
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
                  className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm rounded-xl shadow-[0_6px_20px_rgba(99,102,241,0.32)] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <span>내 신청내역 및 접수증 출력</span>
                  <MdArrowForward className="text-base" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full sm:w-auto px-7 py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm rounded-xl shadow-[0_6px_20px_rgba(99,102,241,0.32)] transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <span>선수 로그인 / 참가 등록</span>
                  <MdArrowForward className="text-lg" />
                </button>
              )}
            </div>

            {/* Multi-Tone Sportainment Bento Summary Strip */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleTabSelect("all")}
                className={`rounded-xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                  activeTab === "all"
                    ? "bg-[#F3F2FF] text-indigo-700 border-indigo-200 shadow-sm"
                    : "bg-[#F8FAFC] text-[#0F172A] border-slate-100 hover:border-indigo-200"
                }`}
              >
                <span
                  className={`text-[11px] font-bold block ${
                    activeTab === "all" ? "text-indigo-600" : "text-slate-500"
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
                className={`rounded-xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                  activeTab === "gbbf"
                    ? "bg-[#FFFBEB] text-amber-800 border-amber-200 shadow-sm"
                    : "bg-[#F8FAFC] text-[#0F172A] border-slate-100 hover:border-amber-200"
                }`}
              >
                <span
                  className={`text-[11px] font-bold block truncate ${
                    activeTab === "gbbf" ? "text-amber-700" : "text-slate-500"
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
                  className="rounded-xl p-3.5 sm:p-4 text-left transition cursor-pointer bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-emerald-200 text-emerald-900"
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
                  className={`rounded-xl p-3.5 sm:p-4 text-left transition cursor-pointer border ${
                    activeTab === "sub"
                      ? "bg-[#FFF1F2] text-[#FF2E54] border-rose-200 shadow-sm"
                      : "bg-[#F8FAFC] text-[#0F172A] border-slate-100 hover:border-rose-200"
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold block truncate ${
                      activeTab === "sub" ? "text-[#FF2E54]" : "text-slate-500"
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

          {/* Architectural Segmented Filter Bar (No Pills, 100% Solid Background) */}
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar scroll-smooth">
            <div className="inline-flex sm:flex items-center gap-1.5 p-1.5 bg-white border border-slate-200/90 rounded-xl w-max sm:w-full shadow-sm">
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
                        ? "bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_4px_12px_rgba(99,102,241,0.28)]"
                        : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-[5px] font-extrabold tabular-nums ${
                        isActive
                          ? "bg-white/20 text-white"
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
                  strokeColor="#4F46E5"
                  strokeWidth="4"
                  animationDuration="0.75"
                  width="48"
                  visible={true}
                />
              </div>
            ) : displayedContests.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-16 text-center text-slate-500 font-semibold text-base shadow-sm">
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
    </div>
  );
};

export default Home;
