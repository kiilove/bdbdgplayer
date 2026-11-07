import React, { useContext, useState, useEffect } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { RiTrophyLine, RiCalendarLine, RiPrinterLine } from "react-icons/ri";
import { IoChevronForward } from "react-icons/io5";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import InvoicePrintModal from "../modals/InvoicePrintModal";
import { DEFAULT_AVATAR } from "../consts";
import { db, storage } from "../firebase";
import { UserContext } from "../context/UserContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { calculateAge } from "../utils/formatUtils";

const makeFileName = (filename, salt) => {
  const currentTime = Date.now();
  const ext = filename.includes(".") ? filename.split(".").pop() : "jpg";
  return `${String(salt).toUpperCase()}${currentTime}.${ext}`;
};

const MyProfile = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInvoicesQuery = useFirestoreQuery();
  const [userInvoices, setUserInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [selectedPrintInvoice, setSelectedPrintInvoice] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInvoices = async () => {
      const uid = pInfo?.playerUid || pInfo?.pUid;
      if (!uid) {
        setInvoicesLoading(false);
        return;
      }
      setInvoicesLoading(true);
      try {
        const condition = [where("playerUid", "==", uid)];
        const data = await fetchInvoicesQuery.getDocuments(
          "invoices_pool",
          condition
        );
        if (data) {
          setUserInvoices(data);
        }
      } catch (err) {
        console.error("Fetch invoices error:", err);
      } finally {
        setInvoicesLoading(false);
      }
    };
    fetchUserInvoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pInfo?.playerUid, pInfo?.pUid]);

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const files = Array.from(e.target.files || []);
    const uid = pInfo?.playerUid || pInfo?.pUid || pInfo?.id;
    if (files.length === 0 || !uid || !pInfo?.id) return;

    setIsLoading(true);
    try {
      const file = files[0];
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `images/player/${uid}/${filename}`);
      const uploadTask = await uploadBytesResumable(storageRef, file);
      const downloadURL = await getDownloadURL(uploadTask.ref);

      const updatedProfile = { ...pInfo, pPic: downloadURL };
      await setDoc(doc(db, "players_pool", pInfo.id), updatedProfile, {
        merge: true,
      });
      setCurrentUserInfo(updatedProfile);
    } catch (err) {
      console.error("Profile image upload error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayAge =
    pInfo?.playerAge || (pInfo?.pBirth ? calculateAge(pInfo.pBirth) : null);

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] w-full pb-32 font-sans antialiased">
      <BottomMenu />
      <Header title="내 정보 및 참가신청 내역" />
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-7 md:py-10 flex flex-col gap-y-8">
        {/* Profile Card */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-neutral-100 pb-6">
            <label
              htmlFor="playerPic"
              className="relative cursor-pointer group shrink-0"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-neutral-200 bg-[#F5F5F7]">
                <img
                  src={pInfo.pPic || DEFAULT_AVATAR}
                  alt={pInfo.pName || "프로필"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#111111] text-white shadow-sm flex items-center justify-center border-2 border-white">
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
              <span className="text-xs font-bold text-neutral-500 bg-[#F5F5F7] px-3 py-1 rounded-full">
                선수 기본 프로필
              </span>
              <h2 className="text-2xl font-extrabold text-[#111111] mt-2 tracking-tight">
                {pInfo.pName || "선수 회원"}
              </h2>
              <p className="text-sm text-neutral-500 mt-0.5">{pInfo.pEmail}</p>
            </div>
          </div>

          {/* Profile Information List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-500">
                  이름 (실명 · 변경 불가)
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1">
                  {pInfo.pName || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F5F5F7] rounded-2xl">
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-neutral-500">
                  이메일 계정 (변경 불가)
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1 truncate">
                  {pInfo.pEmail || "-"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pTel" } })
              }
              className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-neutral-200/70 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-500">
                  휴대폰 번호
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1">
                  {pInfo.pTel || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500 group-hover:text-[#111111] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pBirth" } })
              }
              className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-neutral-200/70 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-500">
                  생년월일 및 만 나이
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1">
                  {pInfo.pBirth || "등록 필요"}{" "}
                  {displayAge ? `(만 ${displayAge}세)` : ""}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500 group-hover:text-[#111111] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGender" } })
              }
              className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-neutral-200/70 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-500">
                  성별
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1">
                  {pInfo.pGender
                    ? pInfo.pGender === "m"
                      ? "남자"
                      : "여자"
                    : "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500 group-hover:text-[#111111] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGym" } })
              }
              className="flex items-center justify-between p-4 bg-[#F5F5F7] hover:bg-neutral-200/70 rounded-2xl transition cursor-pointer text-left group"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-500">
                  소속 체육관 / 팀
                </span>
                <span className="text-[15px] font-bold text-[#111111] mt-1">
                  {pInfo.pGym || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-500 group-hover:text-[#111111] flex items-center gap-0.5">
                <span>수정</span>
                <IoChevronForward />
              </span>
            </button>
          </div>
        </section>

        {/* 나의 대회 참가 신청 내역 섹션 */}
        <section className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] flex items-center gap-x-2 tracking-tight">
              <RiTrophyLine className="text-[#111111] text-xl" />
              나의 대회 참가 신청 내역
            </h3>
            <span className="text-xs font-bold text-white bg-[#111111] px-3 py-1 rounded-full">
              총 {userInvoices.length}건
            </span>
          </div>

          {invoicesLoading ? (
            <div className="flex justify-center items-center py-12">
              <RotatingLines
                strokeColor="#111111"
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
                  className="bg-[#F5F5F7] border border-neutral-200/90 rounded-2xl p-5 flex flex-col gap-y-4 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-xs font-bold text-neutral-500">
                        {inv.contestAssociate ||
                          inv.contestPromoter ||
                          "공식 참가신청서"}
                      </span>
                      <h4 className="text-base sm:text-lg font-extrabold text-[#111111] tracking-tight break-keep">
                        {inv.contestTitle}
                      </h4>
                      <span className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-x-1.5 mt-0.5">
                        <RiCalendarLine className="text-[#111111]" />{" "}
                        {inv.contestDate}{" "}
                        {inv.contestLocation ? `· ${inv.contestLocation}` : ""}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0 ${
                        inv.isCanceled
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : inv.isPriceCheck
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-white text-neutral-700 border-neutral-300"
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
                  <div className="flex flex-wrap gap-2 pt-3 border-t border-neutral-200/80">
                    {inv.joins?.map((j, jIdx) => (
                      <span
                        key={jIdx}
                        className="text-xs sm:text-sm font-semibold text-[#111111] bg-white px-3.5 py-1.5 rounded-full border border-neutral-200 flex items-center gap-x-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                        {j.contestCategoryTitle} ({j.contestGradeTitle})
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200/80">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-neutral-500">
                        총 참가비
                      </span>
                      <span className="text-lg font-extrabold text-[#111111]">
                        {inv.contestPriceSum?.toLocaleString()} 원
                      </span>
                    </div>

                    {!inv.isCanceled && (
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedPrintInvoice(inv)}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#111111] border border-neutral-300 font-bold text-xs sm:text-sm rounded-full transition cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <RiPrinterLine className="text-base" />
                          <span>접수증 출력 / PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/contestjoinedit/${inv.id}`)
                          }
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-full transition cursor-pointer text-center"
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
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 text-sm font-medium gap-y-4">
              <span>아직 신청된 대회 내역이 없습니다.</span>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-full transition cursor-pointer"
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
