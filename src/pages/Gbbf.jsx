import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";

const Gbbf = () => {
  const {
    contests: allContests,
    invoices,
    isLoading,
    playerInfo: pInfo,
  } = useActiveContests();
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const navigate = useNavigate();

  const noticeList = allContests.filter(
    (item) =>
      item.contestPromoter?.includes("경기도보디빌딩협회") ||
      item.contestAssociate?.includes("경기도보디빌딩협회")
  );

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
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] flex flex-col pb-32 font-sans antialiased">
      <BottomMenu />
      <Header title="경기도보디빌딩협회" />

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-7 md:py-10 flex flex-col gap-y-8">
        <section className="rounded-3xl bg-white border border-neutral-200/90 p-6 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-y-2.5 max-w-2xl">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F7] border border-neutral-200/80 text-xs font-bold text-neutral-700 w-fit">
                경기도보디빌딩협회 (GBBF) 공식 승인
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight leading-tight break-keep">
                경기도보디빌딩협회 주관 대회
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 font-medium leading-relaxed break-keep">
                경기도보디빌딩협회에서 주관 및 승인한 공식 보디빌딩 & 피트니스 대회 공고 목록입니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-5 py-3 bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] border border-neutral-200 font-bold text-sm rounded-full transition cursor-pointer whitespace-nowrap shrink-0"
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
              width="48"
              visible={true}
            />
          </div>
        ) : noticeList.length === 0 ? (
          <div className="bg-white border border-neutral-200/90 rounded-3xl p-16 text-center text-neutral-500 font-semibold text-base shadow-sm">
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
                  posterBadgeText="경기도보디빌딩협회"
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
