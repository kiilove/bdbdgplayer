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
    <div className="relative min-h-screen bg-[#F4F5FA] text-[#0F172A] w-full pb-32 font-sans antialiased">
      <PosterWallBackground />
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#4F46E5"
            strokeWidth="4"
            animationDuration="0.75"
            width="52"
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
          <main className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-7">
            <section className="rounded-[28px] bg-white/92 backdrop-blur-md bg-gradient-to-br from-indigo-50/60 via-white/95 to-rose-50/55 border border-slate-200/90 p-6 sm:p-9 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#FF2E54] border border-rose-200/90 text-xs font-extrabold w-fit shadow-[0_2px_8px_rgba(255,46,84,0.10)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF2E54] animate-pulse" />
                  <span>LIVE SCHEDULE · 현재 접수 중 총 {noticeList?.length || 0}건</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight leading-[1.3] break-keep">
                  보디빌딩 & 피트니스 <br className="sm:hidden" />
                  <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#FF2E54] bg-clip-text text-transparent">
                    공식 대회 접수 일정
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed break-keep">
                  참가신청이 진행 중인 공식 대회의 개최 일자와 장소,{" "}
                  <br className="sm:hidden" />
                  모집 요강을 한눈에 확인하실 수 있습니다.
                </p>
              </div>
            </section>

            {noticeList?.length === 0 ? (
              <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-3xl p-16 text-center text-slate-500 font-semibold text-base shadow-sm">
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
