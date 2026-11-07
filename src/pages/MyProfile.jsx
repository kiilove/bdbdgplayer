import React, { useContext, useState, useEffect } from "react";
import { BsFillCameraFill } from "react-icons/bs";
import { RiTrophyLine, RiCalendarLine, RiPrinterLine } from "react-icons/ri";
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
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 w-full pb-32 font-sans antialiased">
      <BottomMenu />
      <Header title="내 프로필 및 참가 내역" />
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-y-8">
        {/* Profile Card */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-y-6">
          <div className="flex flex-col items-center justify-center border-b border-neutral-800 pb-6">
            <label
              htmlFor="playerPic"
              className="relative cursor-pointer group"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-black">
                <img
                  src={pInfo.pPic || DEFAULT_AVATAR}
                  alt={pInfo.pName || "프로필"}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black shadow-md flex items-center justify-center border-2 border-black">
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
            <h2 className="text-2xl font-black text-white mt-3.5 tracking-tight">
              {pInfo.pName || "선수 회원"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">{pInfo.pEmail}</p>
          </div>

          {/* Profile Information List */}
          <div className="flex flex-col gap-y-2.5">
            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  실명 (변경 불가)
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pName || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  이메일 계정 (변경 불가)
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pEmail || "-"}
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pTel" } })
              }
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  전화번호
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pTel || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">
                수정 &gt;
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pBirth" } })
              }
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  생년월일 및 나이
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pBirth || "등록 필요"} (
                  {displayAge ? `만 ${displayAge}세` : "-"})
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">
                수정 &gt;
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGender" } })
              }
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  성별
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pGender
                    ? pInfo.pGender === "m"
                      ? "남자"
                      : "여자"
                    : "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">
                수정 &gt;
              </span>
            </button>

            <button
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGym" } })
              }
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">
                  소속 체육관 / 팀
                </span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pGym || "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">
                수정 &gt;
              </span>
            </button>
          </div>
        </div>

        {/* 나의 대회 참가 신청 내역 섹션 */}
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <h3 className="text-lg font-black text-white flex items-center gap-x-2 tracking-tight">
              <RiTrophyLine className="text-white text-xl" />
              나의 대회 참가 신청 내역
            </h3>
            <span className="text-xs font-black text-black bg-white px-3 py-1 rounded-full shadow-xs">
              총 {userInvoices.length}건
            </span>
          </div>

          {invoicesLoading ? (
            <div className="flex justify-center items-center py-10">
              <RotatingLines
                strokeColor="#ffffff"
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
                  className="bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl p-5 flex flex-col gap-y-3.5 transition shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                        {inv.contestAssociate ||
                          inv.contestPromoter ||
                          "공식 참가신청서"}
                      </span>
                      <h4 className="text-base font-black text-white tracking-tight">
                        {inv.contestTitle}
                      </h4>
                      <span className="text-xs text-neutral-400 font-medium flex items-center gap-x-1.5 mt-0.5">
                        <RiCalendarLine className="text-white" />{" "}
                        {inv.contestDate}{" "}
                        {inv.contestLocation ? `| ${inv.contestLocation}` : ""}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${
                        inv.isCanceled
                          ? "bg-rose-950/50 text-rose-400 border-rose-800"
                          : inv.isPriceCheck
                          ? "bg-white text-black border-white font-black"
                          : "bg-neutral-800 text-neutral-300 border-neutral-700"
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
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
                    {inv.joins?.map((j, jIdx) => (
                      <span
                        key={jIdx}
                        className="text-xs font-bold text-neutral-200 bg-black px-3 py-1.5 rounded-full border border-neutral-800 shadow-xs flex items-center gap-x-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {j.contestCategoryTitle} ({j.contestGradeTitle})
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-neutral-400">
                        총 참가비
                      </span>
                      <span className="text-base font-black text-white">
                        {inv.contestPriceSum?.toLocaleString()} 원
                      </span>
                    </div>

                    {!inv.isCanceled && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedPrintInvoice(inv)}
                          className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 font-bold text-xs rounded-full transition shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
                        >
                          <RiPrinterLine className="text-sm" />
                          <span>접수증 출력 / PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/contestjoinedit/${inv.id}`)
                          }
                          className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full transition shadow-md cursor-pointer active:scale-95"
                        >
                          신청내역 수정 &gt;
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-neutral-500 text-xs font-medium gap-y-3">
              <span>아직 신청된 대회 내역이 없습니다.</span>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full shadow-lg transition cursor-pointer mt-1 active:scale-95"
              >
                대회 참가 신청하러 가기
              </button>
            </div>
          )}
        </div>
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
