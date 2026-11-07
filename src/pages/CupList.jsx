import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { RiShieldStarLine } from "react-icons/ri";
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
      confirmButtonText: "이동",
      cancelButtonText: "취소",
    });
    setMessageOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 w-full pb-32 font-sans antialiased">
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#ffffff"
            strokeWidth="4"
            animationDuration="0.75"
            width="64"
            visible={true}
          />
        </div>
      )}
      {error && (
        <div className="text-center py-10 text-rose-400 font-bold">
          오류가 발생했습니다.
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
          <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-y-10">
            <div className="relative rounded-3xl overflow-hidden bg-[#141414] border border-neutral-800 p-8 md:p-10 shadow-2xl">
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex flex-col gap-y-3 max-w-xl">
                  <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest text-neutral-200 uppercase w-fit">
                    <RiShieldStarLine className="text-base text-white" />
                    <span>NATIONWIDE SCHEDULE / OFFICIAL CALENDAR</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none break-keep">
                    전국 보디빌딩 & 피트니스 <br className="hidden sm:block" />
                    <span className="text-white">대회 접수 일정</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed break-keep">
                    현재 참가신청이 진행 중인 공식 보디빌딩 대회의 상세 요강 및 일정을 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            {noticeList?.length === 0 ? (
              <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-16 text-center text-neutral-500 font-bold text-sm shadow-xl">
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
