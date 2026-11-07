import React, { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { handleToast } from "../components/HandleToast";
import { UserContext } from "../context/UserContext";
import { savePlayerProfile } from "../services/playerService";
import {
  formatPhoneNumber,
  formatBirthDate,
  validatePhoneNumber,
  validateDate,
  calculateAge,
} from "../utils/formatUtils";

const EDIT_CONFIG = {
  pTel: {
    title: "전화번호 변경",
    label: "휴대폰 번호",
    placeholder: "010-0000-0000",
    hints: [
      "대시(-)는 숫자 입력 시 자동으로 추가됩니다.",
      "대회 안내 연락을 받을 실제 번호를 입력해주세요.",
    ],
  },
  pBirth: {
    title: "생년월일 변경",
    label: "생년월일 (YYYY-MM-DD)",
    placeholder: "YYYY-MM-DD (예: 1995-05-20)",
    hints: [
      "숫자 8자리(예: 19950520)를 입력하면 하이픈(-)이 자동 완성됩니다.",
      "입력된 생년월일을 기준으로 만 나이가 자동 계산됩니다.",
    ],
  },
  pGender: {
    title: "성별 변경",
    label: "선수 성별",
    placeholder: "",
    hints: ["본인의 출전 부문에 맞는 성별을 선택해주세요."],
  },
  pGym: {
    title: "소속클럽 변경",
    label: "소속 체육관 / 팀명",
    placeholder: "소속 체육관 또는 무소속",
    hints: [
      "소속이 없을 경우 '무소속'으로 입력해 주세요.",
      "최대 30자까지 입력 가능합니다.",
    ],
  },
};

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const editType = location.state?.editType;
  const config = editType ? EDIT_CONFIG[editType] : null;

  const [value, setValue] = useState(() => {
    if (!editType) return "";
    if (editType === "pGender") return pInfo?.pGender || "m";
    if (editType === "pTel") return formatPhoneNumber(pInfo?.pTel || "");
    if (editType === "pBirth") return formatBirthDate(pInfo?.pBirth || "");
    return pInfo?.[editType] || "";
  });

  if (!config) {
    return <Navigate to="/myprofile" replace />;
  }

  const handleChange = (e) => {
    const raw = e.target.value;
    if (editType === "pTel") {
      setValue(formatPhoneNumber(raw));
    } else if (editType === "pBirth") {
      setValue(formatBirthDate(raw));
    } else {
      setValue(raw);
    }
  };

  const isValid = () => {
    if (editType === "pTel") return validatePhoneNumber(value);
    if (editType === "pBirth") return validateDate(value);
    if (editType === "pGender") return value === "m" || value === "f";
    if (editType === "pGym") return Boolean(value && value.trim().length > 0);
    return false;
  };

  const handleSave = async () => {
    if (!isValid() || !pInfo?.id) return;
    setIsLoading(true);

    const updatedFields = { [editType]: value.trim() };
    if (editType === "pBirth") {
      updatedFields.playerAge = calculateAge(value.trim());
    }

    const nextUserInfo = {
      ...pInfo,
      ...updatedFields,
    };

    try {
      await savePlayerProfile(pInfo.id, nextUserInfo);
      setCurrentUserInfo(nextUserInfo);
      handleToast("success", "프로필 정보가 저장되었습니다.");
      navigate("/myprofile", { replace: true });
    } catch {
      handleToast("error", "저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const computedAge =
    editType === "pBirth" && validateDate(value) ? calculateAge(value) : null;

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] pb-28 font-sans antialiased">
      <BottomMenu />
      <Header title={config.title} />

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

      <main className="max-w-md mx-auto px-4 pt-8">
        <div className="flex w-full flex-col bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 gap-y-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <label className="text-sm font-bold text-[#111111]">
            {config.label}
          </label>

          {editType === "pGender" ? (
            <select
              className="w-full h-13 bg-[#F5F5F7] border border-neutral-200 focus:bg-white focus:border-[#111111] focus:outline-none px-4 py-3.5 rounded-xl text-[#111111] text-base font-medium cursor-pointer transition"
              value={value}
              onChange={handleChange}
            >
              <option value="m">남자</option>
              <option value="f">여자</option>
            </select>
          ) : (
            <input
              type="text"
              value={value}
              onChange={handleChange}
              maxLength={editType === "pGym" ? 30 : 13}
              inputMode={
                editType === "pTel" || editType === "pBirth"
                  ? "numeric"
                  : "text"
              }
              placeholder={config.placeholder}
              className="w-full h-13 bg-[#F5F5F7] border border-neutral-200 focus:bg-white focus:border-[#111111] focus:ring-1 focus:ring-[#111111] focus:outline-none px-4 py-3.5 rounded-xl text-[#111111] text-base font-medium placeholder-neutral-400 transition"
            />
          )}

          {computedAge !== null && computedAge > 0 && (
            <div className="flex justify-end items-center">
              <span className="text-xs font-bold text-[#111111] bg-[#F5F5F7] border border-neutral-200 px-3 py-1.5 rounded-full">
                계산된 나이: 만 {computedAge}세
              </span>
            </div>
          )}

          {config.hints.length > 0 && (
            <ul className="text-xs sm:text-sm text-neutral-500 space-y-1.5 bg-[#F5F5F7] p-4 rounded-2xl">
              {config.hints.map((hint, idx) => (
                <li key={idx}>• {hint}</li>
              ))}
            </ul>
          )}

          <div className="flex w-full gap-x-2.5 pt-2">
            <button
              type="button"
              onClick={() => navigate("/myprofile")}
              className="flex-1 py-3.5 rounded-full font-bold text-sm bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] transition cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              disabled={!isValid() || isLoading}
              onClick={handleSave}
              className={`flex-1 py-3.5 rounded-full font-bold text-sm transition ${
                isValid()
                  ? "bg-[#111111] hover:bg-neutral-800 text-white cursor-pointer shadow-sm"
                  : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
              }`}
            >
              저장하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
