import React, { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FiCopy, FiCheck, FiArrowRight, FiRotateCcw, FiMail, FiAlertTriangle } from "react-icons/fi";

// Rate Limit 정책 (백그라운드 보안 로직)
const FIND_LIMIT_KEY = "bdbdg_ratelimit_find";
const FIND_MAX_ATTEMPTS = 5; // 10분 내 최대 5회 시도 가능
const FIND_WINDOW_MS = 10 * 60 * 1000; // 10분
const FIND_LOCK_MS = 5 * 60 * 1000; // 초과 시 5분 락
const FIND_COOLDOWN_MS = 2500; // 연타 방지 2.5초

const RESET_LIMIT_KEY = "bdbdg_ratelimit_reset";
const RESET_MAX_ATTEMPTS = 3; // 10분 내 최대 3회 발송 가능
const RESET_WINDOW_MS = 10 * 60 * 1000; // 10분
const RESET_LOCK_MS = 10 * 60 * 1000; // 초과 시 10분 락
const RESET_COOLDOWN_MS = 60 * 1000; // 재발송 60초 쿨다운

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

const ResetPassword = () => {
  const [activeTab, setActiveTab] = useState("findEmail"); // "findEmail" | "resetPassword"
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  // 이메일 찾기 State
  const [findName, setFindName] = useState("");
  const [findPhone, setFindPhone] = useState("");
  const [foundEmails, setFoundEmails] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState("");

  // 비밀번호 재설정 State
  const [emailInfo, setEmailInfo] = useState({});

  const { resetPassword } = useFirebaseAuth();
  const navigate = useNavigate();

  // 이메일 마스킹 (개인정보 보호: 앞뒤 일부만 남기고 중간을 마스킹하여 계정 구분 가능하게 처리)
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [local, domain] = email.split("@");

    if (local.length <= 1) {
      return `*@${domain}`;
    }
    if (local.length === 2) {
      return `${local[0]}*@${domain}`;
    }
    if (local.length === 3) {
      return `${local[0]}*${local[2]}@${domain}`;
    }
    if (local.length === 4) {
      return `${local[0]}**${local[3]}@${domain}`;
    }
    if (local.length === 5) {
      return `${local.slice(0, 2)}*${local.slice(3)}@${domain}`;
    }
    if (local.length === 6) {
      return `${local.slice(0, 2)}**${local.slice(4)}@${domain}`;
    }
    // 7자 이상
    const prefixLen = 2;
    const suffixLen = 2;
    const maskLen = Math.max(3, local.length - prefixLen - suffixLen);
    return `${local.slice(0, prefixLen)}${"*".repeat(maskLen)}${local.slice(-suffixLen)}@${domain}`;
  };

  // 전화번호 자동 하이픈 포맷
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return "";
    const cleaned = String(phoneNumber).replace(/[^0-9]/g, "").slice(0, 11);

    if (cleaned.startsWith("02")) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
      if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      if (cleaned.length <= 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
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

  // 1. 이메일(아이디) 찾기
  const handleFindEmail = async () => {
    const now = Date.now();
    const fData = getStorage(FIND_LIMIT_KEY);

    // 1-1. 락 여부 확인 (시간 노출 없이 일반 오류 반환)
    if (fData.lockedUntil && fData.lockedUntil > now) {
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    // 1-2. 쿨다운 확인 (연타 방지)
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

    // 1-3. 10분 윈도우 내 시도 횟수 검증
    const windowStart = fData.windowStart || now;
    const isWindowExpired = now - windowStart > FIND_WINDOW_MS;
    const currentAttempts = isWindowExpired ? 0 : (fData.attempts || 0);

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

    // 시도 기록 저장
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

  // 마스킹된 이메일 복사
  const handleCopyEmail = (masked) => {
    navigator.clipboard.writeText(masked);
    setCopiedEmail(masked);
    setTimeout(() => {
      setCopiedEmail("");
    }, 2000);
  };

  // 찾은 이메일로 비밀번호 재설정 탭으로 이동
  const handleGoToResetWithEmail = (email) => {
    setEmailInfo({ email });
    setActiveTab("resetPassword");
    setFoundEmails(null);
    setIsError({});
  };

  // 2. 비밀번호 재설정
  const handleEmailInput = (e) => {
    setEmailInfo({ email: e.target.value.trim() });
    if (isError.message) {
      setIsError({});
    }
  };

  const handleSendEmail = async () => {
    const now = Date.now();
    const rData = getStorage(RESET_LIMIT_KEY);

    // 2-1. 락 여부 확인 (시간 노출 없이 일반 오류 반환)
    if (rData.lockedUntil && rData.lockedUntil > now) {
      setIsError({
        message: "요청 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    // 2-2. 쿨다운 확인
    if (rData.cooldownUntil && rData.cooldownUntil > now) {
      setIsError({ message: "잠시 후 다시 시도해주세요." });
      return;
    }

    const email = emailInfo.email ? emailInfo.email.trim() : "";
    if (!email) {
      setIsError({ code: "missing-email", message: "이메일 주소를 입력해주세요." });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsError({ code: "invalid-email", message: "올바른 이메일 주소 형식이 아닙니다." });
      return;
    }

    // 2-3. 10분 윈도우 내 시도 횟수 검증 (최대 3회)
    const windowStart = rData.windowStart || now;
    const isWindowExpired = now - windowStart > RESET_WINDOW_MS;
    const currentAttempts = isWindowExpired ? 0 : (rData.attempts || 0);

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

    // 시도 기록 및 60초 쿨다운 설정
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
      setIsError({ code: "unknown", message: "메일 발송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageBox = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#0B0B0B] text-white p-4 font-sans antialiased">
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />
      <div className="flex w-full flex-col items-center max-w-sm">
        {isLoading && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center">
            <RotatingLines
              strokeColor="#ffffff"
              strokeWidth="4"
              animationDuration="0.75"
              width="64"
              visible={true}
            />
          </div>
        )}

        {/* Top Header */}
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-6 text-center">
          <button onClick={() => navigate("/login")} className="inline-block mb-2 cursor-pointer">
            <span className="text-3xl font-black text-white tracking-tighter uppercase">
              BDBDG
            </span>
          </button>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider uppercase">
            Account Recovery
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            계정 찾기
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            아이디(이메일)를 찾거나 비밀번호를 재설정할 수 있습니다.
          </p>
        </div>

        {/* Main Box */}
        <div className="w-full bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col">
          {/* Tab Bar */}
          <div className="flex w-full p-1 bg-neutral-900 border border-neutral-800 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setActiveTab("findEmail");
                setIsError({});
                setFoundEmails(null);
              }}
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${
                activeTab === "findEmail"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
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
              className={`flex-1 py-2.5 text-xs font-black rounded-xl transition cursor-pointer ${
                activeTab === "resetPassword"
                  ? "bg-white text-black shadow-md"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              비밀번호 재설정
            </button>
          </div>

          {/* Error Message */}
          {isError.message && (
            <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 mb-4">
              <FiAlertTriangle className="text-sm shrink-0 text-rose-400" />
              <span>{isError.message}</span>
            </div>
          )}

          {/* TAB 1: 이메일 찾기 */}
          {activeTab === "findEmail" && (
            <div>
              {foundEmails ? (
                /* 이메일 찾기 성공 화면 (마스킹 적용) */
                <div className="flex flex-col gap-y-4">
                  <div className="text-center py-2">
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 tracking-wider">
                      계정 확인 완료 ({foundEmails.length}건)
                    </span>
                    <p className="text-xs text-neutral-400 font-medium mt-3">
                      개인정보 보호를 위해 마스킹 처리되었습니다:
                    </p>
                  </div>

                  <div className="flex flex-col gap-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                    {foundEmails.map((email, idx) => {
                      const masked = maskEmail(email);
                      return (
                        <div
                          key={idx}
                          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex flex-col gap-y-2.5 hover:border-neutral-700 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center shrink-0">
                                <FiMail className="text-xs" />
                              </div>
                              <span className="font-black text-white text-sm sm:text-base tracking-tight truncate">
                                {masked}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(masked)}
                              className="flex items-center gap-x-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-bold transition cursor-pointer shrink-0"
                            >
                              {copiedEmail === masked ? (
                                <>
                                  <FiCheck className="text-emerald-400 text-xs" />
                                  <span className="text-emerald-400">복사됨</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="text-xs" />
                                  <span>복사</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* 개별 계정 비밀번호 재설정 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleGoToResetWithEmail(email)}
                            className="w-full py-2 bg-neutral-800 hover:bg-white text-neutral-200 hover:text-black font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-x-1.5 active:scale-95"
                          >
                            <span>이 계정으로 비밀번호 재설정</span>
                            <FiArrowRight className="text-xs" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-y-2 mt-3 pt-3 border-t border-neutral-800">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full h-14 bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-wider rounded-full shadow-xl transition cursor-pointer flex items-center justify-center active:scale-95"
                    >
                      로그인 화면으로 이동
                    </button>
                    <button
                      onClick={() => {
                        setFoundEmails(null);
                        setFindName("");
                        setFindPhone("");
                      }}
                      className="text-xs text-neutral-500 hover:text-neutral-300 font-medium py-2 transition flex items-center justify-center gap-x-1 cursor-pointer"
                    >
                      <FiRotateCcw className="text-[11px]" />
                      <span>다른 정보로 다시 찾기</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* 이메일 찾기 입력 폼 */
                <div className="flex flex-col gap-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5">선수 이름 (실명)</label>
                    <input
                      type="text"
                      className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 text-white text-sm focus:border-white focus:outline-none placeholder-neutral-600 transition"
                      placeholder="홍길동"
                      value={findName}
                      onChange={handleNameChange}
                      onKeyDown={(e) => e.key === "Enter" && handleFindEmail()}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1.5">휴대폰 번호</label>
                    <input
                      type="tel"
                      className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 text-white text-sm focus:border-white focus:outline-none placeholder-neutral-600 transition"
                      placeholder="010-1234-5678"
                      value={findPhone}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => e.key === "Enter" && handleFindEmail()}
                    />
                  </div>

                  <button
                    onClick={() => handleFindEmail()}
                    disabled={isLoading}
                    className="w-full h-14 font-black text-sm tracking-wider uppercase rounded-full shadow-xl transition flex items-center justify-center mt-2 bg-white hover:bg-neutral-200 text-black cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? "조회 중..." : "이메일 찾기"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 비밀번호 재설정 */}
          {activeTab === "resetPassword" && (
            <div className="flex flex-col gap-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1.5">이메일 주소</label>
                <input
                  type="email"
                  className="w-full h-12 bg-neutral-900 border border-neutral-800 rounded-2xl px-4 text-white text-sm focus:border-white focus:outline-none placeholder-neutral-600 transition"
                  placeholder="name@example.com"
                  value={emailInfo.email || ""}
                  onChange={(e) => handleEmailInput(e)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                />
              </div>

              <button
                onClick={() => handleSendEmail()}
                disabled={isLoading}
                className="w-full h-14 font-black text-sm tracking-wider uppercase rounded-full shadow-xl transition flex items-center justify-center mt-2 bg-white hover:bg-neutral-200 text-black cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "발송 중..." : "재설정 메일 발송"}
              </button>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <div className="flex justify-center items-center mt-8 text-center">
          <button
            onClick={() => navigate("/login")}
            className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 font-semibold cursor-pointer"
          >
            로그인 화면으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
