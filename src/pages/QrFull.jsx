import React from "react";
import QrGenerator from "../components/QrGenerator";
import { RiCloseLine } from "react-icons/ri";

const QrFull = () => {
  return (
    <div className="w-screen h-screen bg-[#0B0B0B] text-white flex flex-col justify-between items-center p-6">
      {/* Top Close Button */}
      <div className="w-full flex justify-end">
        <button
          onClick={() => window.history.back()}
          className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
        >
          <RiCloseLine className="text-2xl" />
        </button>
      </div>

      {/* Center QR Card */}
      <div className="flex flex-col items-center max-w-sm w-full">
        <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center w-full">
          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">
            OFFICIAL ATHLETE PASS
          </span>
          <h2 className="text-xl font-black text-white tracking-tight mb-6">
            선수 본인 인증 QR 코드
          </h2>
          <div className="bg-white p-4 rounded-2xl shadow-inner">
            <QrGenerator />
          </div>
          <p className="text-xs text-neutral-400 mt-6 font-medium">
            대회 계체량 측정 및 경기장 입장 시 스태프에게 제시해주세요.
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pb-4">
        <span className="text-xs font-black tracking-widest text-neutral-600 uppercase">
          BDBDg Official
        </span>
      </div>
    </div>
  );
};

export default QrFull;
