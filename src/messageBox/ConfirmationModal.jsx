import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiLock,
  FiX,
} from "react-icons/fi";

/**
 * 메시지 문구 또는 명시된 type을 기반으로 아이콘과 배지 스타일 자동 결정
 */
const resolveModalTheme = (message = {}) => {
  const explicitType = message.type;
  const text = `${message.title || ""} ${message.body || ""} ${
    message.body2 || ""
  }`;

  if (explicitType === "success" || /완료|성공|설정되었습니다/.test(text)) {
    return {
      badge: message.title || "완료 안내",
      icon: FiCheckCircle,
      iconWrapClass: "bg-emerald-50 text-emerald-600 border-emerald-200",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
  }

  if (explicitType === "lock" || /로그인/.test(text)) {
    return {
      badge: message.title || "로그인 안내",
      icon: FiLock,
      iconWrapClass: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
      badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    };
  }

  if (
    explicitType === "error" ||
    explicitType === "warn" ||
    /오류|실패|일치하지|초과|제한|입력해|확인해/.test(text)
  ) {
    return {
      badge: message.title || "확인 필요",
      icon: FiAlertCircle,
      iconWrapClass: "bg-rose-50 text-[#FF2E54] border-rose-200",
      badgeClass: "bg-rose-50 text-[#FF2E54] border-rose-200",
    };
  }

  return {
    badge: message.title || "안내",
    icon: FiInfo,
    iconWrapClass: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  };
};

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message = {} }) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (onCancel) onCancel();
      } else if (event.key === "Enter") {
        event.preventDefault();
        if (onConfirm) {
          onConfirm();
        } else if (onCancel) {
          onCancel();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onConfirm, onCancel]);

  if (!isOpen) return null;

  const { badge, icon: IconComponent, iconWrapClass, badgeClass } =
    resolveModalTheme(message);

  const handleConfirmClick = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancelClick = () => {
    if (onCancel) onCancel();
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-sm animate-fadeIn font-sans antialiased"
      onClick={handleCancelClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[380px] bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] text-[#111111] flex flex-col items-center text-center animate-modalPop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 우측 상단 닫기 버튼 */}
        <button
          type="button"
          onClick={handleCancelClick}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-full text-neutral-400 hover:text-[#111111] hover:bg-[#F5F5F7] flex items-center justify-center transition cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        {/* 상단 아이콘 & 상태 배지 */}
        <div
          className={`w-13 h-13 rounded-2xl border flex items-center justify-center mb-3.5 ${iconWrapClass}`}
          style={{ width: "52px", height: "52px" }}
        >
          <IconComponent className="text-2xl" />
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-[5px] border mb-3 ${badgeClass}`}
        >
          {badge}
        </span>

        {/* 본문 메시지 영역 */}
        <div className="flex flex-col gap-y-2 w-full px-1">
          {message?.body && (
            <h2 className="text-[17px] sm:text-lg font-extrabold tracking-tight text-[#0F172A] leading-snug break-keep">
              {message.body}
            </h2>
          )}
          {message?.body2 && (
            <p className="text-sm font-medium text-slate-600 leading-relaxed break-keep">
              {message.body2}
            </p>
          )}
          {message?.body3 && (
            <p className="text-xs font-medium text-slate-500 bg-slate-50 rounded-xl px-3.5 py-2.5 mt-1 leading-relaxed break-keep">
              {message.body3}
            </p>
          )}
        </div>

        {/* 하단 액션 버튼 영역 */}
        {message?.isButton !== false && (
          <div className="flex items-center gap-x-2.5 mt-6 w-full">
            {message?.cancelButtonText && (
              <button
                type="button"
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 rounded-xl text-sm font-bold text-slate-700 transition cursor-pointer active:scale-[0.98]"
                onClick={handleCancelClick}
              >
                {message.cancelButtonText}
              </button>
            )}
            <button
              type="button"
              autoFocus
              className="flex-1 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] rounded-xl text-sm font-bold text-white transition active:scale-[0.98] shadow-[0_6px_18px_rgba(99,102,241,0.28)] cursor-pointer"
              onClick={handleConfirmClick}
            >
              {message?.confirmButtonText || "확인"}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
