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
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#111111] flex items-center gap-x-2.5 tracking-tight">
          <span className="w-7 h-7 rounded-full bg-[#111111] text-white text-xs flex items-center justify-center font-bold">
            2
          </span>
          {stepTitle}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChkAllItem((prev) => !prev)}
            className={`text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-full border transition cursor-pointer ${
              !chkAllItem
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-[#F5F5F7] text-neutral-700 border-neutral-200 hover:bg-neutral-200/70"
            }`}
          >
            {!chkAllItem ? "내 성별 종목만 표시 중" : "전체 성별 종목 표시 중"}
          </button>
          <span className="text-xs sm:text-sm text-neutral-600 font-semibold bg-[#F5F5F7] px-3.5 py-1.5 rounded-full border border-neutral-200/80">
            중복 출전 가능
          </span>
        </div>
      </div>

      {/* 참가비 유의사항 안내 박스 */}
      <div className="bg-[#F5F5F7] border border-neutral-200/80 rounded-2xl p-4 flex items-start gap-x-3 text-neutral-700 text-sm leading-relaxed">
        <RiErrorWarningLine className="text-[#111111] text-lg flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#111111] block mb-0.5">
            참가비용 관련 유의사항
          </span>
          <span className="text-neutral-600 text-xs sm:text-sm">
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
                className={`p-4 sm:p-5 rounded-2xl border transition flex flex-col justify-between gap-y-3.5 ${
                  selectedJoinInThisCat
                    ? "bg-white border-2 border-[#111111] shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                    : "bg-[#F5F5F7]/70 border-neutral-200/90 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-start justify-between gap-x-2">
                  <div className="flex items-center gap-x-2">
                    {selectedJoinInThisCat && (
                      <span className="w-5 h-5 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0">
                        <RiCheckLine className="text-xs" />
                      </span>
                    )}
                    <span className="text-base font-bold text-[#111111] tracking-tight break-keep">
                      {cTitle}
                    </span>
                  </div>
                  {badgeText && (
                    <span className="shrink-0 text-xs font-semibold text-neutral-600 bg-white px-2.5 py-1 rounded-full border border-neutral-200">
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
                        ? "bg-[#111111] text-white border border-[#111111]"
                        : "bg-white border border-neutral-200 text-neutral-700 focus:border-[#111111]"
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
