import React from "react";
import { RotatingLines } from "react-loader-spinner";
import {
  RiTrophyLine,
  RiUserLine,
  RiCheckDoubleLine,
  RiCloseLine,
  RiErrorWarningLine,
} from "react-icons/ri";

const ConfirmModalLayout = ({
  title = "참가신청 내용 확인",
  subtitle = "신청 정보를 최종 확인 후 접수를 완료해 주세요",
  confirmButtonText = "신청서 접수 완료",
  invoiceInfo = {},
  invoicePrice = 0,
  isLoading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <div className="w-full h-full bg-white p-6 sm:p-8 flex flex-col justify-between text-[#0F172A] overflow-y-auto">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-[0_3px_10px_rgba(79,70,229,0.24)]">
              <RiCheckDoubleLine />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {subtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#0F172A] flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        <div className="flex flex-col gap-y-4">
          {/* Contest Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-2 text-sm font-bold text-[#0F172A] border-b border-slate-200/80 pb-2.5">
              <RiTrophyLine className="text-base text-[#4F46E5]" />
              <span>참가 대회 정보</span>
            </div>
            <div className="grid grid-cols-1 gap-y-2.5 text-sm">
              <div className="flex justify-between items-start gap-4">
                <span className="text-slate-500 font-medium shrink-0">
                  대회명
                </span>
                <span className="text-[#0F172A] font-bold text-right break-keep">
                  {invoiceInfo?.contestTitle}
                </span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-500 font-medium shrink-0">
                  대회일자
                </span>
                <span className="text-[#0F172A] font-semibold">
                  {invoiceInfo?.contestDate}
                </span>
              </div>
              {invoiceInfo?.contestLocation && (
                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500 font-medium shrink-0">
                    개최장소
                  </span>
                  <span className="text-[#0F172A] font-semibold text-right break-keep">
                    {invoiceInfo?.contestLocation}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200 mt-1">
                <span className="text-[#0F172A] font-bold">총 참가비 합계</span>
                <span className="text-xl font-extrabold text-[#4F46E5]">
                  {Number(invoicePrice || 0).toLocaleString()} 원
                </span>
              </div>
            </div>
          </div>

          {/* Player Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-y-3">
            <div className="flex items-center gap-x-2 text-sm font-bold text-[#0F172A] border-b border-slate-200/80 pb-2.5">
              <RiUserLine className="text-base text-[#4F46E5]" />
              <span>선수 인적사항</span>
            </div>
            <div className="grid grid-cols-2 gap-3.5 text-sm">
              <div>
                <span className="text-slate-500 text-xs font-medium block mb-0.5">
                  이름
                </span>
                <span className="text-[#0F172A] font-bold">
                  {invoiceInfo?.playerName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-medium block mb-0.5">
                  연락처
                </span>
                <span className="text-[#0F172A] font-bold">
                  {invoiceInfo?.playerTel}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-medium block mb-0.5">
                  생년월일
                </span>
                <span className="text-[#0F172A] font-bold">
                  {invoiceInfo?.playerBirth}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-xs font-medium block mb-0.5">
                  소속
                </span>
                <span className="text-[#0F172A] font-bold">
                  {invoiceInfo?.playerGym || "무소속"}
                </span>
              </div>
            </div>
          </div>

          {/* Joins Info Card */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 flex flex-col gap-y-3">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="text-sm font-bold text-[#0F172A] flex items-center gap-x-1.5">
                <RiCheckDoubleLine className="text-base text-[#4F46E5]" />
                참가 신청 종목
              </span>
              <span className="text-xs font-bold text-[#4F46E5] bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-[5px]">
                총 {invoiceInfo.joins?.length || 0}개 종목
              </span>
            </div>

            {invoiceInfo.joins?.length > 0 ? (
              <div className="flex flex-col gap-y-2 max-h-56 overflow-y-auto pr-1">
                {invoiceInfo.joins.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white border border-slate-200/80 rounded-lg p-3.5 text-sm"
                  >
                    <div className="flex items-center gap-x-2.5">
                      <span className="w-5 h-5 rounded-[5px] bg-indigo-50 text-[#4F46E5] text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-[#0F172A]">
                        {item.contestCategoryTitle}
                      </span>
                    </div>
                    <span className="font-semibold text-[#4F46E5] bg-indigo-50/70 px-2.5 py-0.5 rounded-[5px] text-xs border border-indigo-100">
                      {item.contestGradeTitle}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-sm text-slate-500 font-medium text-center py-4 block">
                참가 신청 종목이 없습니다.
              </span>
            )}
          </div>

          {/* 참가비 유의사항 안내 박스 */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start gap-x-2.5 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <RiErrorWarningLine className="text-[#4F46E5] text-base flex-shrink-0 mt-0.5" />
            <span>
              학생부, 피트니스 챌린지와 보디빌딩 중복 출전의 경우 정확한 참가비용은 경기도보디빌딩협회를 통해 안내 받으시기 바랍니다.
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-x-3 mt-6 pt-4 border-t border-slate-100">
        {!isLoading && (
          <button
            type="button"
            className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer text-center"
            onClick={onClose}
          >
            돌아가기
          </button>
        )}

        {isLoading ? (
          <button
            type="button"
            className="flex-1 py-4 bg-[#4F46E5] text-white font-bold text-sm rounded-xl flex justify-center items-center cursor-not-allowed opacity-90"
            disabled
          >
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="20"
              visible={true}
            />
          </button>
        ) : (
          <button
            type="button"
            className="flex-1 py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-sm rounded-xl transition shadow-[0_6px_18px_rgba(79,70,229,0.28)] cursor-pointer text-center"
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConfirmModalLayout;
