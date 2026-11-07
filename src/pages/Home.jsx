import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { where } from "firebase/firestore";
import dayjs from "dayjs";
import { RotatingLines } from "react-loader-spinner";
import { 
  MdOutlineCalendarToday, 
  MdOutlineLocationOn, 
  MdCreditCard, 
  MdFileDownload,
  MdArrowForward,
  MdStar
} from "react-icons/md";
import { RiTrophyLine, RiShieldStarLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import { UserContext } from "../context/UserContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import ConfirmationModal from "../messageBox/ConfirmationModal";

const Home = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'gbbf', 'yongin'
  const [allContests, setAllContests] = useState([]);
  const [invoices, setInvoices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const navigate = useNavigate();
  const getQuery = useFirestoreQuery();

  const redirectLogin = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const messageClose = () => {
    setMessageOpen(false);
  };

  // DB에서 접수 중인 전체 대회 동적 수신
  const fetchContestsData = async () => {
    setIsLoading(true);
    const conditions = [where("contestStatus", "==", "접수중")];
    try {
      const data = await getQuery.getDocuments(
        "contest_notice",
        conditions,
        "contestDate"
      );
      if (data && data.length > 0) {
        setAllContests(data);
      } else {
        setAllContests([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInvoices = async () => {
    if (!pInfo?.playerUid) return;
    const conditions = [where("playerUid", "==", pInfo.playerUid)];
    try {
      const data = await getQuery.getDocuments("invoices_pool", conditions);
      if (data && data.length > 0) {
        const invMap = {};
        data.forEach((inv) => {
          if (!inv.isCanceled) {
            if (inv.contestId) {
              invMap[inv.contestId] = inv.id;
            }
          }
        });
        setInvoices(invMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContestsData();
  }, []);

  useEffect(() => {
    if (pInfo?.playerUid) {
      fetchInvoices();
    }
  }, [pInfo?.playerUid]);

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
    return true; // 'all'인 경우 전체 동적 노출
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
        {/* ========================================================================= */}
        {/* NIKE HIGH-IMPACT HERO BANNER */}
        {/* ========================================================================= */}
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

            {/* Quick Profile Chip / Login CTA */}
            {pInfo?.playerUid ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-full px-5 py-3.5 flex items-center gap-4 shadow-xl w-full sm:w-auto">
                <div className="w-11 h-11 rounded-full bg-white text-black font-black text-xl flex items-center justify-center shadow-md flex-shrink-0">
                  <RiTrophyLine />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">ATHLETE VERIFIED</span>
                  <span className="text-sm font-black text-white">{pInfo.pName || "선수 회원"} 님</span>
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

        {/* ========================================================================= */}
        {/* NIKE MINIMAL UNDERLINE TABS */}
        {/* ========================================================================= */}
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

                  {/* Nike Crisp Underline Indicator */}
                  {isActive && (
                    <div className="absolute -bottom-px left-0 right-0 h-[2.5px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DYNAMIC CONTEST CARDS (NIKE ATHLETIC STYLE) */}
        {/* ========================================================================= */}
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
              const defaultPoster =
                "https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fblank%2Fdefault_poster.jpg?alt=media&token=9501d1f2-3e92-45f3-9d54-8d8746ba288d";
              const posterUrl = item.contestPoster || defaultPoster;
              const contestId = item.id;
              const userInvoiceId =
                invoices[contestId] || (item.refContestId ? invoices[item.refContestId] : null);

              return (
                <div
                  key={contestId}
                  className="bg-[#141414] border border-neutral-800 hover:border-neutral-600 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
                >
                  {/* Poster Left (Full view, never cut off) */}
                  <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[500px] bg-neutral-950 border border-neutral-800 shadow-md flex items-center justify-center">
                    <img
                      src={posterUrl}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
                    />
                    <img
                      src={posterUrl}
                      alt={item.contestTitle}
                      className="relative z-10 w-full h-full object-contain group-hover:scale-[1.02] transition duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-neutral-700 text-white text-[11px] font-black tracking-wider px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-md z-20">
                      <MdStar className="text-white text-sm" />
                      <span>{item.contestStatus || "OFFICIAL ENTRY"}</span>
                    </div>
                  </div>

                  {/* Details Right */}
                  <div className="lg:col-span-7 flex flex-col gap-y-6">
                    <div>
                      <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block">
                        {item.contestAssociate || item.contestPromoter || "주관 협회"}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3 leading-snug break-keep">
                        {item.contestTitle}
                      </h2>
                    </div>

                    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-y-3.5 text-sm">
                      <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                        <span className="text-neutral-400 font-medium flex items-center gap-2">
                          <MdOutlineCalendarToday className="text-white text-base" />
                          대회 일자
                        </span>
                        <span className="font-bold text-white tracking-wide">
                          {dayjs(item.contestDate).format("YYYY년 MM월 DD일")}
                        </span>
                      </div>

                      {item.contestLocation && (
                        <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
                          <span className="text-neutral-400 font-medium flex items-center gap-2">
                            <MdOutlineLocationOn className="text-white text-base" />
                            개최 장소
                          </span>
                          <span className="font-bold text-white break-keep text-right">{item.contestLocation}</span>
                        </div>
                      )}

                      {item.contestAccountOwner && item.contestAccountNumber && (
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium flex items-center gap-2">
                            <MdCreditCard className="text-white text-base" />
                            참가비 계좌
                          </span>
                          <span className="font-bold text-neutral-200 text-right text-xs sm:text-sm">
                            {item.contestBankName || ""} {item.contestAccountNumber} ({item.contestAccountOwner})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      {userInvoiceId ? (
                        <button
                          onClick={() => navigate(`/contestjoinedit/${userInvoiceId}`)}
                          className="flex-1 py-4 px-6 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-black text-sm tracking-wider uppercase rounded-full transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-98"
                        >
                          <span>신청정보 확인 및 변경</span>
                          <MdArrowForward className="text-base" />
                        </button>
                      ) : pInfo?.playerUid ? (
                        <button
                          onClick={() => navigate(`/contestjoin/${contestId}`)}
                          className="flex-1 py-4 px-6 bg-white hover:bg-neutral-200 text-black font-black text-sm tracking-wider uppercase rounded-full shadow-lg transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-98"
                        >
                          <span>참가신청 하기</span>
                          <MdArrowForward className="text-lg" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setMessage({
                              body: "대회 참가신청을 하려면 로그인이 필요합니다.",
                              body2: "로그인 페이지로 이동하시겠습니까?",
                              isButton: true,
                              confirmButtonText: "이동",
                              cancelButtonText: "취소",
                            });
                            setMessageOpen(true);
                          }}
                          className="flex-1 py-4 px-6 bg-white hover:bg-neutral-200 text-black font-black text-sm tracking-wider uppercase rounded-full shadow-lg transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-98"
                        >
                          <span>참가신청 하기</span>
                          <MdArrowForward className="text-lg" />
                        </button>
                      )}

                      {item.contestCollectionFileLink && (
                        <a
                          href={item.contestCollectionFileLink}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-4 px-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs sm:text-sm rounded-full transition text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <MdFileDownload className="text-base text-white" />
                          <span>공식 요강 다운로드</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
