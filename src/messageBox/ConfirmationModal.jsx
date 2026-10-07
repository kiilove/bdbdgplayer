import { Modal } from "@mui/material";
import React from "react";

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  const handleConfirmClick = () => {
    onConfirm();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleCancelClick();
    }
  };

  return (
    <div>
      <Modal open={isOpen} onClose={handleCancelClick} className="backdrop-blur-sm bg-black/60">
        <div
          className="flex flex-col w-[90%] max-w-sm bg-[#141414] border border-neutral-800 justify-center items-center absolute top-1/2 left-1/2 rounded-3xl p-6 sm:p-8 shadow-2xl focus:outline-none"
          style={{
            transform: "translate(-50%, -50%)",
          }}
          onKeyDown={handleKeyDown}
        >
          <div className="flex flex-col gap-y-2 text-white items-center text-center">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-white">{message.body}</h2>
            {message.body2 && (
              <p className="text-xs sm:text-sm font-medium text-neutral-400">{message.body2}</p>
            )}
            {message.body3 && (
              <p className="text-xs text-neutral-500">{message.body3}</p>
            )}
          </div>
          {message.isButton === true && (
            <div className="flex justify-center gap-x-3 mt-6 w-full">
              {message.cancelButtonText && (
                <button
                  className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-full text-xs font-bold text-neutral-300 hover:text-white uppercase tracking-wider transition cursor-pointer"
                  onClick={handleCancelClick}
                >
                  {message.cancelButtonText}
                </button>
              )}
              {message.confirmButtonText && (
                <button
                  className="flex-1 py-3 bg-white hover:bg-neutral-200 rounded-full text-xs font-black text-black uppercase tracking-wider transition active:scale-[0.98] shadow-lg cursor-pointer"
                  onClick={handleConfirmClick}
                >
                  {message.confirmButtonText}
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
