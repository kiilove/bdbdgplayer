import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { MdArrowForward } from "react-icons/md";
import { RiTrophyLine, RiShieldStarLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import ContestCard from "../components/contest/ContestCard";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useActiveContests } from "../hooks/useActiveContests";

const Home = () => {
  const {
    contests: allContests,
    invoices,
    isLoading,
    playerInfo: pInfo,
  } = useActiveContests();
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'gbbf', 'yongin'
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

  // 탭 필터링에 따른 동적 카드 목록
  const displayedContests = allContests.filter((item) => {
    if (activeTab === "yongin") {
      return (
        item.contestPromoter?.includes("용인") ||
        item.contestTitle?.includes("용인")
      );
    }
    if (activeTab === "gbbf") {
      return (
        item.contestPromoter?.includes("경기도") ||
        item.contestAssociate?.includes("경기도")
      );
    }
    return true;
  });

  const totalCount = allContests.length;
  const gbbfCount = allContests.filter(
    (item) =>
      item.contestPromoter?.includes("경기도") ||
      item.contestAssociate?.includes("경기도")
  ).length;
  const yonginCount = allContests.filter(
    (item) =>
      item.contestPromoter?.includes("용인") ||
      item.contestTitle?.includes("용인")
  ).length;

  const tabs = [
    { id: "all", label: "전체 접수대회", count: totalCount },
    { id: "gbbf", label: "경기도보디빌딩협회", count: gbbfCount },
    { id: "yongin", label: "용인시보디빌딩협회", count: yonginCount },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 font-sans antialiased pb-32">
      <BottomMenu />

      <ConfirmationModal
        isOpen={messageOpen}
        onConfirm={redirectLogin}
        onCancel={messageClose}
        message={message}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10 flex flex-col gap-y-10">
        {/* NIKE HIGH-IMPACT HERO BANNER */}
        <div className="relative rounded-3xl overflow-hidden bg-[#141414] border border-neutral-800 p-8 md:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-y-3.5 max-w-xl">
              <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-3.5 py-1.5 rounded-full text-xs font-black tracking-widest text-neutral-200 uppercase w-fit">
                <RiShieldStarLine className="text-base text-white" />
                <span>NIKE ATHLETIC SUITE / OFFICIAL ENTRY</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none break-keep">
                THE ARENA OF <br />
                <span className="text-white">CHAMPIONS</span>
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed break-keep">
                보디빌딩 & 피트니스 공식 협회 주관 대회 통합 접수 센터입니다. 한계를 뛰어넘는 당신의 무대를 완성하세요.
              </p>
            </div>

            {pInfo?.playerUid ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3.5 flex items-center gap-4 shadow-xl w-full sm:w-auto">
                <div className="w-11 h-11 rounded-full bg-white text-black font-black text-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <RiTrophyLine />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">
                    ATHLETE VERIFIED
                  </span>
                  <span className="text-sm font-black text-white">
                    {pInfo.pName || "선수 회원"} 님
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full sm:w-auto px-9 py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm tracking-wider uppercase rounded-full shadow-2xl transition duration-200 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <span>선수 참가 등록</span>
                <MdArrowForward className="text-lg" />
              </button>
            )}
          </div>
        </div>

        {/* NIKE MINIMAL UNDERLINE TABS */}
        <div className="w-full border-b border-neutral-800">
          <div className="flex items-center justify-start sm:justify-center gap-x-2 sm:gap-x-8 overflow-x-auto no-scrollbar pb-px">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-3 sm:px-4 flex items-center gap-x-2 text-xs sm:text-sm tracking-tight transition duration-150 cursor-pointer whitespace-nowrap group ${
                    isActive
                      ? "text-white font-black"
                      : "text-neutral-500 hover:text-neutral-300 font-bold"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-black tracking-normal transition duration-150 ${
                      isActive
                        ? "bg-white text-black"
                        : "bg-neutral-900 text-neutral-500 border border-neutral-800 group-hover:text-neutral-300"
                    }`}
                  >
                    {tab.count}
                  </span>

                  {isActive && (
                    <div className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC CONTEST CARDS */}
        <div className="flex flex-col gap-y-8">
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
          ) : displayedContests.length === 0 ? (
            <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-16 text-center text-neutral-500 font-bold text-sm shadow-xl">
              현재 접수 중인 대회가 없습니다.
            </div>
          ) : (
            displayedContests.map((item) => {
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
                />
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
