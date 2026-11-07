import React from "react";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
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
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] w-full pb-32 font-sans antialiased">
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#111111"
            strokeWidth="4"
            animationDuration="0.75"
            width="52"
            visible={true}
          />
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-rose-600 font-bold">
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
          <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 md:py-10 flex flex-col gap-y-7">
            <section className="rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111111] text-white text-xs font-bold w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>현재 접수 진행 중 · 총 {noticeList?.length || 0}건</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-[1.3] break-keep">
                  보디빌딩 & 피트니스 <br className="sm:hidden" />
                  공식 대회 접수 일정
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed break-keep">
                  참가신청이 진행 중인 공식 대회의 개최 일자와 장소,{" "}
                  <br className="sm:hidden" />
                  모집 요강을 한눈에 확인하실 수 있습니다.
                </p>
              </div>
            </section>

            {noticeList?.length === 0 ? (
              <div className="bg-white border border-neutral-200/90 rounded-3xl p-16 text-center text-neutral-500 font-semibold text-base shadow-sm">
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
