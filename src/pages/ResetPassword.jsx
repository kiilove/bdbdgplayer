import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiRotateCcw,
  FiMail,
  FiAlertTriangle,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { findPlayerEmailsByNameAndPhone } from "../services/playerService";
import { formatPhoneNumber, validateEmail } from "../utils/formatUtils";

// Rate Limit 정책 (백그라운드 보안 로직)
const FIND_LIMIT_KEY = "bdbdg_ratelimit_find";
const FIND_MAX_ATTEMPTS = 5;
const FIND_WINDOW_MS = 10 * 60 * 1000;
const FIND_LOCK_MS = 5 * 60 * 1000;
const FIND_COOLDOWN_MS = 2500;

const RESET_LIMIT_KEY = "bdbdg_ratelimit_reset";
const RESET_MAX_ATTEMPTS = 3;
const RESET_WINDOW_MS = 10 * 60 * 1000;
const RESET_LOCK_MS = 10 * 60 * 1000;
const RESET_COOLDOWN_MS = 60 * 1000;

const getStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
};

const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");

  if (local.length <= 1) return `*@${domain}`;
  if (local.length === 2) return `${local[0]}*@${domain}`;
  if (local.length === 3) return `${local[0]}*${local[2]}@${domain}`;
  if (local.length === 4) return `${local[0]}**${local[3]}@${domain}`;
  if (local.length === 5)
    return `${local.slice(0, 2)}*${local.slice(3)}@${domain}`;
  if (local.length === 6)
    return `${local.slice(0, 2)}**${local.slice(4)}@${domain}`;

  const prefixLen = 2;
  const suffixLen = 2;
  const maskLen = Math.max(3, local.length - prefixLen - suffixLen);
  return `${local.slice(0, prefixLen)}${"*".repeat(maskLen)}${local.slice(-suffixLen)}@${domain}`;
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";
  const isPreviewMode = searchParams.get("preview") === "custom";

  const [activeTab, setActiveTab] = useState("findEmail");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const [findName, setFindName] = useState("");
  const [findPhone, setFindPhone] = useState("");
  const [foundEmails, setFoundEmails] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState("");

  const [emailInfo, setEmailInfo] = useState({});
  const [sentSuccessEmail, setSentSuccessEmail] = useState("");

  // 커스텀 비밀번호 재설정 화면(oobCode) 상태
  const [oobTargetEmail, setOobTargetEmail] = useState(
    isPreviewMode ? "player@bdbdg.kr" : ""
  );
  const [oobVerified, setOobVerified] = useState(isPreviewMode);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPasswordVal, setConfirmPasswordVal] = useState("");
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const { resetPassword, verifyResetCode, confirmNewPassword } =
    useFirebaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    if (!oobCode) return undefined;

    setIsLoading(true);
    setIsError({});
    verifyResetCode(oobCode)
      .then(({ email, error }) => {
        if (!isMounted) return;
        if (error) {
          setOobVerified(false);
          setIsError({ message: error.message });
        } else {
          setOobTargetEmail(email || "");
          setOobVerified(true);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [oobCode, verifyResetCode]);

  const isLengthValid = newPassword.length >= 6;
  const isMatchValid =
    newPassword.length > 0 && newPassword === confirmPasswordVal;
  const isOobFormValid = isLengthValid && isMatchValid && oobVerified;

  const handleConfirmOobReset = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    if (isPreviewMode) {
      setMessage({
        type: "success",
        title: "비밀번호 변경 완료",
        body: "새 비밀번호가 설정되었습니다",
        body2: "변경된 비밀번호로 즉시 로그인하실 수 있습니다.",
        isButton: true,
        confirmButtonText: "로그인하러 가기",
      });
      setMessageOpen(true);
      return;
    }
    if (!oobCode || !isOobFormValid) return;

    setIsLoading(true);
    setIsError({});
    try {
      const { success, error } = await confirmNewPassword(oobCode, newPassword);
      if (error || !success) {
        setIsError({
          message: error?.message || "비밀번호 변경에 실패했습니다.",
        });
      } else {
        setMessage({
          type: "success",
          title: "비밀번호 변경 완료",
          body: "새 비밀번호가 설정되었습니다",
          body2: "변경된 비밀번호로 즉시 로그인하실 수 있습니다.",
          isButton: true,
          confirmButtonText: "로그인하러 가기",
        });
        setMessageOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFindPhone(formatted);
    if (isError.message) setIsError({});
  };

  const handleNameChange = (e) => {
    setFindName(e.target.value);
    if (isError.message) setIsError({});
  };

  const handleFindEmail = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    const now = Date.now();
    const fData = getStorage(FIND_LIMIT_KEY);

    if (fData.lockedUntil && fData.lockedUntil > now) {
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    if (fData.cooldownUntil && fData.cooldownUntil > now) {
      setIsError({ message: "잠시 후 다시 시도해주세요." });
      return;
    }

    const trimmedName = findName.trim();
    const cleanPhone = findPhone.replace(/[^0-9]/g, "");

    if (!trimmedName) {
      setIsError({ message: "선수 이름을 입력해주세요." });
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setIsError({ message: "올바른 휴대폰 번호를 입력해주세요." });
      return;
    }

    const windowStart = fData.windowStart || now;
    const isWindowExpired = now - windowStart > FIND_WINDOW_MS;
    const currentAttempts = isWindowExpired ? 0 : fData.attempts || 0;

    if (currentAttempts >= FIND_MAX_ATTEMPTS) {
      const lockedUntil = now + FIND_LOCK_MS;
      setStorage(FIND_LIMIT_KEY, {
        attempts: currentAttempts + 1,
        windowStart: now,
        lockedUntil,
        cooldownUntil: now + FIND_COOLDOWN_MS,
      });
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    setStorage(FIND_LIMIT_KEY, {
      attempts: currentAttempts + 1,
      windowStart: isWindowExpired ? now : windowStart,
      lockedUntil: 0,
      cooldownUntil: now + FIND_COOLDOWN_MS,
    });

    setIsLoading(true);
    setIsError({});
    setFoundEmails(null);

    try {
      const matched = await findPlayerEmailsByNameAndPhone(
        trimmedName,
        cleanPhone
      );

      if (matched.length > 0) {
        setFoundEmails(matched);
      } else {
        setIsError({
          message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
        });
      }
    } catch {
      setIsError({
        message: "계정 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyEmail = (masked) => {
    navigator.clipboard.writeText(masked);
    setCopiedEmail(masked);
    setTimeout(() => {
      setCopiedEmail("");
    }, 2000);
  };

  const handleGoToResetWithEmail = (email) => {
    setEmailInfo({ email });
    setSentSuccessEmail("");
    setActiveTab("resetPassword");
    setFoundEmails(null);
    setIsError({});
  };

  const handleEmailInput = (e) => {
    setEmailInfo({ email: e.target.value.trim() });
    if (isError.message) {
      setIsError({});
    }
  };

  const handleSendEmail = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    const now = Date.now();
    const rData = getStorage(RESET_LIMIT_KEY);

    if (rData.lockedUntil && rData.lockedUntil > now) {
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    if (rData.cooldownUntil && rData.cooldownUntil > now) {
      setIsError({ message: "잠시 후 다시 시도해주세요." });
      return;
    }

    const email = emailInfo.email ? emailInfo.email.trim() : "";
    if (!email) {
      setIsError({
        code: "missing-email",
        message: "이메일 주소를 입력해주세요.",
      });
      return;
    }
    if (!validateEmail(email)) {
      setIsError({
        code: "invalid-email",
        message: "올바른 이메일 주소 형식이 아닙니다.",
      });
      return;
    }

    const windowStart = rData.windowStart || now;
    const isWindowExpired = now - windowStart > RESET_WINDOW_MS;
    const currentAttempts = isWindowExpired ? 0 : rData.attempts || 0;

    if (currentAttempts >= RESET_MAX_ATTEMPTS) {
      const lockedUntil = now + RESET_LOCK_MS;
      setStorage(RESET_LIMIT_KEY, {
        attempts: currentAttempts + 1,
        windowStart: now,
        lockedUntil,
        cooldownUntil: now + RESET_COOLDOWN_MS,
      });
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    setStorage(RESET_LIMIT_KEY, {
      attempts: currentAttempts + 1,
      windowStart: isWindowExpired ? now : windowStart,
      lockedUntil: 0,
      cooldownUntil: now + RESET_COOLDOWN_MS,
    });

    setIsLoading(true);
    setIsError({});
    try {
      const result = await resetPassword(email);
      if (result.error) {
        setIsError({ code: result.error.code, message: result.error.message });
      } else if (result.success) {
        setSentSuccessEmail(email);
      }
    } catch {
      setIsError({
        code: "unknown",
        message: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageBox = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const isCustomResetView = Boolean(oobCode || isPreviewMode);

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#F4F5FA] text-[#0F172A] p-4 font-sans antialiased">
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />
      <div className="flex w-full flex-col items-center max-w-md">
        {isLoading && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
            <RotatingLines
              strokeColor="#4F46E5"
              strokeWidth="4"
              animationDuration="0.75"
              width="52"
              visible={true}
            />
          </div>
        )}

        {/* Top Header */}
        <div className="flex w-full justify-center flex-col items-center gap-y-1.5 mb-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="inline-block mb-1 cursor-pointer"
          >
            <span className="text-2xl font-black text-[#0F172A] tracking-tighter">
              BDBDG<span className="text-[#FF2E54]">.</span>
            </span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {isCustomResetView
              ? "새 비밀번호 설정"
              : "아이디 · 비밀번호 찾기"}
          </h1>
          <p className="text-sm text-slate-500 font-medium break-keep">
            {isCustomResetView
              ? "계정 보안을 위해 앞으로 사용할 새로운 비밀번호를 입력해 주세요."
              : "이메일 계정을 조회하거나 비밀번호 재설정 링크를 받을 수 있습니다."}
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(15,23,42,0.05)] flex flex-col">
          {isCustomResetView ? (
            /* ===== 우리 사이트 전용 커스텀 새 비밀번호 설정 폼 (이메일 링크 클릭 시 진입) ===== */
            <form
              onSubmit={handleConfirmOobReset}
              className="flex flex-col gap-y-5"
            >
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#4F46E5] text-white flex items-center justify-center shrink-0">
                    <FiLock className="text-base" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-slate-500">
                      비밀번호 재설정 대상 계정
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#0F172A] truncate">
                      {oobTargetEmail || "인증 링크 확인 중..."}
                    </span>
                  </div>
                </div>
                {oobVerified && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[5px] shrink-0">
                    인증됨
                  </span>
                )}
              </div>

              {isError.message && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-semibold flex flex-col gap-3">
                  <div className="flex items-start gap-2">
                    <FiAlertTriangle className="text-base shrink-0 mt-0.5" />
                    <span>{isError.message}</span>
                  </div>
                  {!oobVerified && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/resetpassword", { replace: true });
                        setActiveTab("resetPassword");
                        setIsError({});
                      }}
                      className="w-full py-2.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-rose-200 rounded-xl font-bold text-xs cursor-pointer transition"
                    >
                      비밀번호 재설정 메일 다시 받기
                    </button>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                    새 비밀번호
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPwd ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={!oobVerified}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 text-[#0F172A] text-base focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none placeholder-slate-400 transition disabled:opacity-50"
                      placeholder="새 비밀번호 (6자리 이상)"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (isError.message) setIsError({});
                      }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowNewPwd((prev) => !prev)}
                      className="absolute right-3.5 text-slate-400 hover:text-[#0F172A] cursor-pointer p-1"
                    >
                      {showNewPwd ? (
                        <FiEyeOff className="text-lg" />
                      ) : (
                        <FiEye className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                    새 비밀번호 확인
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPwd ? "text" : "password"}
                      autoComplete="new-password"
                      disabled={!oobVerified}
                      className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-11 text-[#0F172A] text-base focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none placeholder-slate-400 transition disabled:opacity-50"
                      placeholder="새 비밀번호 다시 입력"
                      value={confirmPasswordVal}
                      onChange={(e) => {
                        setConfirmPasswordVal(e.target.value);
                        if (isError.message) setIsError({});
                      }}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowConfirmPwd((prev) => !prev)}
                      className="absolute right-3.5 text-slate-400 hover:text-[#0F172A] cursor-pointer p-1"
                    >
                      {showConfirmPwd ? (
                        <FiEyeOff className="text-lg" />
                      ) : (
                        <FiEye className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 실시간 조건 체크리스트 */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex flex-col gap-y-2 text-xs font-semibold">
                  <div
                    className={`flex items-center gap-2 ${
                      isLengthValid ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    <FiCheckCircle className="text-sm shrink-0" />
                    <span>6자리 이상 비밀번호 입력</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      isMatchValid ? "text-emerald-700" : "text-slate-400"
                    }`}
                  >
                    <FiCheckCircle className="text-sm shrink-0" />
                    <span>새 비밀번호와 비밀번호 확인 일치</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !isOobFormValid}
                className={`w-full py-4 font-bold text-[15px] rounded-xl transition flex items-center justify-center ${
                  isOobFormValid
                    ? "bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white shadow-[0_6px_18px_rgba(79,70,229,0.28)] cursor-pointer"
                    : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "변경 중..." : "새 비밀번호 저장 완료"}
              </button>
            </form>
          ) : (
            <>
              {/* Tab Bar */}
              <div className="flex w-full p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("findEmail");
                    setIsError({});
                    setFoundEmails(null);
                    setSentSuccessEmail("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition cursor-pointer ${
                    activeTab === "findEmail"
                      ? "bg-white text-[#4F46E5] shadow-sm"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  이메일(아이디) 찾기
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("resetPassword");
                    setIsError({});
                    setFoundEmails(null);
                    setSentSuccessEmail("");
                  }}
                  className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition cursor-pointer ${
                    activeTab === "resetPassword"
                      ? "bg-white text-[#4F46E5] shadow-sm"
                      : "text-slate-500 hover:text-[#0F172A]"
                  }`}
                >
                  비밀번호 재설정
                </button>
              </div>

              {isError.message && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-medium flex items-center gap-2 mb-4">
                  <FiAlertTriangle className="text-base shrink-0" />
                  <span>{isError.message}</span>
                </div>
              )}

              {activeTab === "findEmail" && (
                <div>
                  {foundEmails ? (
                    <div className="flex flex-col gap-y-4">
                      <div className="text-center py-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-[5px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                          계정 확인 완료 ({foundEmails.length}건)
                        </span>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-3">
                          개인정보 보호를 위해 일부가 마스킹 처리되었습니다:
                        </p>
                      </div>

                      <div className="flex flex-col gap-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                        {foundEmails.map((email, idx) => {
                          const masked = maskEmail(email);
                          return (
                            <div
                              key={idx}
                              className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-y-3"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-x-2 min-w-0">
                                  <div className="w-7 h-7 rounded-md bg-indigo-50 text-[#4F46E5] border border-indigo-100 flex items-center justify-center shrink-0">
                                    <FiMail className="text-xs" />
                                  </div>
                                  <span className="font-bold text-[#0F172A] text-sm sm:text-base tracking-tight truncate">
                                    {masked}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleCopyEmail(masked)}
                                  className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shrink-0"
                                >
                                  {copiedEmail === masked ? (
                                    <>
                                      <FiCheck className="text-emerald-600 text-xs" />
                                      <span className="text-emerald-600">
                                        복사됨
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <FiCopy className="text-xs" />
                                      <span>복사</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleGoToResetWithEmail(email)}
                                className="w-full py-2.5 bg-white hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white border border-indigo-200 font-bold text-xs sm:text-sm rounded-lg transition cursor-pointer flex items-center justify-center gap-x-1.5"
                              >
                                <span>이 계정으로 비밀번호 재설정</span>
                                <FiArrowRight className="text-xs" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex flex-col gap-y-2 mt-2 pt-4 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="w-full py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition cursor-pointer flex items-center justify-center"
                        >
                          로그인 화면으로 이동
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setFoundEmails(null);
                            setFindName("");
                            setFindPhone("");
                          }}
                          className="text-xs sm:text-sm text-slate-500 hover:text-[#4F46E5] font-medium py-2 transition flex items-center justify-center gap-x-1 cursor-pointer"
                        >
                          <FiRotateCcw className="text-xs" />
                          <span>다른 정보로 다시 찾기</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleFindEmail}
                      className="flex flex-col gap-y-4"
                    >
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          선수 이름 (실명)
                        </label>
                        <input
                          type="text"
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[#0F172A] text-base focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none placeholder-slate-400 transition"
                          placeholder="이름 입력"
                          value={findName}
                          onChange={handleNameChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                          휴대폰 번호
                        </label>
                        <input
                          type="tel"
                          inputMode="numeric"
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[#0F172A] text-base focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none placeholder-slate-400 transition"
                          placeholder="010-1234-5678"
                          value={findPhone}
                          onChange={handlePhoneChange}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition flex items-center justify-center mt-2 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? "조회 중..." : "이메일 계정 찾기"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {activeTab === "resetPassword" && (
                <div>
                  {sentSuccessEmail ? (
                    /* 발송 완료 상태 카드 */
                    <div className="flex flex-col items-center text-center gap-y-4 py-2">
                      <div className="w-14 h-14 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                        <FiMail className="text-2xl" />
                      </div>
                      <div className="flex flex-col gap-y-1.5">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-[5px] w-fit mx-auto">
                          재설정 링크 발송 완료
                        </span>
                        <h3 className="text-lg font-extrabold text-[#0F172A] mt-1">
                          메일함을 확인해 주세요
                        </h3>
                        <p className="text-sm font-bold text-[#4F46E5]">
                          {sentSuccessEmail}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed break-keep mt-1">
                          위 이메일로 비밀번호 재설정 링크를 보냈습니다. 메일 내 링크를 클릭하면 새 비밀번호를 바로 설정하실 수 있습니다. (스팸함도 함께 확인해 주세요)
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-y-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => navigate("/login")}
                          className="w-full py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition cursor-pointer"
                        >
                          로그인 화면으로 이동
                        </button>
                        <button
                          type="button"
                          onClick={() => setSentSuccessEmail("")}
                          className="text-xs sm:text-sm text-slate-500 hover:text-[#4F46E5] font-semibold py-2 cursor-pointer"
                        >
                          이메일 주소 다시 입력하기
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSendEmail}
                      className="flex flex-col gap-y-4"
                    >
                      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0 mt-0.5">
                          <FiMail className="text-sm" />
                        </div>
                        <div className="flex flex-col gap-0.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed break-keep">
                          <span className="font-bold text-[#0F172A]">
                            이메일 인증을 통한 안전한 비밀번호 재설정
                          </span>
                          <span>
                            가입하신 이메일 주소를 입력하시면, 새 비밀번호를 설정할 수 있는 전용 링크를 즉시 발송해 드립니다.
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-[#0F172A] mb-1.5">
                          가입한 이메일 주소
                        </label>
                        <input
                          type="email"
                          autoComplete="email"
                          className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-[#0F172A] text-base focus:bg-white focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15 focus:outline-none placeholder-slate-400 transition"
                          placeholder="name@example.com"
                          value={emailInfo.email || ""}
                          onChange={handleEmailInput}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition flex items-center justify-center mt-1 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? "발송 중..." : "비밀번호 재설정 링크 받기"}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex justify-center items-center mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-slate-500 hover:text-[#4F46E5] underline underline-offset-4 font-semibold cursor-pointer"
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
