import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import AppDrawer from "../components/common/AppDrawer";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message = {} }) => {
  const handleConfirmClick = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancelClick = () => {
    if (onCancel) onCancel();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCancelClick();
    }
  };

  return (
    <AppDrawer open={isOpen} onClose={handleCancelClick} size="sm">
      <div
        className="w-full h-full bg-[#141414] p-6 sm:p-8 flex flex-col justify-between focus:outline-none"
        onKeyDown={handleKeyDown}
      >
        {/* PC 상단 닫기 바 (모바일에서는 바텀시트 핸들 사용) */}
        <div className="hidden md:flex w-full justify-between items-center pb-4 border-b border-neutral-800 mb-6">
          <span className="text-xs font-black tracking-widest text-neutral-400 uppercase">
            NOTICE
          </span>
          <button
            type="button"
            onClick={handleCancelClick}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition cursor-pointer"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        <div className="flex flex-col gap-y-2.5 text-white items-center text-center my-auto py-4">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white break-keep">
            {message?.body}
          </h2>
          {message?.body2 && (
            <p className="text-xs sm:text-sm font-medium text-neutral-400 break-keep">
              {message.body2}
            </p>
          )}
          {message?.body3 && (
            <p className="text-xs text-neutral-500 break-keep">
              {message.body3}
            </p>
          )}
        </div>

        {message?.isButton === true && (
          <div className="flex justify-center gap-x-3 mt-6 pt-4 border-t border-neutral-800/80 w-full">
            {message?.cancelButtonText && (
              <button
                type="button"
                className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider transition cursor-pointer"
                onClick={handleCancelClick}
              >
                {message.cancelButtonText}
              </button>
            )}
            {message?.confirmButtonText && (
              <button
                type="button"
                className="flex-1 py-3.5 bg-white hover:bg-neutral-200 rounded-full text-xs font-black text-black uppercase tracking-wider transition active:scale-[0.98] shadow-lg cursor-pointer"
                onClick={handleConfirmClick}
              >
                {message.confirmButtonText}
              </button>
            )}
          </div>
        )}
      </div>
    </AppDrawer>
  );
};

export default ConfirmationModal;
