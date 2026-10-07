import React, { useContext, useState, useEffect, useCallback, useMemo } from "react";
import BottomMenu from "../components/BottomMenu";
import { AuthContext } from "../context/AuthContext";
import { BsFillCameraFill } from "react-icons/bs";
import { DEFAULT_AVATAR } from "../consts";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc, where } from "firebase/firestore";
import { PlayerEditContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { RotatingLines } from "react-loader-spinner";
import { UserContext } from "../context/UserContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { RiTrophyLine, RiCalendarLine } from "react-icons/ri";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const MyProfile = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } = useContext(UserContext);
  const { userInfo } = useContext(AuthContext);
  const { editDispatch } = useContext(PlayerEditContext);
  const [playerInfo, setPlayerInfo] = useState({ ...pInfo });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadURLs, setDownloadURLs] = useState([{ link: "", filename: "" }]);
  
  // 나의 참가 신청 내역 State 및 Query
  const fetchInvoicesQuery = useFirestoreQuery();
  const [userInvoices, setUserInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

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
        const data = await fetchInvoicesQuery.getDocuments("invoices_pool", condition);
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
  }, [pInfo]);

  const uploadFiles = async (files, path) => {
    let dummy = [];
    setIsLoading(true);

    const promises = await files.map((file) => {
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `${path}/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // upload progress
        },
        (error) => {
          console.error(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              dummy.push({ link: downloadURL, filename });
              return dummy;
            })
            .then((dummy) => {
              setDownloadURLs(() => [...dummy]);
            });
        }
      );

      return uploadTask;
    });

    Promise.all(promises);
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const path = `images/player/${pInfo.pUid}`;
    setFiles(Array.prototype.slice.call(e.target.files));
    await uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updatePlayer = useCallback(
    async (data) => {
      await setDoc(
        doc(db, "players_pool", pInfo.id),
        { ...data },
        { merge: true }
      ).then(() => setIsLoading(false));
    },
    [pInfo.id]
  );

  useMemo(() => {
    if (downloadURLs[0].link !== "") {
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
    }
  }, [downloadURLs]);

  useMemo(() => {
    if (playerInfo.pPic !== "") {
      updatePlayer(playerInfo);
      setCurrentUserInfo({ ...pInfo, ...playerInfo });
    }
  }, [playerInfo.pPic]);

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
          {/* Avatar Profile Section */}
          <div className="flex flex-col items-center justify-center border-b border-neutral-800 pb-6">
            <label htmlFor="playerPic" className="relative cursor-pointer group">
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
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
            <h2 className="text-2xl font-black text-white mt-3.5 tracking-tight">{pInfo.pName || "선수 회원"}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{pInfo.pEmail}</p>
          </div>

          {/* Profile Information List */}
          <div className="flex flex-col gap-y-2.5">
            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">실명 (변경 불가)</span>
                <span className="text-sm font-bold text-white mt-0.5">{pInfo.pName || "-"}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-2xl">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">이메일 계정 (변경 불가)</span>
                <span className="text-sm font-bold text-white mt-0.5">{pInfo.pEmail || "-"}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("/editprofile", { state: { editType: "pTel" } })}
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">전화번호</span>
                <span className="text-sm font-bold text-white mt-0.5">{pInfo.pTel || "등록 필요"}</span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">수정 &gt;</span>
            </button>

            <button
              onClick={() => navigate("/editprofile", { state: { editType: "pBirth" } })}
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">생년월일 및 나이</span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pBirth || "등록 필요"} ({pInfo.playerAge ? `만 ${pInfo.playerAge}세` : "-"})
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">수정 &gt;</span>
            </button>

            <button
              onClick={() => navigate("/editprofile", { state: { editType: "pGender" } })}
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">성별</span>
                <span className="text-sm font-bold text-white mt-0.5">
                  {pInfo.pGender ? (pInfo.pGender === "m" ? "남자" : "여자") : "등록 필요"}
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">수정 &gt;</span>
            </button>

            <button
              onClick={() => navigate("/editprofile", { state: { editType: "pGym" } })}
              className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl transition cursor-pointer text-left group active:scale-98"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-400">소속 체육관 / 팀</span>
                <span className="text-sm font-bold text-white mt-0.5">{pInfo.pGym || "등록 필요"}</span>
              </div>
              <span className="text-xs font-bold text-neutral-400 group-hover:text-white">수정 &gt;</span>
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
              <RotatingLines strokeColor="#ffffff" strokeWidth="4" width="36" visible={true} />
            </div>
          ) : userInvoices.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {userInvoices.map((inv) => (
                <div key={inv.id} className="bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-2xl p-5 flex flex-col gap-y-3.5 transition shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-y-1">
                      <span className="text-[11px] font-black text-neutral-400 uppercase tracking-widest">
                        {inv.contestPromoter || "공식 참가신청서"}
                      </span>
                      <h4 className="text-base font-black text-white tracking-tight">{inv.contestTitle}</h4>
                      <span className="text-xs text-neutral-400 font-medium flex items-center gap-x-1.5 mt-0.5">
                        <RiCalendarLine className="text-white" /> {inv.contestDate} {inv.contestLocation ? `| ${inv.contestLocation}` : ""}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border whitespace-nowrap ${
                      inv.isPriceCheck 
                        ? "bg-white text-black border-white font-black" 
                        : "bg-neutral-800 text-neutral-300 border-neutral-700"
                    }`}>
                      {inv.isPriceCheck ? "입금확인 완료" : "입금 대기중"}
                    </span>
                  </div>

                  {/* 신청한 종목 칩 리스트 */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-800">
                    {inv.joins?.map((j, jIdx) => (
                      <span key={jIdx} className="text-xs font-bold text-neutral-200 bg-black px-3 py-1.5 rounded-full border border-neutral-800 shadow-xs flex items-center gap-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                        {j.contestCategoryTitle} ({j.contestGradeTitle})
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-800 mt-1">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-semibold text-neutral-400">총 참가비</span>
                      <span className="text-base font-black text-white">
                        {inv.contestPriceSum?.toLocaleString()} 원
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/contestjoinedit/${inv.id}`)}
                      className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full transition shadow-md cursor-pointer active:scale-95"
                    >
                      신청내역 수정 &gt;
                    </button>
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
    </div>
  );
};

export default MyProfile;
