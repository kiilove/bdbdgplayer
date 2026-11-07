import React from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import { getCategoryPriceBadgeText } from "../../utils/formatUtils";

const CategorySelectStep = ({
  stepTitle = "참가 종목 및 체급 선택",
  chkAllItem,
  setChkAllItem,
  filteredCategorys = [],
  grades = [],
  invoiceInfo,
  priceSource = {},
  handleInvoiceInfo,
  children,
}) => {
  return (
    <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-x-2.5">
          <span className="w-7 h-7 rounded-full bg-white text-black text-xs flex items-center justify-center font-black">
            2
          </span>
          {stepTitle}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChkAllItem((prev) => !prev)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full border transition cursor-pointer ${
              !chkAllItem
                ? "bg-white text-black border-white"
                : "bg-neutral-900 text-neutral-300 border-neutral-700 hover:border-neutral-500"
            }`}
          >
            {!chkAllItem ? "내 성별 종목만 표시 중" : "내 성별 종목만 보기"}
          </button>
          <span className="text-xs text-neutral-400 font-bold bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
            중복 신청 가능
          </span>
        </div>
      </div>

      {/* 참가비 유의사항 안내 박스 */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-start gap-x-3 text-neutral-300 text-xs leading-relaxed">
        <RiErrorWarningLine className="text-neutral-400 text-lg flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white block mb-0.5">
            참가비용 관련 유의사항
          </span>
          <span>
            학생부, 피트니스 챌린지와 보디빌딩 중복 출전의 경우 정확한 참가비용은 경기도보디빌딩협회를 통해 안내 받으시기 바랍니다.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCategorys.length > 0 &&
          filteredCategorys.map((category) => {
            const {
              contestCategoryTitle: cTitle,
              contestCategoryId: cId,
              contestCategoryPriceType: cType,
            } = category;
            const matchGrades = grades.filter(
              (grade) => grade.refCategoryId === cId
            );

            const selectedJoinInThisCat = invoiceInfo?.joins?.find(
              (join) => join.contestCategoryId === cId
            );

            const badgeText = getCategoryPriceBadgeText(cType, priceSource);

            return (
              <div
                key={cId}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-y-3 ${
                  selectedJoinInThisCat
                    ? "bg-[#1E1E1E] border-white shadow-lg shadow-white/5"
                    : "bg-[#181818] border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between min-h-[36px] gap-x-2">
                  <span className="text-sm font-black text-white tracking-tight break-keep">
                    {cTitle}
                  </span>
                  {badgeText && (
                    <span className="shrink-0 text-[10px] font-bold text-neutral-300 bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
                      {badgeText}
                    </span>
                  )}
                </div>

                {matchGrades?.length > 0 && (
                  <select
                    id={cId}
                    name={cTitle}
                    value={
                      selectedJoinInThisCat
                        ? `${selectedJoinInThisCat.contestGradeId},${selectedJoinInThisCat.contestGradeTitle},${cType || ""}`
                        : ""
                    }
                    className="w-full px-3 py-2.5 bg-[#121212] border border-neutral-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-white cursor-pointer"
                    onChange={(e) => handleInvoiceInfo(e)}
                  >
                    <option value="">체급을 선택해 주세요 (미참가)</option>
                    {matchGrades
                      .sort(
                        (a, b) => a.contestGradeIndex - b.contestGradeIndex
                      )
                      .map((grade) => {
                        const {
                          contestGradeTitle: gTitle,
                          contestGradeId: gId,
                        } = grade;

                        return (
                          <option
                            key={gId}
                            value={`${gId},${gTitle},${cType || ""}`}
                          >
                            {gTitle}
                          </option>
                        );
                      })}
                  </select>
                )}
              </div>
            );
          })}
      </div>

      {children}
    </div>
  );
};

export default CategorySelectStep;

