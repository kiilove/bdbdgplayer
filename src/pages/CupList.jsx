import React from "react";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import PosterWallBackground from "../components/common/PosterWallBackground";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";
import { useLoginPrompt } from "../hooks/useLoginPrompt";

const CupList = () => {
  const {
    contests: noticeList,
    invoices,
    isLoading,
    error,
    playerInfo: pInfo,
  } = useActiveContests();
  const {
    message,
    messageOpen,
    handleRequireLogin,
    redirectLogin,
    messageClose,
  } = useLoginPrompt();

  return (
    <div className="relative min-h-screen bg-[#F6F7F9] text-[#111111] w-full pb-32 font-sans antialiased">
      <PosterWallBackground />
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#111111"
            strokeWidth="4"
            animationDuration="0.75"
            width="48"
            visible={true}
          />
        </div>
      )}
      {error && (
        <div className="relative z-10 text-center py-10 text-rose-600 font-bold">
          대회 일정을 불러오는 중 오류가 발생했습니다.
        </div>
      )}

      {!isLoading && (
        <>
          <BottomMenu />
          <Header title="전체 대회 일정" />
          <ConfirmationModal
            isOpen={messageOpen}
            onConfirm={redirectLogin}
            onCancel={messageClose}
            message={message}
          />
          <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-6">
            <section className="rounded-2xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col gap-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#FF3B30] tracking-[0.08em] uppercase w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF3B30] animate-pulse" />
                  <span>
                    LIVE SCHEDULE · 현재 접수 중 총 {noticeList?.length || 0}건
                  </span>
                </div>
                <h1 className="text-2xl sm:text-[32px] font-black text-[#111111] tracking-[-0.03em] leading-[1.24] break-keep">
                  보디빌딩 & 피트니스 공식 대회 접수 일정
                </h1>
                <p className="text-sm sm:text-[15px] text-neutral-500 font-medium leading-relaxed break-keep">
                  참가신청이 진행 중인 공식 대회의 개최 일자와 장소, 모집 요강을
                  한눈에 확인하실 수 있습니다.
                </p>
              </div>
            </section>

            {noticeList?.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-16 text-center text-neutral-400 font-semibold text-base">
                현재 접수 중인 대회가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      variant="grid"
                    />
                  );
                })}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default CupList;
