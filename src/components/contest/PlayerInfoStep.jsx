import React from "react";
import { RiCheckDoubleFill } from "react-icons/ri";

const PlayerInfoStep = ({
  stepTitle = "선수 정보 입력",
  guideText = "입력 정보를 확인한 뒤 아래 버튼을 누르면 2단계 종목 선택이 열립니다.",
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

  const getInputClass = (hasError) => {
    if (isConfirmedInfo) {
      return "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200";
    }
    if (hasError) {
      return "bg-rose-50/50 border-rose-500 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-rose-500/20";
    }
    return "bg-[#F8FAFC] border-slate-200 text-[#0F172A] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-indigo-500/15";
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col gap-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] flex items-center gap-x-2.5 tracking-tight">
          <span className="w-7 h-7 rounded-full bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs flex items-center justify-center font-bold shadow-sm">
            1
          </span>
          {stepTitle}
        </h2>
        <span className="text-xs text-slate-500 font-medium">
          * 모든 항목 필수 입력
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            선수 이름 (실명)
          </label>
          <input
            type="text"
            value={invoiceInfo.playerName || ""}
            name="playerName"
            ref={pNameRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full h-12 px-4 border rounded-xl text-base font-medium transition ${getInputClass(
              playerValidate.playerName
            )}`}
            placeholder="이름을 입력해 주세요"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            성별
          </label>
          <select
            name="playerGender"
            ref={pGenderRef}
            onChange={handleInputs}
            value={invoiceInfo.playerGender || "m"}
            disabled={isConfirmedInfo}
            className={`w-full h-12 px-4 border rounded-xl text-base font-medium transition ${
              isConfirmedInfo
                ? "bg-neutral-100 text-neutral-500 cursor-not-allowed border-neutral-200"
                : "bg-[#F5F5F7] text-[#111111] border-neutral-200 focus:bg-white focus:outline-none focus:border-[#111111] cursor-pointer"
            }`}
          >
            <option value="m">남자</option>
            <option value="f">여자</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            생년월일 (YYYY-MM-DD)
          </label>
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              inputMode="numeric"
              value={invoiceInfo.playerBirth || ""}
              name="playerBirth"
              ref={pBirthRef}
              onChange={handleInputs}
              disabled={isConfirmedInfo}
              className={`w-full h-12 px-4 border rounded-xl text-base font-medium transition ${getInputClass(
                playerValidate.playerBirth
              )}`}
              placeholder="예: 1995-05-20"
            />
            <span className="h-12 px-4 flex items-center justify-center text-sm font-bold text-[#111111] whitespace-nowrap bg-[#F5F5F7] rounded-xl border border-neutral-200">
              {playerAge > 0 ? `만 ${playerAge}세` : "만 -세"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            휴대폰 번호
          </label>
          <input
            type="tel"
            inputMode="numeric"
            value={invoiceInfo.playerTel || ""}
            name="playerTel"
            ref={pTelRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full h-12 px-4 border rounded-xl text-base font-medium transition ${getInputClass(
              playerValidate.playerTel
            )}`}
            placeholder="010-0000-0000"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-neutral-700 mb-2">
            소속 (체육관 / 팀명)
          </label>
          <input
            type="text"
            value={invoiceInfo.playerGym || ""}
            name="playerGym"
            ref={pGymRef}
            onChange={handleInputs}
            disabled={isConfirmedInfo}
            className={`w-full h-12 px-4 border rounded-xl text-base font-medium transition ${getInputClass(
              playerValidate.playerGym
            )}`}
            placeholder="소속 체육관명 또는 '무소속' 입력"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {isConfirmedInfo ? (
          <>
            <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-full border border-emerald-200 flex items-center gap-x-1.5 w-fit">
              <RiCheckDoubleFill className="text-lg" />
              선수 정보 확인 완료
            </span>
            <button
              type="button"
              onClick={() => setIsConfirmedInfo(false)}
              className="px-5 py-2.5 bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] font-semibold text-sm rounded-full border border-neutral-200 transition cursor-pointer"
            >
              선수 정보 다시 수정하기
            </button>
          </>
        ) : (
          <>
            <span className="text-xs sm:text-sm text-neutral-500 font-medium">
              {guideText}
            </span>
            <button
              type="button"
              onClick={handlePlayerValidateButtonClick}
              className="px-6 py-3.5 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm rounded-full transition shadow-[0_6px_18px_rgba(99,102,241,0.28)] cursor-pointer flex items-center justify-center gap-x-2 shrink-0"
            >
              <span>선수 정보 확인 완료</span>
              <span className="text-xs text-indigo-100 font-semibold">
                → 2단계
              </span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(PlayerInfoStep);
