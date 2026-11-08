import React, { useMemo } from "react";
import { RiErrorWarningLine, RiCheckLine } from "react-icons/ri";
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
  // 종목별 체급 목록을 사전 인덱싱 및 정렬하여 매 렌더링 시 O(N*M) 필터/정렬 비용 제거
  const gradesByCategoryId = useMemo(() => {
    const map = {};
    grades.forEach((grade) => {
      const catId = grade.refCategoryId;
      if (!catId) return;
      if (!map[catId]) {
        map[catId] = [];
      }
      map[catId].push(grade);
    });
    Object.keys(map).forEach((catId) => {
      map[catId].sort(
        (a, b) => (a.contestGradeIndex || 0) - (b.contestGradeIndex || 0)
      );
    });
    return map;
  }, [grades]);

  // 현재 선택된 종목 맵을 사전 인덱싱
  const selectedJoinByCategoryId = useMemo(() => {
    const map = {};
    (invoiceInfo?.joins || []).forEach((join) => {
      if (join.contestCategoryId) {
        map[join.contestCategoryId] = join;
      }
    });
    return map;
  }, [invoiceInfo?.joins]);

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.04)] flex flex-col gap-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] flex items-center gap-x-2.5 tracking-tight">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white text-xs flex items-center justify-center font-bold shadow-sm">
            2
          </span>
          {stepTitle}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChkAllItem((prev) => !prev)}
            className={`text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              !chkAllItem
                ? "bg-indigo-50 text-indigo-600 border-indigo-200 font-bold"
                : "bg-[#F8FAFC] text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {!chkAllItem ? "내 성별 종목만 표시 중" : "전체 성별 종목 표시 중"}
          </button>
          <span className="text-xs sm:text-sm text-amber-800 font-bold bg-amber-50/90 px-3 py-1.5 rounded-lg border border-amber-200/80">
            중복 출전 가능
          </span>
        </div>
      </div>

      {/* 참가비 유의사항 안내 박스 */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start gap-x-3 text-slate-700 text-sm leading-relaxed">
        <RiErrorWarningLine className="text-indigo-600 text-lg flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#0F172A] block mb-0.5">
            참가비용 관련 유의사항
          </span>
          <span className="text-slate-600 text-xs sm:text-sm">
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
            const matchGrades = gradesByCategoryId[cId] || [];
            const selectedJoinInThisCat = selectedJoinByCategoryId[cId];
            const badgeText = getCategoryPriceBadgeText(cType, priceSource);

            return (
              <div
                key={cId}
                className={`p-4 sm:p-5 rounded-xl border transition flex flex-col justify-between gap-y-3.5 ${
                  selectedJoinInThisCat
                    ? "bg-indigo-50/35 border-2 border-[#4F46E5] shadow-[0_4px_16px_rgba(79,70,229,0.10)]"
                    : "bg-[#F8FAFC] border-slate-200/80 hover:border-indigo-200"
                }`}
              >
                <div className="flex items-start justify-between gap-x-2">
                  <div className="flex items-center gap-x-2">
                    {selectedJoinInThisCat && (
                      <span className="w-5 h-5 rounded-md bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white flex items-center justify-center shrink-0">
                        <RiCheckLine className="text-xs" />
                      </span>
                    )}
                    <span className="text-base font-bold text-[#0F172A] tracking-tight break-keep">
                      {cTitle}
                    </span>
                  </div>
                  {badgeText && (
                    <span className="shrink-0 text-xs font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-[5px] border border-indigo-200/80">
                      {badgeText}
                    </span>
                  )}
                </div>

                {matchGrades.length > 0 && (
                  <select
                    id={cId}
                    name={cTitle}
                    value={
                      selectedJoinInThisCat
                        ? `${selectedJoinInThisCat.contestGradeId},${selectedJoinInThisCat.contestGradeTitle},${cType || ""}`
                        : ""
                    }
                    className={`w-full h-12 px-3.5 rounded-xl text-[15px] font-semibold focus:outline-none cursor-pointer transition ${
                      selectedJoinInThisCat
                        ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white border border-[#4F46E5]"
                        : "bg-white border border-slate-200 text-slate-700 focus:border-[#4F46E5]"
                    }`}
                    onChange={handleInvoiceInfo}
                  >
                    <option
                      value=""
                      className="bg-white text-neutral-500 font-medium"
                    >
                      체급을 선택해 주세요 (미참가)
                    </option>
                    {matchGrades.map((grade) => {
                      const {
                        contestGradeTitle: gTitle,
                        contestGradeId: gId,
                      } = grade;

                      return (
                        <option
                          key={gId}
                          value={`${gId},${gTitle},${cType || ""}`}
                          className="bg-white text-[#111111] font-semibold"
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

export default React.memo(CategorySelectStep);
