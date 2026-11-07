import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { RiShieldStarLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
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
      confirmButtonText: "이동",
      cancelButtonText: "취소",
    });
    setMessageOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col pb-32 font-sans antialiased">
      <BottomMenu />

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-black/90 border-b border-neutral-800 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <button
              onClick={() => navigate("/")}
              className="text-xs font-bold text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1 bg-neutral-900 px-3.5 py-1.5 rounded-full border border-neutral-800 active:scale-95"
            >
              <span>← 홈으로</span>
            </button>
            <span className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
              경기도보디빌딩협회
            </span>
          </div>
          {pInfo?.playerUid && (
            <span className="text-xs font-bold text-neutral-300 bg-neutral-900 px-3.5 py-1.5 rounded-full border border-neutral-800">
              {pInfo.pNick ? pInfo.pNick : pInfo.pName} 님
            </span>
          )}
        </div>
      </header>

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-y-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#141414] border border-neutral-800 p-8 md:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest text-neutral-200 uppercase w-fit">
                <RiShieldStarLine className="text-base text-white" />
                <span>GBBF OFFICIAL SANCTIONED</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none break-keep">
                경기도보디빌딩협회 <br className="hidden sm:block" />
                <span className="text-white">공식 주관 대회</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed">
                경기도보디빌딩협회에서 주관 및 승인한 공식 보디빌딩 & 피트니스 대회 공고 목록입니다.
              </p>
            </div>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-bold text-xs sm:text-sm rounded-full transition cursor-pointer whitespace-nowrap active:scale-95"
            >
              전체 대회 통합 보기
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <RotatingLines
              strokeColor="#ffffff"
              strokeWidth="4"
              animationDuration="0.75"
              width="54"
              visible={true}
            />
          </div>
        ) : noticeList.length === 0 ? (
          <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-16 text-center text-neutral-500 font-bold text-sm shadow-xl">
            현재 등록된 경기도보디빌딩협회 주관 대회가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col gap-y-8">
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
                  posterBadgeText="GBBF OFFICIAL"
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
