import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import {
  RiPrinterLine,
  RiCloseLine,
  RiFileTextLine,
  RiCheckDoubleLine,
  RiTimeLine,
} from "react-icons/ri";
import AppDrawer from "../components/common/AppDrawer";
import { fetchFallbackNoticeForPrint } from "../services/contestService";

const InvoicePrintModal = ({
  invoiceInfo,
  contestInfo = {},
  noticeInfo = {},
  onClose,
}) => {
  const printAreaRef = useRef(null);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [submitTarget, setSubmitTarget] = useState("");
  const [fetchedNotice, setFetchedNotice] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (
      noticeInfo?.contestAssociate ||
      invoiceInfo?.contestAssociate ||
      contestInfo?.contestAssociate
    ) {
      return undefined;
    }

    fetchFallbackNoticeForPrint({ invoiceInfo, contestInfo })
      .then((notice) => {
        if (isMounted && notice) {
          setFetchedNotice(notice);
        }
      })
      .catch(() => {
        // ignore lookup errors
      });

    return () => {
      isMounted = false;
    };
  }, [invoiceInfo, contestInfo, noticeInfo]);

  if (!invoiceInfo) return null;

  const receiptNo =
    invoiceInfo.docuId ||
    (invoiceInfo.id ? invoiceInfo.id.slice(0, 10).toUpperCase() : "-");

  // 주최 (contestPromoter: 예 - 화성특례시체육회)
  const hostOrg =
    noticeInfo.contestPromoter ||
    fetchedNotice.contestPromoter ||
    invoiceInfo.contestPromoter ||
    invoiceInfo.conntestPromoter ||
    contestInfo.contestPromoter ||
    "-";

  // 주관 (contestAssociate: 예 - 화성특례시보디빌딩협회)
  const organizerOrg =
    noticeInfo.contestAssociate ||
    fetchedNotice.contestAssociate ||
    invoiceInfo.contestAssociate ||
    contestInfo.contestAssociate ||
    "";

  // 상단 배지 및 하단 발급처는 주관 협회(보디빌딩협회) 우선 표시
  const primaryAssociation =
    organizerOrg || (hostOrg !== "-" ? hostOrg : "보디빌딩협회");

  const contestTitle =
    invoiceInfo.contestTitle ||
    noticeInfo.contestTitle ||
    fetchedNotice.contestTitle ||
    contestInfo.contestTitle ||
    "-";
  const contestDate =
    invoiceInfo.contestDate ||
    noticeInfo.contestDate ||
    fetchedNotice.contestDate ||
    contestInfo.contestDate ||
    "";
  const formattedContestDate = contestDate
    ? dayjs(contestDate).isValid()
      ? dayjs(contestDate).format("YYYY년 MM월 DD일")
      : contestDate
    : "-";
  const contestLocation =
    invoiceInfo.contestLocation ||
    noticeInfo.contestLocation ||
    fetchedNotice.contestLocation ||
    contestInfo.contestLocation ||
    "-";
  const bankName =
    invoiceInfo.contestBankName ||
    noticeInfo.contestBankName ||
    fetchedNotice.contestBankName ||
    contestInfo.contestBankName ||
    "";
  const accountNumber =
    invoiceInfo.contestAccountNumber ||
    noticeInfo.contestAccountNumber ||
    fetchedNotice.contestAccountNumber ||
    contestInfo.contestAccountNumber ||
    "";
  const accountOwner =
    invoiceInfo.contestAccountOwner ||
    noticeInfo.contestAccountOwner ||
    fetchedNotice.contestAccountOwner ||
    contestInfo.contestAccountOwner ||
    "";
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
    const safeDocTitle = String(docTitle)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
    const originalTitle = document.title;
    document.title = docTitle;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>${safeDocTitle}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 0mm;
          }
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            padding: 12mm;
            font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Malgun Gothic", "맑은 고딕", sans-serif;
            color: #222222;
            background: #ffffff;
            line-height: 1.45;
          }
          .receipt-sheet {
            width: 100%;
            max-width: 186mm;
            margin: 0 auto;
            border: 1px solid #555555;
            padding: 24px 28px;
            background: #ffffff;
          }
          .receipt-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1.5px solid #333333;
            padding-bottom: 14px;
            margin-bottom: 20px;
          }
          .promoter-badge {
            display: inline-block;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.04em;
            padding: 3px 9px;
            background: #ffffff;
            color: #333333;
            border: 1px solid #666666;
            border-radius: 4px;
            margin-bottom: 8px;
          }
          .receipt-main-title {
            font-size: 22px;
            font-weight: 800;
            margin: 0;
            letter-spacing: -0.02em;
            color: #111111;
          }
          .receipt-sub-title {
            font-size: 10.5px;
            font-weight: 500;
            color: #666666;
            margin-top: 3px;
            letter-spacing: 0.08em;
          }
          .receipt-meta-box {
            text-align: right;
            font-size: 11.5px;
          }
          .receipt-no-box {
            border: 1px solid #666666;
            padding: 5px 12px;
            border-radius: 4px;
            background: #ffffff;
            margin-bottom: 5px;
            display: inline-block;
          }
          .receipt-no-label {
            font-size: 9.5px;
            font-weight: 600;
            color: #666666;
            display: block;
          }
          .receipt-no-value {
            font-size: 14px;
            font-weight: 800;
            color: #111111;
            letter-spacing: 0.04em;
          }
          .section-block {
            margin-bottom: 18px;
          }
          .section-title {
            font-size: 13px;
            font-weight: 700;
            color: #111111;
            margin: 0 0 7px 0;
            padding-bottom: 4px;
            border-bottom: 1px solid #555555;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .info-table th,
          .info-table td {
            border: 1px solid #999999;
            padding: 8px 11px;
            text-align: left;
            vertical-align: middle;
            background: #ffffff;
          }
          .info-table th {
            font-weight: 700;
            color: #333333;
            width: 18%;
            white-space: nowrap;
          }
          .info-table td {
            font-weight: 500;
            color: #111111;
            width: 32%;
          }
          .joins-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          .joins-table th {
            background: #ffffff;
            color: #111111;
            font-weight: 700;
            padding: 8px 11px;
            border: 1px solid #999999;
            border-bottom: 1.5px solid #333333;
            text-align: center;
          }
          .joins-table td {
            border: 1px solid #999999;
            padding: 9px 11px;
            font-weight: 500;
            color: #111111;
            background: #ffffff;
          }
          .joins-table td.center {
            text-align: center;
          }
          .payment-box {
            border: 1px solid #666666;
            border-radius: 4px;
            background: #ffffff;
            padding: 12px 15px;
            margin-bottom: 18px;
          }
          .payment-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 0;
          }
          .payment-row + .payment-row {
            border-top: 1px dashed #999999;
            margin-top: 6px;
            padding-top: 9px;
          }
          .price-amount {
            font-size: 16px;
            font-weight: 800;
            color: #111111;
          }
          .status-badge {
            display: inline-block;
            padding: 3px 9px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
            background: #ffffff;
            color: #222222;
            border: 1px solid #666666;
          }
          .notice-box {
            background: #ffffff;
            border: 1px solid #999999;
            border-radius: 4px;
            padding: 11px 14px;
            font-size: 11px;
            color: #444444;
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
            border-top: 1px solid #999999;
          }
          .footer-statement {
            font-size: 12.5px;
            font-weight: 700;
            color: #111111;
            margin: 0 0 5px 0;
          }
          .footer-date {
            font-size: 11px;
            color: #555555;
            margin: 0 0 10px 0;
          }
          .footer-issuer {
            font-size: 15px;
            font-weight: 800;
            letter-spacing: 0.08em;
            color: #111111;
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
      const printWin = iframe.contentWindow;
      let restored = false;
      const cleanupPrint = () => {
        if (restored) return;
        restored = true;
        document.title = originalTitle;
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      if (printWin) {
        printWin.onafterprint = cleanupPrint;
        printWin.focus();
        printWin.print();
      }
      setTimeout(cleanupPrint, 1500);
    }, 250);
  };

  return (
    <AppDrawer open={true} onClose={onClose} size="xl">
      <div className="w-full h-full bg-[#F5F5F7] flex flex-col overflow-y-auto">
        {/* Top Sticky Drawer Action Bar */}
        <div className="w-full bg-white border-b border-neutral-200 px-5 py-4 flex flex-col gap-3.5 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-[#111111]">
              <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold shrink-0">
                <RiFileTextLine className="text-lg" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-extrabold leading-tight tracking-tight text-[#111111]">
                  대회 참가신청 접수증 (A4 인쇄 / PDF)
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                  인쇄 창에서 대상 프린터를{" "}
                  <strong className="text-[#111111] font-bold">
                    'PDF로 저장'
                  </strong>
                  으로 선택하면 PDF 파일로 저장됩니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-[#F5F5F7] hover:bg-neutral-200 text-neutral-600 hover:text-[#111111] flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <RiCloseLine className="text-xl" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-neutral-100">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <input
                type="text"
                value={submitTarget}
                onChange={(e) => setSubmitTarget(e.target.value)}
                placeholder="제출처 입력 (예: OO학교, OO회사 - 선택)"
                className="px-4 py-2.5 bg-[#F5F5F7] border border-neutral-200 focus:bg-white focus:border-[#111111] rounded-xl text-sm text-[#111111] placeholder-neutral-400 focus:outline-none w-full sm:w-64 transition"
              />

              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#111111] bg-[#F5F5F7] border border-neutral-200 px-4 py-2.5 rounded-xl cursor-pointer select-none hover:bg-neutral-200/70 transition">
                <input
                  type="checkbox"
                  checked={showPaymentInfo}
                  onChange={(e) => setShowPaymentInfo(e.target.checked)}
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                />
                <span>참가비/계좌 표시</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2.5 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
            >
              <RiPrinterLine className="text-base" />
              <span>A4 인쇄 / PDF 저장</span>
            </button>
          </div>
        </div>

        {/* A4 Sheet Preview Container */}
        <div className="p-4 sm:p-6 flex-1 flex justify-center items-start">
          <div className="w-full max-w-[210mm] bg-white text-gray-900 rounded-2xl border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.06)] p-4 sm:p-8 overflow-x-auto">
            <div ref={printAreaRef}>
              <div className="receipt-sheet border border-gray-500 p-5 sm:p-7 bg-white text-gray-900">
                {/* Header */}
                <div className="receipt-top-bar flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-gray-700 pb-4 mb-5">
                  <div>
                    <span className="promoter-badge inline-block text-[11px] font-bold tracking-wider px-2.5 py-0.5 bg-white text-gray-800 border border-gray-500 rounded mb-2">
                      {primaryAssociation}
                    </span>
                    <h1 className="receipt-main-title text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      대회 참가신청 접수증
                    </h1>
                    <p className="receipt-sub-title text-[10.5px] font-medium text-gray-500 tracking-widest mt-0.5">
                      OFFICIAL COMPETITION ENTRY CONFIRMATION
                    </p>
                  </div>

                  <div className="receipt-meta-box text-left sm:text-right w-full sm:w-auto">
                    <div className="receipt-no-box border border-gray-500 bg-white px-3 py-1.5 rounded inline-block mb-1.5">
                      <span className="receipt-no-label text-[10px] font-semibold text-gray-500 block">
                        접수번호 (RECEIPT NO.)
                      </span>
                      <span className="receipt-no-value text-sm sm:text-base font-extrabold text-gray-900 tracking-wider">
                        {receiptNo}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-600 font-medium">
                      <div>접수일시: {createDate}</div>
                      {editDate && <div>최종수정: {editDate}</div>}
                    </div>
                  </div>
                </div>

                {/* Section 1: Contest Info */}
                <div className="section-block mb-5">
                  <div className="section-title text-xs sm:text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-500">
                    <span>1. 참가 대회 정보</span>
                  </div>
                  <table className="info-table w-full border-collapse text-xs">
                    <tbody>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          대회명
                        </th>
                        <td
                          colSpan={3}
                          className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-900"
                        >
                          {contestTitle}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          대회일자
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900 w-3/10">
                          {formattedContestDate}
                        </td>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          개최장소
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900 w-3/10">
                          {contestLocation}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          주최
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900 w-3/10">
                          {hostOrg}
                        </td>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          주관
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900 w-3/10">
                          {organizerOrg || primaryAssociation}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Section 2: Player Info */}
                <div className="section-block mb-5">
                  <div className="section-title text-xs sm:text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-500">
                    <span>2. 참가 선수 인적사항</span>
                  </div>
                  <table className="info-table w-full border-collapse text-xs">
                    <tbody>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          성명
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-900 w-3/10">
                          {invoiceInfo.playerName || "-"}
                        </td>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700 w-1/5">
                          성별
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900 w-3/10">
                          {genderLabel}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700">
                          생년월일
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900">
                          {invoiceInfo.playerBirth || "-"}
                        </td>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700">
                          연락처
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900">
                          {invoiceInfo.playerTel || "-"}
                        </td>
                      </tr>
                      <tr>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700">
                          소속 (팀/체육관)
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900">
                          {invoiceInfo.playerGym || "무소속"}
                        </td>
                        <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700">
                          이메일
                        </th>
                        <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900">
                          {invoiceInfo.playerEmail || "-"}
                        </td>
                      </tr>
                      {submitTarget.trim() && (
                        <tr>
                          <th className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-700">
                            제출처 (용도)
                          </th>
                          <td
                            colSpan={3}
                            className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-900"
                          >
                            {submitTarget.trim()}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section 3: Joins Table */}
                <div className="section-block mb-5">
                  <div className="section-title text-xs sm:text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-500 flex items-center justify-between">
                    <span>3. 신청 종목 및 체급 내역</span>
                    <span className="text-xs font-semibold text-gray-600">
                      총 {joins.length}개 종목
                    </span>
                  </div>
                  <table className="joins-table w-full border-collapse text-xs">
                    <thead>
                      <tr>
                        <th className="bg-white text-gray-900 font-bold px-3 py-2 border border-gray-400 border-b-2 border-b-gray-700 text-center w-14">
                          순번
                        </th>
                        <th className="bg-white text-gray-900 font-bold px-3 py-2 border border-gray-400 border-b-2 border-b-gray-700 text-left">
                          참가 종목 (Category)
                        </th>
                        <th className="bg-white text-gray-900 font-bold px-3 py-2 border border-gray-400 border-b-2 border-b-gray-700 text-left">
                          신청 체급 (Division / Grade)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {joins.length > 0 ? (
                        joins.map((join, index) => (
                          <tr key={index}>
                            <td className="center border border-gray-400 bg-white px-3 py-2 text-center font-medium text-gray-700">
                              {index + 1}
                            </td>
                            <td className="border border-gray-400 bg-white px-3 py-2 font-bold text-gray-900">
                              {join.contestCategoryTitle || "-"}
                            </td>
                            <td className="border border-gray-400 bg-white px-3 py-2 font-medium text-gray-900">
                              {join.contestGradeTitle || "-"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={3}
                            className="center border border-gray-400 bg-white px-3 py-6 text-center text-gray-500"
                          >
                            선택된 참가 종목이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Section 4: Payment & Bank Account Info */}
                {showPaymentInfo && (
                  <div className="section-block mb-5">
                    <div className="section-title text-xs sm:text-sm font-bold text-gray-900 mb-2 pb-1 border-b border-gray-500">
                      <span>4. 참가비 및 입금 계좌 정보</span>
                    </div>
                    <div className="payment-box border border-gray-500 rounded bg-white p-3.5 text-xs">
                      <div className="payment-row flex flex-wrap justify-between items-center gap-2 py-1">
                        <span className="font-bold text-gray-700 text-xs sm:text-sm">
                          총 참가비 합계
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="status-badge px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-gray-800 border border-gray-500 flex items-center gap-1">
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
                          <span className="price-amount text-base sm:text-lg font-extrabold text-gray-900">
                            {totalPrice.toLocaleString()} 원
                          </span>
                        </div>
                      </div>

                      {(bankName || accountNumber || accountOwner) && (
                        <div className="payment-row flex flex-wrap justify-between items-center gap-2 border-t border-dashed border-gray-400 mt-2 pt-2">
                          <span className="font-semibold text-gray-600">
                            지정 입금 계좌
                          </span>
                          <span className="font-bold text-gray-900">
                            {bankName} {accountNumber}{" "}
                            {accountOwner ? `(예금주: ${accountOwner})` : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Notice Box */}
                <div className="notice-box bg-white border border-gray-400 rounded p-3 text-[11px] text-gray-600 mb-6">
                  <strong className="font-bold text-gray-800 block mb-1">
                    [증빙서류 안내]
                  </strong>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      본 문서는 상기 선수가 위 대회에 참가 신청(접수)하였음을 증명하는 공식 확인서(학교·회사·소속기관 제출용)입니다.
                    </li>
                    <li>
                      기재된 접수번호 및 신청 내역에 대한 사실 확인이 필요한 경우 대회 주관 협회로 문의하시기 바랍니다.
                    </li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="receipt-footer text-center pt-4 border-t border-gray-400">
                  <p className="footer-statement text-xs sm:text-sm font-bold text-gray-900 mb-1">
                    위 선수가 본 대회에 참가 신청하였음을 확인합니다.
                  </p>
                  <p className="footer-date text-[11px] text-gray-500 mb-2.5">
                    발급일시: {printDate}
                  </p>
                  <p className="footer-issuer text-sm sm:text-base font-extrabold text-gray-900 tracking-widest">
                    {primaryAssociation}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppDrawer>
  );
};

export default InvoicePrintModal;
