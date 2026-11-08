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
    <div className="relative min-h-screen bg-[#E6E9F2] text-[#0F172A] w-full font-sans antialiased">
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
          <div className="relative z-10 max-w-[1080px] mx-auto w-full min-h-[calc(100vh-3.5rem)] bg-[#F5F6FA] border-x border-slate-200/90 shadow-[0_0_60px_rgba(15,23,42,0.16)] pb-32">
            <main className="w-full px-4 sm:px-8 py-6 md:py-9 flex flex-col gap-y-7">
              <section className="rounded-2xl bg-white bg-gradient-to-br from-[#F5F4FF] via-white to-[#FFF2F5] border border-slate-200/90 p-6 sm:p-9 shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
                <div className="flex flex-col gap-y-2.5 max-w-2xl">
                  <div className="inline-flex items-center gap-2 border-l-2 border-[#FF2E54] pl-2.5 text-xs font-extrabold text-[#FF2E54] tracking-wider uppercase w-fit">
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
                <div className="bg-white border border-slate-200/90 rounded-2xl p-16 text-center text-slate-500 font-semibold text-base shadow-sm">
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
          </div>
        </>
      )}
    </div>
  );
};

export default CupList;
