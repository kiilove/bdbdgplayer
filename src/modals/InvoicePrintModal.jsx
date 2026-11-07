import React, { useRef } from "react";
import dayjs from "dayjs";
import {
  RiPrinterLine,
  RiCloseLine,
  RiFileTextLine,
  RiCheckDoubleLine,
  RiTimeLine,
} from "react-icons/ri";

const InvoicePrintModal = ({ invoiceInfo, contestInfo = {}, onClose }) => {
  const printAreaRef = useRef(null);

  if (!invoiceInfo) return null;

  const receiptNo =
    invoiceInfo.docuId ||
    (invoiceInfo.id ? invoiceInfo.id.slice(0, 10).toUpperCase() : "-");
  const promoter =
    invoiceInfo.contestPromoter ||
    invoiceInfo.conntestPromoter ||
    contestInfo.contestPromoter ||
    contestInfo.contestAssociate ||
    "보디빌딩협회";
  const contestTitle =
    invoiceInfo.contestTitle || contestInfo.contestTitle || "-";
  const contestDate = invoiceInfo.contestDate || contestInfo.contestDate || "";
  const formattedContestDate = contestDate
    ? dayjs(contestDate).isValid()
      ? dayjs(contestDate).format("YYYY년 MM월 DD일")
      : contestDate
    : "-";
  const contestLocation =
    invoiceInfo.contestLocation || contestInfo.contestLocation || "-";
  const bankName =
    invoiceInfo.contestBankName || contestInfo.contestBankName || "";
  const accountNumber =
    invoiceInfo.contestAccountNumber || contestInfo.contestAccountNumber || "";
  const accountOwner =
    invoiceInfo.contestAccountOwner || contestInfo.contestAccountOwner || "";
  const totalPrice =
    invoiceInfo.contestPriceSum !== undefined
      ? Number(invoiceInfo.contestPriceSum)
      : 0;
  const genderLabel =
    invoiceInfo.playerGender === "m" || invoiceInfo.playerGender === "남"
      ? "남자"
      : invoiceInfo.playerGender === "f" || invoiceInfo.playerGender === "여"
      ? "여자"
      : "-";
  const joins = Array.isArray(invoiceInfo.joins) ? invoiceInfo.joins : [];
  const createDate = invoiceInfo.invoiceCreateAt || "-";
  const editDate = invoiceInfo.invoiceEditAt || "";
  const printDate = dayjs().format("YYYY년 MM월 DD일 HH:mm");

  const handlePrint = () => {
    const printContents = printAreaRef.current?.innerHTML;
    if (!printContents) return;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const docTitle = `접수증_${contestTitle}_${invoiceInfo.playerName || "선수"}`;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>${docTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 12mm;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0;
            padding: 0;
            font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", sans-serif;
            color: #111827;
            background: #ffffff;
            line-height: 1.45;
          }
          .receipt-sheet {
            width: 100%;
            max-width: 186mm;
            margin: 0 auto;
            border: 2px solid #111827;
            padding: 24px 28px;
            background: #ffffff;
          }
          .receipt-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #111827;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .promoter-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.06em;
            padding: 4px 10px;
            background: #111827;
            color: #ffffff;
            border-radius: 4px;
            margin-bottom: 8px;
          }
          .receipt-main-title {
            font-size: 24px;
            font-weight: 900;
            margin: 0;
            letter-spacing: -0.02em;
            color: #111827;
          }
          .receipt-sub-title {
            font-size: 11px;
            font-weight: 600;
            color: #6b7280;
            margin-top: 3px;
            letter-spacing: 0.08em;
          }
          .receipt-meta-box {
            text-align: right;
            font-size: 12px;
          }
          .receipt-no-box {
            border: 1.5px solid #111827;
            padding: 6px 12px;
            border-radius: 6px;
            background: #f9fafb;
            margin-bottom: 6px;
            display: inline-block;
          }
          .receipt-no-label {
            font-size: 10px;
            font-weight: 700;
            color: #6b7280;
            display: block;
          }
          .receipt-no-value {
            font-size: 15px;
            font-weight: 900;
            color: #111827;
            letter-spacing: 0.04em;
          }
          .section-block {
            margin-bottom: 18px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 800;
            color: #111827;
            margin: 0 0 8px 0;
            padding-left: 8px;
            border-left: 4px solid #111827;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
          }
          .info-table th,
          .info-table td {
            border: 1px solid #d1d5db;
            padding: 9px 12px;
            text-align: left;
            vertical-align: middle;
          }
          .info-table th {
            background: #f3f4f6;
            font-weight: 800;
            color: #374151;
            width: 18%;
            white-space: nowrap;
          }
          .info-table td {
            font-weight: 600;
            color: #111827;
            width: 32%;
          }
          .joins-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
          }
          .joins-table th {
            background: #111827;
            color: #ffffff;
            font-weight: 800;
            padding: 9px 12px;
            border: 1px solid #111827;
            text-align: center;
          }
          .joins-table td {
            border: 1px solid #d1d5db;
            padding: 10px 12px;
            font-weight: 700;
            color: #111827;
          }
          .joins-table td.center {
            text-align: center;
          }
          .payment-box {
            border: 1.5px solid #111827;
            border-radius: 6px;
            background: #f9fafb;
            padding: 14px 16px;
            margin-bottom: 18px;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
          }
          .payment-row + .payment-row {
            border-top: 1px dashed #d1d5db;
            margin-top: 6px;
            padding-top: 10px;
          }
          .price-amount {
            font-size: 18px;
            font-weight: 900;
            color: #111827;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 11.5px;
            font-weight: 800;
          }
          .status-paid {
            background: #111827;
            color: #ffffff;
          }
          .status-unpaid {
            background: #e5e7eb;
            color: #374151;
            border: 1px solid #9ca3af;
          }
          .notice-box {
            background: #f3f4f6;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px 14px;
            font-size: 11px;
            color: #4b5563;
            margin-bottom: 20px;
          }
          .notice-box ul {
            margin: 4px 0 0 0;
            padding-left: 16px;
          }
          .notice-box li {
            margin-bottom: 3px;
          }
          .receipt-footer {
            text-align: center;
            padding-top: 14px;
            border-top: 1px solid #d1d5db;
          }
          .footer-statement {
            font-size: 13px;
            font-weight: 800;
            color: #111827;
            margin: 0 0 6px 0;
          }
          .footer-date {
            font-size: 11.5px;
            color: #6b7280;
            margin: 0 0 12px 0;
          }
          .footer-issuer {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 0.08em;
            color: #111827;
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${printContents}
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-6">
      {/* Top Action Control Bar */}
      <div className="w-full max-w-[210mm] bg-[#181818] border border-neutral-700 rounded-2xl px-4 py-3.5 mb-4 flex flex-wrap items-center justify-between gap-3 shadow-2xl sticky top-2 z-10">
        <div className="flex items-center gap-2.5 text-white">
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black">
            <RiFileTextLine className="text-lg" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black leading-tight">
              대회 참가신청 접수증 (A4 / PDF)
            </h3>
            <p className="text-[11px] text-neutral-400">
              인쇄 창에서 대상 프린터를 <strong className="text-white">'PDF로 저장'</strong>으로 선택하면 PDF 파일로 저장됩니다.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-black text-xs sm:text-sm rounded-full shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RiPrinterLine className="text-base" />
            <span>A4 인쇄 / PDF 저장</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-bold text-xs sm:text-sm rounded-full border border-neutral-700 transition flex items-center justify-center gap-1 cursor-pointer"
          >
            <RiCloseLine className="text-base" />
            <span>닫기</span>
          </button>
        </div>
      </div>

      {/* A4 Sheet Preview Container */}
      <div className="w-full max-w-[210mm] bg-white text-gray-900 rounded-xl shadow-2xl p-4 sm:p-8 mb-10 overflow-x-auto">
        <div ref={printAreaRef}>
          <div className="receipt-sheet border-2 border-gray-900 p-5 sm:p-7 bg-white text-gray-900">
            {/* Header */}
            <div className="receipt-top-bar flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-gray-900 pb-4 mb-5">
              <div>
                <span className="promoter-badge inline-block text-[11px] font-extrabold tracking-wider px-2.5 py-1 bg-gray-900 text-white rounded mb-2">
                  {promoter}
                </span>
                <h1 className="receipt-main-title text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  대회 참가신청 접수증
                </h1>
                <p className="receipt-sub-title text-[11px] font-semibold text-gray-500 tracking-widest mt-0.5">
                  OFFICIAL COMPETITION ENTRY CONFIRMATION
                </p>
              </div>

              <div className="receipt-meta-box text-left sm:text-right w-full sm:w-auto">
                <div className="receipt-no-box border border-gray-900 bg-gray-50 px-3 py-1.5 rounded inline-block mb-1.5">
                  <span className="receipt-no-label text-[10px] font-bold text-gray-500 block">
                    접수번호 (RECEIPT NO.)
                  </span>
                  <span className="receipt-no-value text-sm sm:text-base font-black text-gray-900 tracking-wider">
                    {receiptNo}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 font-semibold">
                  <div>접수일시: {createDate}</div>
                  {editDate && <div>최종수정: {editDate}</div>}
                </div>
              </div>
            </div>

            {/* Section 1: Contest Info */}
            <div className="section-block mb-5">
              <div className="section-title text-xs sm:text-sm font-extrabold text-gray-900 mb-2 pl-2 border-l-4 border-gray-900">
                <span>1. 참가 대회 정보</span>
              </div>
              <table className="info-table w-full border-collapse text-xs">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700 w-1/5">
                      대회명
                    </th>
                    <td
                      colSpan={3}
                      className="border border-gray-300 px-3 py-2.5 font-bold text-gray-900"
                    >
                      {contestTitle}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700 w-1/5">
                      대회일자
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 w-3/10">
                      {formattedContestDate}
                    </td>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700 w-1/5">
                      주관/주최
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 w-3/10">
                      {promoter}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700">
                      개최장소
                    </th>
                    <td
                      colSpan={3}
                      className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900"
                    >
                      {contestLocation}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 2: Player Info */}
            <div className="section-block mb-5">
              <div className="section-title text-xs sm:text-sm font-extrabold text-gray-900 mb-2 pl-2 border-l-4 border-gray-900">
                <span>2. 참가 선수 인적사항</span>
              </div>
              <table className="info-table w-full border-collapse text-xs">
                <tbody>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700 w-1/5">
                      성명
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-bold text-gray-900 w-3/10">
                      {invoiceInfo.playerName || "-"}
                    </td>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700 w-1/5">
                      성별
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900 w-3/10">
                      {genderLabel}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700">
                      생년월일
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900">
                      {invoiceInfo.playerBirth || "-"}
                    </td>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700">
                      연락처
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900">
                      {invoiceInfo.playerTel || "-"}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700">
                      소속 (팀/체육관)
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900">
                      {invoiceInfo.playerGym || "무소속"}
                    </td>
                    <th className="border border-gray-300 bg-gray-100 px-3 py-2.5 font-extrabold text-gray-700">
                      이메일
                    </th>
                    <td className="border border-gray-300 px-3 py-2.5 font-semibold text-gray-900">
                      {invoiceInfo.playerEmail || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3: Joins Table */}
            <div className="section-block mb-5">
              <div className="section-title text-xs sm:text-sm font-extrabold text-gray-900 mb-2 pl-2 border-l-4 border-gray-900 flex items-center justify-between">
                <span>3. 신청 종목 및 체급 내역</span>
                <span className="text-xs font-bold text-gray-600">
                  총 {joins.length}개 종목
                </span>
              </div>
              <table className="joins-table w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="bg-gray-900 text-white font-extrabold px-3 py-2.5 border border-gray-900 text-center w-14">
                      순번
                    </th>
                    <th className="bg-gray-900 text-white font-extrabold px-3 py-2.5 border border-gray-900 text-left">
                      참가 종목 (Category)
                    </th>
                    <th className="bg-gray-900 text-white font-extrabold px-3 py-2.5 border border-gray-900 text-left">
                      신청 체급 (Division / Grade)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {joins.length > 0 ? (
                    joins.map((join, index) => (
                      <tr key={index}>
                        <td className="center border border-gray-300 px-3 py-2.5 text-center font-bold text-gray-700">
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 px-3 py-2.5 font-extrabold text-gray-900">
                          {join.contestCategoryTitle || "-"}
                        </td>
                        <td className="border border-gray-300 px-3 py-2.5 font-bold text-gray-900">
                          {join.contestGradeTitle || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="center border border-gray-300 px-3 py-6 text-center text-gray-500"
                      >
                        선택된 참가 종목이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Section 4: Payment & Bank Account Info */}
            <div className="section-block mb-5">
              <div className="section-title text-xs sm:text-sm font-extrabold text-gray-900 mb-2 pl-2 border-l-4 border-gray-900">
                <span>4. 참가비 및 입금 계좌 정보</span>
              </div>
              <div className="payment-box border-2 border-gray-900 rounded-lg bg-gray-50 p-4 text-xs">
                <div className="payment-row flex flex-wrap justify-between items-center gap-2 py-1.5">
                  <span className="font-extrabold text-gray-700 text-sm">
                    총 참가비 합계
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`status-badge px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                        invoiceInfo.isPriceCheck
                          ? "status-paid bg-gray-900 text-white"
                          : "status-unpaid bg-gray-200 text-gray-800 border border-gray-400"
                      }`}
                    >
                      {invoiceInfo.isPriceCheck ? (
                        <>
                          <RiCheckDoubleLine />
                          입금확인 완료
                        </>
                      ) : (
                        <>
                          <RiTimeLine />
                          입금 대기중
                        </>
                      )}
                    </span>
                    <span className="price-amount text-lg font-black text-gray-900">
                      {totalPrice.toLocaleString()} 원
                    </span>
                  </div>
                </div>

                {(bankName || accountNumber || accountOwner) && (
                  <div className="payment-row flex flex-wrap justify-between items-center gap-2 border-t border-dashed border-gray-300 mt-2.5 pt-2.5">
                    <span className="font-bold text-gray-600">
                      지정 입금 계좌
                    </span>
                    <span className="font-extrabold text-gray-900">
                      {bankName} {accountNumber}{" "}
                      {accountOwner ? `(예금주: ${accountOwner})` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Box */}
            <div className="notice-box bg-gray-100 border border-gray-200 rounded-lg p-3.5 text-[11px] text-gray-600 mb-6">
              <strong className="font-extrabold text-gray-800 block mb-1">
                [참가자 유의사항 안내]
              </strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>
                  참가비 미입금 시 최종 참가 승인이 보류될 수 있으니 지정된 계좌로 참가자 본인 명의 입금을 권장합니다.
                </li>
                <li>
                  학생부, 피트니스 챌린지와 보디빌딩 중복 출전 등 참가비 특례 대상인 경우 주관 협회를 통해 정확한 참가비를 확인해 주시기 바랍니다.
                </li>
                <li>
                  대회 당일 계측 및 선수 등록 시 신분증과 본 접수증(인쇄본 또는 모바일/PDF 화면)을 지참해 주시기 바랍니다.
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="receipt-footer text-center pt-4 border-t border-gray-300">
              <p className="footer-statement text-xs sm:text-sm font-extrabold text-gray-900 mb-1">
                위와 같이 대회 참가신청이 정상적으로 접수되었음을 확인합니다.
              </p>
              <p className="footer-date text-[11px] text-gray-500 mb-3">
                발급일시: {printDate}
              </p>
              <p className="footer-issuer text-base font-black text-gray-900 tracking-widest">
                {promoter}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePrintModal;

