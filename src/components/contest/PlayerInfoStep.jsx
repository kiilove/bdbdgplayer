import React from "react";
import { RiCheckDoubleFill } from "react-icons/ri";

const PlayerInfoStep = ({
  stepTitle = "선수 정보 입력",
  guideText = "* 입력 정보 확인 후 아래 버튼을 클릭하면 2단계 종목 선택으로 이동합니다.",
  invoiceInfo,
  playerAge,
  playerValidate,
  isConfirmedInfo,
  setIsConfirmedInfo,
  handleInputs,
  handlePlayerValidateButtonClick,
  refs = {},
}) => {
  const { pNameRef, pGenderRef, pBirthRef, pTelRef, pGymRef } = refs;

  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
        <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-x-2.5">
          <span className="w-7 h-7 rounded-full bg-white text-black text-xs flex items-center justify-center font-black">
            1
          </span>
          {stepTitle}
        </h2>
        <span className="text-xs text-neutral-500 font-medium">* 필수정보 항목</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-neutral-400 mb-1.5">
            선수 이름
          </label>
          <input
            type="text"
            value={invoiceInfo.playerName || ""}
            name="playerName"
            ref={pNameRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
              isConfirmedInfo
                ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                : playerValidate.playerName
                ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
            }`}
            placeholder="이름 입력"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-400 mb-1.5">
            성별
          </label>
          <select
            name="playerGender"
            ref={pGenderRef}
            onChange={handleInputs}
            value={invoiceInfo.playerGender || "m"}
            disabled={isConfirmedInfo}
            className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
              isConfirmedInfo
                ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                : "bg-[#1A1A1A] text-white border-neutral-800 focus:outline-none focus:border-white cursor-pointer"
            }`}
          >
            <option value="m">남자</option>
            <option value="f">여자</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-400 mb-1.5">
            생년월일 (YYYY-MM-DD)
          </label>
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              value={invoiceInfo.playerBirth || ""}
              name="playerBirth"
              ref={pBirthRef}
              onChange={handleInputs}
              disabled={isConfirmedInfo}
              className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                isConfirmedInfo
                  ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                  : playerValidate.playerBirth
                  ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                  : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
              }`}
              placeholder="YYYY-MM-DD (예: 1995-05-20)"
            />
            <span className="text-xs font-black text-neutral-300 whitespace-nowrap bg-neutral-900 px-3 py-3 rounded-2xl border border-neutral-800">
              {playerAge || 0}세
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-neutral-400 mb-1.5">
            연락처
          </label>
          <input
            type="text"
            value={invoiceInfo.playerTel || ""}
            name="playerTel"
            ref={pTelRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
              isConfirmedInfo
                ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                : playerValidate.playerTel
                ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
            }`}
            placeholder="010-0000-0000"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-neutral-400 mb-1.5">
            소속 (체육관 / 소속팀)
          </label>
          <input
            type="text"
            value={invoiceInfo.playerGym || ""}
            name="playerGym"
            ref={pGymRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
              isConfirmedInfo
                ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                : playerValidate.playerGym
                ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
            }`}
            placeholder="소속 헬스장 또는 무소속"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
        {isConfirmedInfo ? (
          <>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3.5 py-2 rounded-full border border-emerald-800/60 flex items-center gap-x-1.5">
              <RiCheckDoubleFill className="text-base" />
              선수 정보 검증 & 입력 잠금 완료
            </span>
            <button
              type="button"
              onClick={() => setIsConfirmedInfo(false)}
              className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-full border border-neutral-700 transition cursor-pointer"
            >
              정보 다시 수정하기
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-neutral-500 font-medium">
              {guideText}
            </span>
            <button
              type="button"
              onClick={handlePlayerValidateButtonClick}
              className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full transition shadow-lg cursor-pointer flex items-center gap-x-2"
            >
              <span>선수 정보 확인 및 잠금</span>
              <span className="text-xs text-neutral-500 font-bold">→ Step 2</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PlayerInfoStep;

