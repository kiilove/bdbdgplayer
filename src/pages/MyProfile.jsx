import React, { useContext, useState, useEffect } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import {
  RiTrophyLine,
  RiCalendarLine,
  RiPrinterLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { handleToast } from "../components/HandleToast";
import InvoicePrintModal from "../modals/InvoicePrintModal";
import { DEFAULT_AVATAR } from "../consts";
import { UserContext } from "../context/UserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { fetchUserInvoices } from "../services/contestService";
import { uploadPlayerAvatar } from "../services/playerService";
import { calculateAge } from "../utils/formatUtils";

const MyProfile = () => {
  const {
    currentUserInfo: pInfo,
    setCurrentUserInfo,
    clearUserSession,
  } = useContext(UserContext);
  const { handleSignOut } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [userInvoices, setUserInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState(null);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch {
      // ignore signOut errors
    }
    clearUserSession();
    handleToast("info", "로그아웃 되었습니다.");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    let isMounted = true;
    const uid = pInfo?.playerUid || pInfo?.pUid;

    if (!uid) {
      setInvoicesLoading(false);
      return undefined;
    }

    setInvoicesLoading(true);
    fetchUserInvoices(uid)
      .then((data) => {
        if (isMounted && data) {
          setUserInvoices(data);
        }
      })
      .catch(() => {
        // Non-blocking invoice list error
      })
      .finally(() => {
        if (isMounted) {
          setInvoicesLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [pInfo?.playerUid, pInfo?.pUid]);

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsLoading(true);
    try {
      const updatedProfile = await uploadPlayerAvatar(pInfo, files[0]);
      setCurrentUserInfo(updatedProfile);
      handleToast("success", "프로필 사진이 변경되었습니다.");
    } catch {
      handleToast("error", "프로필 사진 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayAge =
    pInfo?.playerAge || (pInfo?.pBirth ? calculateAge(pInfo.pBirth) : null);

  return (
    <div className="min-h-screen bg-[#F6F8FB] text-[#191F28] w-full pb-32 font-sans antialiased">
      <BottomMenu />
      <Header
        title="마이페이지"
        rightElement={
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-x-1.5 text-slate-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/60 transition text-xs sm:text-sm font-bold cursor-pointer px-3 py-1.5 rounded-lg border border-slate-200 bg-white active:scale-95"
          >
            <RiLogoutBoxRLine className="text-base" />
            <span>로그아웃</span>
          </button>
        }
      />
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#2563EB"
            strokeWidth="4"
            animationDuration="0.75"
            width="52"
            visible={true}
          />
        </div>
      )}

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-7 md:py-10 flex flex-col gap-y-8">
        {/* Profile Card */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(15,23,42,0.04)] flex flex-col gap-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6">
            <label
              htmlFor="playerPic"
              className="relative cursor-pointer group shrink-0"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 bg-slate-50">
                <img
                  src={pInfo.pPic || DEFAULT_AVATAR}
                  alt={pInfo.pName || "프로필"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2563EB] text-white shadow-sm flex items-center justify-center border-2 border-white">
                <BsFillCameraFill className="text-xs" />
              </div>
              <input
                name="playerPic"
                id="playerPic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider border-l-2 border-indigo-600 pl-2">
                ATHLETE PROFILE · 선수 기본 프로필
              </span>
              <h2 className="text-2xl font-extrabold text-[#0F172A] mt-1.5 tracking-tight">
                {pInfo.pName || "선수 회원"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">{pInfo.pEmail}</p>
            </div>
          </div>

          {/* Profile Information List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  이름 (실명 · 변경 불가)
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  {pInfo.pName || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-500">
                  이메일 계정 (변경 불가)
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1 truncate">
                  {pInfo.pEmail || "-"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pTel" } })
              }
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  휴대폰 번호
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  {pInfo.pTel || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-[#2563EB] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pBirth" } })
              }
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  생년월일 및 만 나이
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  {pInfo.pBirth || "등록 필요"}{" "}
                  {displayAge ? `(만 ${displayAge}세)` : ""}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-[#2563EB] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGender" } })
              }
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  성별
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  {pInfo.pGender
                    ? pInfo.pGender === "m"
                      ? "남자"
                      : "여자"
                    : "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-[#2563EB] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGym" } })
              }
              className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  소속 체육관 / 팀
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  {pInfo.pGym || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 group-hover:text-[#2563EB] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "password" } })
              }
              className="sm:col-span-2 flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-500">
                  계정 보안 · 비밀번호
                </span>
                <span className="text-[15px] font-bold text-[#191F28] mt-1">
                  비밀번호 변경하기
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition flex items-center gap-1">
                <span>비밀번호 변경</span>
                <IoChevronForward />
              </span>
            </button>
          </div>
        </section>

        {/* 나의 대회 참가 신청 내역 섹션 */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(15,23,42,0.04)] flex flex-col gap-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#0F172A] flex items-center gap-x-2 tracking-tight">
              <RiTrophyLine className="text-amber-500 text-xl" />
              나의 대회 참가 신청 내역
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-md">
              총 {userInvoices.length}건
            </span>
          </div>

          {invoicesLoading ? (
            <div className="flex justify-center items-center py-12">
              <RotatingLines
                strokeColor="#4F46E5"
                strokeWidth="4"
                width="36"
                visible={true}
              />
            </div>
          ) : userInvoices.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {userInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-5 flex flex-col gap-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-xs font-bold text-slate-500">
                        {inv.contestAssociate ||
                          inv.contestPromoter ||
                          "공식 참가신청서"}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#0F172A] tracking-tight break-keep">
                        {inv.contestTitle}
                      </h4>
                      <span className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-x-1.5 mt-0.5">
                        <RiCalendarLine className="text-indigo-600" />{" "}
                        {inv.contestDate}{" "}
                        {inv.contestLocation ? `· ${inv.contestLocation}` : ""}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-[5px] border whitespace-nowrap shrink-0 ${
                        inv.isCanceled
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : inv.isPriceCheck
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-white text-slate-700 border-slate-200"
                      }`}
                    >
                      {inv.isCanceled
                        ? "접수 취소됨"
                        : inv.isPriceCheck
                        ? "입금확인 완료"
                        : "입금 대기중"}
                    </span>
                  </div>

                  {/* 신청한 종목 칩 리스트 */}
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-200/80">
                    {inv.joins?.map((j, jIdx) => (
                      <span
                        key={jIdx}
                        className="text-xs sm:text-sm font-semibold text-[#0F172A] bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-x-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        {j.contestCategoryTitle} ({j.contestGradeTitle})
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/80">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-500">
                        총 참가비
                      </span>
                      <span className="text-lg font-extrabold text-indigo-600">
                        {Number(inv.contestPriceSum || 0).toLocaleString()} 원
                      </span>
                    </div>

                    {!inv.isCanceled && (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedPrintInvoice(inv)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-100 text-[#0F172A] border border-slate-300 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RiPrinterLine className="text-base" />
                          <span>접수증 출력 / PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/contestjoinedit/${inv.id}`)
                          }
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-xs sm:text-sm rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.24)] transition cursor-pointer text-center"
                        >
                          신청내역 수정
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 text-sm font-medium gap-y-4">
              <span>아직 신청된 대회 내역이 없습니다.</span>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm rounded-xl shadow-[0_4px_12px_rgba(99,102,241,0.24)] transition cursor-pointer"
              >
                대회 참가 신청하러 가기
              </button>
            </div>
          )}
        </section>
      </main>
      {selectedPrintInvoice && (
        <InvoicePrintModal
          invoiceInfo={selectedPrintInvoice}
          onClose={() => setSelectedPrintInvoice(null)}
        />
      )}
    </div>
  );
};

export default MyProfile;
