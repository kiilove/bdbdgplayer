import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  FiCopy,
  FiCheck,
  FiArrowRight,
  FiRotateCcw,
  FiMail,
  FiAlertTriangle,
} from "react-icons/fi";
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

  const { resetPassword } = useFirebaseAuth();
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFindPhone(formatted);
    if (isError.message) setIsError({});
  };

  const handleNameChange = (e) => {
    setFindName(e.target.value);
    if (isError.message) setIsError({});
  };

  const handleFindEmail = async () => {
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
      const q = query(
        collection(db, "players_pool"),
        where("pName", "==", trimmedName)
      );
      const snapshot = await getDocs(q);
      const matched = [];

      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const playerPhone = (data.pTel || "").replace(/[^0-9]/g, "");
        if (playerPhone === cleanPhone && data.pEmail) {
          if (!matched.includes(data.pEmail)) {
            matched.push(data.pEmail);
          }
        }
      });

      if (matched.length > 0) {
        setFoundEmails(matched);
      } else {
        setIsError({
          message: "입력하신 정보와 일치하는 계정을 찾을 수 없습니다.",
        });
      }
    } catch (err) {
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

  const handleSendEmail = async () => {
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
        setMessage({
          body: "재설정 링크가 발송되었습니다",
          body2: `${email} 메일함을 확인해주세요.`,
          body3: "메일이 도착하지 않은 경우 스팸 메일함도 확인해주세요.",
          isButton: true,
          confirmButtonText: "로그인하러 가기",
        });
        setMessageOpen(true);
      }
    } catch (error) {
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

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#F5F5F7] text-[#111111] p-4 font-sans antialiased">
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
              strokeColor="#111111"
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
            <span className="text-2xl font-black text-[#111111] tracking-tighter">
              BDBDG
            </span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            아이디 · 비밀번호 찾기
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            이메일 계정을 조회하거나 비밀번호 재설정 링크를 받을 수 있습니다.
          </p>
        </div>

        {/* Main Box */}
        <div className="w-full bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)] flex flex-col">
          {/* Tab Bar */}
          <div className="flex w-full p-1 bg-[#F5F5F7] rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("findEmail");
                setIsError({});
                setFoundEmails(null);
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${
                activeTab === "findEmail"
                  ? "bg-white text-[#111111] shadow-sm"
                  : "text-neutral-500 hover:text-[#111111]"
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
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition cursor-pointer ${
                activeTab === "resetPassword"
                  ? "bg-white text-[#111111] shadow-sm"
                  : "text-neutral-500 hover:text-[#111111]"
              }`}
            >
              비밀번호 재설정
            </button>
          </div>

          {isError.message && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs sm:text-sm font-medium flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-base shrink-0" />
              <span>{isError.message}</span>
            </div>
          )}

          {activeTab === "findEmail" && (
            <div>
              {foundEmails ? (
                <div className="flex flex-col gap-y-4">
                  <div className="text-center py-2">
                    <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      계정 확인 완료 ({foundEmails.length}건)
                    </span>
                    <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-3">
                      개인정보 보호를 위해 일부가 마스킹 처리되었습니다:
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {foundEmails.map((email, idx) => {
                      const masked = maskEmail(email);
                      return (
                        <div
                          key={idx}
                          className="bg-[#F5F5F7] border border-neutral-200 rounded-2xl p-4 flex flex-col gap-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-x-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-white text-[#111111] border border-neutral-200 flex items-center justify-center shrink-0">
                                <FiMail className="text-xs" />
                              </div>
                              <span className="font-bold text-[#111111] text-sm sm:text-base tracking-tight truncate">
                                {masked}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(masked)}
                              className="flex items-center gap-x-1 px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition cursor-pointer shrink-0"
                            >
                              {copiedEmail === masked ? (
                                <>
                                  <FiCheck className="text-emerald-600 text-xs" />
                                  <span className="text-emerald-600">복사됨</span>
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
                            className="w-full py-2.5 bg-white hover:bg-[#111111] text-[#111111] hover:text-white border border-neutral-200 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-x-1.5"
                          >
                            <span>이 계정으로 비밀번호 재설정</span>
                            <FiArrowRight className="text-xs" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-y-2 mt-2 pt-4 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-full shadow-sm transition cursor-pointer flex items-center justify-center"
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
                      className="text-xs sm:text-sm text-neutral-500 hover:text-[#111111] font-medium py-2 transition flex items-center justify-center gap-x-1 cursor-pointer"
                    >
                      <FiRotateCcw className="text-xs" />
                      <span>다른 정보로 다시 찾기</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      선수 이름 (실명)
                    </label>
                    <input
                      type="text"
                      className="w-full h-12 bg-[#F5F5F7] border border-neutral-200 rounded-xl px-4 text-[#111111] text-base focus:bg-white focus:border-[#111111] focus:outline-none placeholder-neutral-400 transition"
                      placeholder="이름 입력"
                      value={findName}
                      onChange={handleNameChange}
                      onKeyDown={(e) => e.key === "Enter" && handleFindEmail()}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                      휴대폰 번호
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      className="w-full h-12 bg-[#F5F5F7] border border-neutral-200 rounded-xl px-4 text-[#111111] text-base focus:bg-white focus:border-[#111111] focus:outline-none placeholder-neutral-400 transition"
                      placeholder="010-1234-5678"
                      value={findPhone}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => e.key === "Enter" && handleFindEmail()}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleFindEmail}
                    disabled={isLoading}
                    className="w-full py-4 font-bold text-[15px] rounded-full shadow-sm transition flex items-center justify-center mt-2 bg-[#111111] hover:bg-neutral-800 text-white cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? "조회 중..." : "이메일 계정 찾기"}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "resetPassword" && (
            <div className="flex flex-col gap-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">
                  가입한 이메일 주소
                </label>
                <input
                  type="email"
                  className="w-full h-12 bg-[#F5F5F7] border border-neutral-200 rounded-xl px-4 text-[#111111] text-base focus:bg-white focus:border-[#111111] focus:outline-none placeholder-neutral-400 transition"
                  placeholder="name@example.com"
                  value={emailInfo.email || ""}
                  onChange={handleEmailInput}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                />
              </div>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isLoading}
                className="w-full py-4 font-bold text-[15px] rounded-full shadow-sm transition flex items-center justify-center mt-2 bg-[#111111] hover:bg-neutral-800 text-white cursor-pointer disabled:opacity-50"
              >
                {isLoading ? "발송 중..." : "비밀번호 재설정 메일 발송"}
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-sm text-neutral-500 hover:text-[#111111] underline underline-offset-4 font-semibold cursor-pointer"
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
