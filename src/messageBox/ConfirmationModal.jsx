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
      iconWrapClass: "bg-neutral-100 text-[#111111] border-neutral-200",
      badgeClass: "bg-[#111111] text-white border-[#111111]",
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
      iconWrapClass: "bg-[#FFF5F5] text-[#FF3B30] border-[#FF3B30]/25",
      badgeClass: "bg-[#FFF5F5] text-[#FF3B30] border-[#FF3B30]/25",
    };
  }

  return {
    badge: message.title || "안내",
    icon: FiInfo,
    iconWrapClass: "bg-neutral-100 text-[#111111] border-neutral-200",
    badgeClass: "bg-neutral-100 text-neutral-700 border-neutral-200",
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
        className="relative w-full max-w-[380px] bg-white border border-neutral-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)] text-[#111111] flex flex-col items-center text-center animate-modalPop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 우측 상단 닫기 버튼 */}
        <button
          type="button"
          onClick={handleCancelClick}
          aria-label="닫기"
          className="absolute top-4 right-4 w-8 h-8 rounded-lg text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        {/* 상단 아이콘 & 상태 배지 */}
        <div
          className={`w-13 h-13 rounded-xl border flex items-center justify-center mb-3.5 ${iconWrapClass}`}
          style={{ width: "52px", height: "52px" }}
        >
          <IconComponent className="text-2xl" />
        </div>

        <span
          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-[4px] border mb-3 ${badgeClass}`}
        >
          {badge}
        </span>

        {/* 본문 메시지 영역 */}
        <div className="flex flex-col gap-y-2 w-full px-1">
          {message?.body && (
            <h2 className="text-[17px] sm:text-lg font-black tracking-tight text-[#111111] leading-snug break-keep">
              {message.body}
            </h2>
          )}
          {message?.body2 && (
            <p className="text-sm font-medium text-neutral-500 leading-relaxed break-keep">
              {message.body2}
            </p>
          )}
          {message?.body3 && (
            <p className="text-xs font-medium text-neutral-500 bg-[#FAFAFA] border border-neutral-200/70 rounded-xl px-3.5 py-2.5 mt-1 leading-relaxed break-keep">
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
                className="flex-1 py-3.5 bg-neutral-100 hover:bg-neutral-200/80 rounded-xl text-sm font-bold text-neutral-700 transition cursor-pointer active:scale-[0.98]"
                onClick={handleCancelClick}
              >
                {message.cancelButtonText}
              </button>
            )}
            <button
              type="button"
              autoFocus
              className="flex-1 py-3.5 bg-[#111111] hover:bg-neutral-800 rounded-xl text-sm font-bold text-white transition active:scale-[0.98] cursor-pointer"
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
