import React from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import PosterWallBackground from "../components/common/PosterWallBackground";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";
import { useLoginPrompt } from "../hooks/useLoginPrompt";
import { isGbbfContest } from "../services/contestService";

const Gbbf = () => {
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
  const navigate = useNavigate();

  const noticeList = allContests.filter(isGbbfContest);

  return (
    <div className="relative min-h-screen bg-[#F4F5FA] text-[#0F172A] flex flex-col pb-32 font-sans antialiased">
      <PosterWallBackground />
      <BottomMenu />
      <Header title="경기도보디빌딩협회" />

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-7">
        <section className="rounded-2xl bg-white/92 backdrop-blur-md bg-gradient-to-br from-amber-50/55 via-white/95 to-indigo-50/60 border border-slate-200/90 p-6 sm:p-9 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 border-l-2 border-amber-500 pl-2.5 text-xs font-extrabold text-amber-700 tracking-wider uppercase w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>GBBF OFFICIAL · 경기도보디빌딩협회 공식 승인</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-[1.3] break-keep">
                경기도보디빌딩협회 <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#FF2E54] bg-clip-text text-transparent">
                  공식 주관 대회 일정
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed break-keep">
                경기도보디빌딩협회에서 직접 주관 및 승인한{" "}
                <br className="sm:hidden" />
                공식 보디빌딩 & 피트니스 대회 공고 목록입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-5 py-3.5 bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 border border-indigo-200/80 font-bold text-sm rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 text-center"
            >
              전체 대회 통합 보기
            </button>
          </div>
        </section>

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
        ) : noticeList.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-16 text-center text-slate-500 font-semibold text-base shadow-sm">
            현재 등록된 경기도보디빌딩협회 주관 대회가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-y-6">
            {noticeList.map((item) => {
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
                  posterBadgeText="접수중"
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gbbf;
