import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";

const CupList = () => {
  const {
    contests: noticeList,
    invoices,
    isLoading,
    error,
    playerInfo: pInfo,
  } = useActiveContests();
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const navigate = useNavigate();

  const redirectLogin = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const messageClose = () => {
    setMessageOpen(false);
  };

  const handleRequireLogin = () => {
    setMessage({
      body: "대회 참가신청을 하려면 로그인이 필요합니다.",
      body2: "로그인 페이지로 이동하시겠습니까?",
      isButton: true,
      confirmButtonText: "로그인 이동",
      cancelButtonText: "취소",
    });
    setMessageOpen(true);
  };

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
          <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-7 md:py-10 flex flex-col gap-y-8">
            <section className="rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
              <div className="flex flex-col gap-y-2.5 max-w-2xl">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F7] border border-neutral-200/80 text-xs font-bold text-neutral-700 w-fit">
                  접수 진행 중인 대회 총 {noticeList?.length || 0}건
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-tight break-keep">
                  보디빌딩 & 피트니스 대회 접수 일정
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed break-keep">
                  현재 참가신청이 진행 중인 공식 대회의 개최 일자, 장소 및 모집 요강을 확인하실 수 있습니다.
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
