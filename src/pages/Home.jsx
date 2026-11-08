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

  const tabs = [
    { id: "all", label: "전체 접수대회", count: totalCount },
    { id: "gbbf", label: "경기도보디빌딩협회", count: gbbfCount },
    { id: "sub", label: "경기도 산하 보디빌딩협회", count: subCount },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans antialiased pb-32">
      <BottomMenu />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-neutral-200/90">
        <div className="max-w-5xl mx-auto h-14 sm:h-16 px-4 sm:px-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-lg sm:text-xl font-black tracking-tighter text-[#111111] cursor-pointer flex items-center gap-2"
          >
            <span>BDBDG</span>
            <span className="text-xs font-semibold text-neutral-500 hidden sm:inline">
              공식 대회 참가접수
            </span>
          </button>

          {pInfo?.playerUid ? (
            <button
              type="button"
              onClick={() => navigate("/myprofile")}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5F5F7] hover:bg-neutral-200/80 border border-neutral-200 text-xs sm:text-sm font-bold text-[#111111] transition cursor-pointer"
            >
              <RiUserLine className="text-base" />
              <span>{pInfo.pName || "선수 회원"} 님 · 내 신청내역</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-full bg-[#111111] hover:bg-neutral-800 text-white text-xs sm:text-sm font-bold transition cursor-pointer"
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
        {/* Clean Editorial Hero Banner */}
        <section className="rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>공식 협회 주관 대회 통합 접수</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111111] leading-[1.3] break-keep">
                보디빌딩 & 피트니스 <br className="sm:hidden" />
                공식 대회 참가접수
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed break-keep">
                현재 접수 중인 대회의 모집 요강을 확인하고,{" "}
                <br className="sm:hidden" />
                온라인 참가신청 및 접수증 출력을 간편하게 진행하세요.
              </p>
            </div>

            {pInfo?.playerUid ? (
              <button
                type="button"
                onClick={() => navigate("/myprofile")}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#F5F5F7] hover:bg-neutral-200/80 border border-neutral-200 text-[#111111] font-bold text-sm rounded-full transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>내 신청내역 및 접수증 출력</span>
                <MdArrowForward className="text-base" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-7 py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-full shadow-sm transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <span>선수 로그인 / 참가 등록</span>
                <MdArrowForward className="text-lg" />
              </button>
            )}
          </div>
        </section>

        {/* Filter Tabs (모바일 좌우 여백 클리핑 방지 및 탭 클릭 시 자동 중앙 스크롤) */}
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
                      ? "bg-[#111111] text-white shadow-sm"
                      : "bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-300 hover:text-[#111111]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-[#F5F5F7] text-neutral-600"
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
                strokeColor="#111111"
                strokeWidth="4"
                animationDuration="0.75"
                width="48"
                visible={true}
              />
            </div>
          ) : displayedContests.length === 0 ? (
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-16 text-center text-neutral-500 font-semibold text-base shadow-sm">
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
