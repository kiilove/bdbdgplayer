import React, { useContext, useState, useEffect } from "react";
import { where } from "firebase/firestore";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { useFirestoreQuery } from "../hooks/useFirestores";
import dayjs from "dayjs";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { UserContext } from "../context/UserContext";
import { 
  MdOutlineCalendarToday, 
  MdOutlineLocationOn, 
  MdCreditCard, 
  MdFileDownload,
  MdArrowForward,
  MdStar
} from "react-icons/md";
import { RiShieldStarLine } from "react-icons/ri";

const CupList = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState({});
  const [noticeList, setNoticeList] = useState([]);
  const [error, setError] = useState(false);
  const getQuery = useFirestoreQuery();

  const navigate = useNavigate();

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
        setNoticeList(data);
      } else {
        setNoticeList([]);
      }
    } catch (error) {
      setError(error);
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
          if (!inv.isCanceled && inv.contestId) {
            invMap[inv.contestId] = inv.id;
          }
        });
        setInvoices(invMap);
      }
    } catch (error) {
      // error handled
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  useEffect(() => {
    if (pInfo?.playerUid) {
      fetchInvoices();
    }
  }, [pInfo?.playerUid, noticeList]);

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
            {/* Nike Header Banner */}
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

            {/* Competitions Grid */}
            {noticeList?.length === 0 ? (
              <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-16 text-center text-neutral-500 font-bold text-sm shadow-xl">
                현재 접수 중인 대회가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {noticeList.map((item) => {
                  let titleLink =
                    "https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fblank%2Fdefault_poster.jpg?alt=media&token=9501d1f2-3e92-45f3-9d54-8d8746ba288d";
                  if (item.contestPoster) {
                    titleLink = item.contestPoster;
                  }
                  const contestId = item.id;
                  const userInvoiceId =
                    invoices[contestId] || (item.refContestId ? invoices[item.refContestId] : null);

                  return (
                    <div
                      key={item.id}
                      className="bg-[#141414] border border-neutral-800 hover:border-neutral-600 rounded-3xl overflow-hidden shadow-2xl transition flex flex-col justify-between group"
                    >
                      {/* Poster Section (Full aspect ratio, never cut off) */}
                      <div className="w-full bg-[#0a0a0a] overflow-hidden relative border-b border-neutral-800 flex items-center justify-center">
                        <img
                          src={titleLink}
                          alt={item.contestTitle}
                          className="w-full h-auto block object-contain group-hover:scale-[1.01] transition duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-neutral-700 text-white text-[11px] font-black tracking-wider px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-md z-10">
                          <MdStar className="text-white text-sm" />
                          <span>{item.contestStatus || "접수중"}</span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex flex-col gap-y-5 flex-grow justify-between">
                        <div className="flex flex-col gap-y-2.5">
                          <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block w-fit">
                            {item.contestAssociate || item.contestPromoter || "보디빌딩협회"}
                          </span>
                          <h3 className="text-xl font-black text-white leading-snug line-clamp-2 break-keep">
                            {item.contestTitle}
                          </h3>
                          <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-y-2 mt-2 text-xs text-neutral-300">
                            <p className="flex items-center gap-2">
                              <MdOutlineCalendarToday className="text-white text-sm flex-shrink-0" />
                              <strong className="font-semibold text-white">대회 일자:</strong>{" "}
                              {dayjs(item.contestDate).format("YYYY년 MM월 DD일")}
                            </p>
                            {item.contestLocation && (
                              <p className="flex items-center gap-2">
                                <MdOutlineLocationOn className="text-white text-sm flex-shrink-0" />
                                <strong className="font-semibold text-white">개최 장소:</strong>{" "}
                                <span className="break-keep">{item.contestLocation}</span>
                              </p>
                            )}
                            {item.contestAccountOwner && item.contestAccountNumber && (
                              <p className="flex items-center gap-2">
                                <MdCreditCard className="text-white text-sm flex-shrink-0" />
                                <strong className="font-semibold text-white">참가비 계좌:</strong>{" "}
                                <span className="text-neutral-200">
                                  {item.contestBankName || ""} {item.contestAccountNumber} ({item.contestAccountOwner})
                                </span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                          {userInvoiceId ? (
                            <button
                              className="flex-1 w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-black text-xs py-3.5 px-4 rounded-full transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
                              onClick={() =>
                                navigate(`/contestjoinedit/${userInvoiceId}`)
                              }
                            >
                              <span>신청정보 확인 및 변경</span>
                              <MdArrowForward className="text-base" />
                            </button>
                          ) : pInfo?.playerUid ? (
                            <button
                              className="flex-1 w-full bg-white hover:bg-neutral-200 text-black font-black text-xs py-3.5 px-4 rounded-full shadow-lg transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
                              onClick={() => {
                                navigate(`/contestjoin/${item.id}`);
                              }}
                            >
                              <span>참가신청 하기</span>
                              <MdArrowForward className="text-base" />
                            </button>
                          ) : (
                            <button
                              className="flex-1 w-full bg-white hover:bg-neutral-200 text-black font-black text-xs py-3.5 px-4 rounded-full shadow-lg transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98"
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
                            >
                              <span>참가신청 하기</span>
                              <MdArrowForward className="text-base" />
                            </button>
                          )}

                          {item.contestCollectionFileLink && (
                            <a
                              href={item.contestCollectionFileLink}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs py-3.5 px-4 rounded-full border border-neutral-700 transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-98"
                            >
                              <MdFileDownload className="text-base text-white" />
                              <span>요강 다운로드</span>
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
        </>
      )}
    </div>
  );
};

export default CupList;
