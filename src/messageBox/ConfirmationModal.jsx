import React from "react";
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
    <AppDrawer open={isOpen} onClose={handleCancelClick} anchor="bottom">
      <div
        className="w-full max-w-md mx-auto bg-[#141414] border-t border-x border-neutral-800 rounded-t-3xl p-6 sm:p-8 shadow-2xl focus:outline-none flex flex-col items-center"
        onKeyDown={handleKeyDown}
      >
        {/* Drag Handle Indicator */}
        <div className="w-12 h-1.5 rounded-full bg-neutral-700 mb-5" />

        <div className="flex flex-col gap-y-2 text-white items-center text-center">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
            {message?.body}
          </h2>
          {message?.body2 && (
            <p className="text-xs sm:text-sm font-medium text-neutral-400">
              {message.body2}
            </p>
          )}
          {message?.body3 && (
            <p className="text-xs text-neutral-500">{message.body3}</p>
          )}
        </div>

        {message?.isButton === true && (
          <div className="flex justify-center gap-x-3 mt-6 w-full">
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
