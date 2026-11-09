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
    <div className="relative min-h-screen bg-[#F6F7F9] text-[#111111] flex flex-col pb-32 font-sans antialiased">
      <PosterWallBackground />
      <BottomMenu />
      <Header title="경기도보디빌딩협회" />

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-6">
        <section className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex flex-col gap-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#FF3B30] tracking-[0.08em] uppercase w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                <span>GBBF OFFICIAL · 경기도보디빌딩협회 공식 승인</span>
              </div>
              <h1 className="text-2xl sm:text-[32px] font-black text-[#111111] tracking-[-0.03em] leading-[1.24] break-keep">
                경기도보디빌딩협회 공식 주관 대회 일정
              </h1>
              <p className="text-sm sm:text-[15px] text-neutral-500 font-medium leading-relaxed break-keep">
                경기도보디빌딩협회에서 직접 주관 및 승인한 공식 보디빌딩 &
                피트니스 대회 공고 목록입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto px-5 py-3.5 bg-neutral-100 hover:bg-neutral-200/80 text-[#111111] font-bold text-sm rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 text-center"
            >
              전체 대회 통합 보기
            </button>
          </div>
        </section>

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
        ) : noticeList.length === 0 ? (
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center text-neutral-400 font-semibold text-base">
            현재 등록된 경기도보디빌딩협회 주관 대회가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-y-5">
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
