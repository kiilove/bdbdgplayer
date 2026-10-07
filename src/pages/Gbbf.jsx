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
import { RiShieldStarLine, RiTrophyLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import { UserContext } from "../context/UserContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import ConfirmationModal from "../messageBox/ConfirmationModal";

const Gbbf = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [noticeList, setNoticeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState({});
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

  const fetchNotice = async () => {
    setIsLoading(true);
    const conditions = [where("contestStatus", "==", "접수중")];
    try {
      const data = await getQuery.getDocuments(
        "contest_notice",
        conditions,
        "contestDate"
      );

      if (data && data.length > 0) {
        const gbbfContests = data.filter((item) =>
          item.contestPromoter?.includes("경기도보디빌딩협회")
        );
        setNoticeList(gbbfContests);
      } else {
        setNoticeList([]);
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
    fetchNotice();
  }, []);

  useEffect(() => {
    if (pInfo?.playerUid) {
      fetchInvoices();
    }
  }, [pInfo?.playerUid]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col pb-32 font-sans antialiased">
      <BottomMenu />
      
      {/* Top Sticky Header */}
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
        {/* Nike Header Banner */}
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

        {/* Notice Contest List */}
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
                      <span>GBBF OFFICIAL</span>
                    </div>
                  </div>

                  {/* Details Right */}
                  <div className="lg:col-span-7 flex flex-col gap-y-6">
                    <div>
                      <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block">
                        경기도보디빌딩협회 주관
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
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Gbbf;
