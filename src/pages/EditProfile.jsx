import React, { useContext, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { handleToast } from "../components/HandleToast";
import { UserContext } from "../context/UserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
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
  password: {
    title: "비밀번호 변경",
    label: "비밀번호 변경",
    placeholder: "",
    hints: [
      "보안을 위해 현재 비밀번호를 먼저 확인한 후 새 비밀번호로 변경합니다.",
      "새 비밀번호는 6자리 이상으로 입력해 주세요.",
    ],
  },
};

const EditProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const { changePassword, resetPassword } = useFirebaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const editType = location.state?.editType;
  const config = editType ? EDIT_CONFIG[editType] : null;

  const [value, setValue] = useState(() => {
    if (!editType || editType === "password") return "";
    if (editType === "pGender") return pInfo?.pGender || "m";
    if (editType === "pTel") return formatPhoneNumber(pInfo?.pTel || "");
    if (editType === "pBirth") return formatBirthDate(pInfo?.pBirth || "");
    return pInfo?.[editType] || "";
  });

  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdError, setPwdError] = useState("");

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

  const handlePwdFieldChange = (e) => {
    const { name, value: fieldVal } = e.target;
    setPwdForm((prev) => ({ ...prev, [name]: fieldVal }));
    if (pwdError) setPwdError("");
  };

  const isPasswordModeValid =
    pwdForm.currentPassword.length > 0 &&
    pwdForm.newPassword.length >= 6 &&
    pwdForm.newPassword === pwdForm.confirmPassword &&
    pwdForm.currentPassword !== pwdForm.newPassword;

  const isValid = () => {
    if (editType === "password") return isPasswordModeValid;
    if (editType === "pTel") return validatePhoneNumber(value);
    if (editType === "pBirth") return validateDate(value);
    if (editType === "pGender") return value === "m" || value === "f";
    if (editType === "pGym") return Boolean(value && value.trim().length > 0);
    return false;
  };

  const handlePasswordChangeSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (!isPasswordModeValid || isLoading) return;

    setIsLoading(true);
    setPwdError("");
    try {
      const result = await changePassword({
        email: pInfo?.pEmail,
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });

      if (result.error) {
        setPwdError(result.error.message);
      } else {
        handleToast("success", "비밀번호가 안전하게 변경되었습니다.");
        navigate("/myprofile", { replace: true });
      }
    } catch {
      setPwdError("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetEmailFallback = async () => {
    if (!pInfo?.pEmail || isLoading) return;
    setIsLoading(true);
    setPwdError("");
    try {
      const result = await resetPassword(pInfo.pEmail);
      if (result.error) {
        setPwdError(result.error.message);
      } else {
        handleToast(
          "success",
          `${pInfo.pEmail}으로 비밀번호 재설정 링크를 발송했습니다.`
        );
      }
    } catch {
      setPwdError("재설정 메일 발송 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (editType === "password") {
      await handlePasswordChangeSubmit();
      return;
    }

    if (!isValid() || (!pInfo?.id && !pInfo?.playerUid)) return;
    setIsLoading(true);

    const trimmedVal = value.trim();
    const updatedFields = { [editType]: trimmedVal };
    if (editType === "pBirth") {
      updatedFields.playerAge = calculateAge(trimmedVal);
    } else if (editType === "pGender") {
      updatedFields.gender = trimmedVal;
    }

    const nextUserInfo = {
      ...pInfo,
      ...updatedFields,
    };

    try {
      const savedDoc = await savePlayerProfile(pInfo.id, nextUserInfo);
      setCurrentUserInfo(
        savedDoc?.id ? { ...nextUserInfo, id: savedDoc.id } : nextUserInfo
      );
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
    <div className="min-h-screen bg-[#F6F8FB] text-[#191F28] pb-28 font-sans antialiased">
      <BottomMenu />
      <Header title={config.title} />

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

      <main className="max-w-md mx-auto px-4 pt-8">
        <div className="flex w-full flex-col bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 gap-y-5 shadow-[0_2px_16px_rgba(15,23,42,0.04)]">
          {editType === "password" ? (
            <form
              onSubmit={handlePasswordChangeSubmit}
              className="flex flex-col gap-y-4"
            >
              {pInfo?.pEmail && (
                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 font-semibold">
                    대상 계정
                  </span>
                  <span className="font-bold text-[#191F28] truncate ml-2">
                    {pInfo.pEmail}
                  </span>
                </div>
              )}

              {pwdError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-semibold">
                  {pwdError}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[#191F28] mb-1.5">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  autoComplete="current-password"
                  value={pwdForm.currentPassword}
                  onChange={handlePwdFieldChange}
                  placeholder="현재 사용 중인 비밀번호 입력"
                  className="w-full h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 focus:outline-none px-4 rounded-xl text-[#191F28] text-base font-medium placeholder-slate-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#191F28] mb-1.5">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  value={pwdForm.newPassword}
                  onChange={handlePwdFieldChange}
                  placeholder="새 비밀번호 (6자리 이상)"
                  className="w-full h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 focus:outline-none px-4 rounded-xl text-[#191F28] text-base font-medium placeholder-slate-400 transition"
                />
                {pwdForm.newPassword.length > 0 &&
                  pwdForm.newPassword.length < 6 && (
                    <span className="text-xs text-rose-600 font-medium mt-1.5 block">
                      새 비밀번호는 6자리 이상이어야 합니다.
                    </span>
                  )}
                {pwdForm.newPassword.length >= 6 &&
                  pwdForm.currentPassword &&
                  pwdForm.newPassword === pwdForm.currentPassword && (
                    <span className="text-xs text-rose-600 font-medium mt-1.5 block">
                      현재 비밀번호와 다른 비밀번호를 입력해 주세요.
                    </span>
                  )}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#191F28] mb-1.5">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={pwdForm.confirmPassword}
                  onChange={handlePwdFieldChange}
                  placeholder="새 비밀번호 다시 입력"
                  className="w-full h-12 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 focus:outline-none px-4 rounded-xl text-[#191F28] text-base font-medium placeholder-slate-400 transition"
                />
                {pwdForm.confirmPassword.length > 0 &&
                  pwdForm.newPassword !== pwdForm.confirmPassword && (
                    <span className="text-xs text-rose-600 font-medium mt-1.5 block">
                      새 비밀번호가 일치하지 않습니다.
                    </span>
                  )}
              </div>

              <ul className="text-xs sm:text-sm text-slate-500 space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-2xl mt-1">
                {config.hints.map((hint, idx) => (
                  <li key={idx}>• {hint}</li>
                ))}
              </ul>

              <div className="flex w-full gap-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/myprofile")}
                  className="flex-1 py-3.5 rounded-full font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!isPasswordModeValid || isLoading}
                  className={`flex-1 py-3.5 rounded-full font-bold text-sm transition ${
                    isPasswordModeValid
                      ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.22)]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  비밀번호 변경
                </button>
              </div>

              {pInfo?.pEmail && (
                <div className="pt-4 mt-1 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleSendResetEmailFallback}
                    className="text-xs text-slate-500 hover:text-[#2563EB] underline underline-offset-4 font-semibold cursor-pointer"
                  >
                    현재 비밀번호가 기억나지 않으시나요? 이메일로 재설정 링크 받기
                  </button>
                </div>
              )}
            </form>
          ) : (
            <>
              <label className="text-sm font-bold text-[#191F28]">
                {config.label}
              </label>

              {editType === "pGender" ? (
                <select
                  className="w-full h-13 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 focus:outline-none px-4 py-3.5 rounded-xl text-[#191F28] text-base font-medium cursor-pointer transition"
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
                  className="w-full h-13 bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/15 focus:outline-none px-4 py-3.5 rounded-xl text-[#191F28] text-base font-medium placeholder-slate-400 transition"
                />
              )}

              {computedAge !== null && computedAge > 0 && (
                <div className="flex justify-end items-center">
                  <span className="text-xs font-bold text-[#2563EB] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
                    계산된 나이: 만 {computedAge}세
                  </span>
                </div>
              )}

              {config.hints.length > 0 && (
                <ul className="text-xs sm:text-sm text-slate-500 space-y-1.5 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  {config.hints.map((hint, idx) => (
                    <li key={idx}>• {hint}</li>
                  ))}
                </ul>
              )}

              <div className="flex w-full gap-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/myprofile")}
                  className="flex-1 py-3.5 rounded-full font-bold text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  disabled={!isValid() || isLoading}
                  onClick={handleSave}
                  className={`flex-1 py-3.5 rounded-full font-bold text-sm transition ${
                    isValid()
                      ? "bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-[0_4px_12px_rgba(37,99,235,0.22)]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  저장하기
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
