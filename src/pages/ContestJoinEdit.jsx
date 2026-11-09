import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { RiPrinterLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import AppDrawer from "../components/common/AppDrawer";
import ContestHeaderBanner from "../components/contest/ContestHeaderBanner";
import PlayerInfoStep from "../components/contest/PlayerInfoStep";
import CategorySelectStep from "../components/contest/CategorySelectStep";
import JoinCupEditConfirm from "../modals/JoinCupEditConfirm";
import InvoicePrintModal from "../modals/InvoicePrintModal";
import { useContestForm } from "../hooks/useContestForm";
import { fetchInvoiceEditBundle } from "../services/contestService";
import { calculateContestPrice } from "../utils/formatUtils";

const ContestJoinEdit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [contests, setContests] = useState({});
  const [noticeInfo, setNoticeInfo] = useState({});
  const [error, setError] = useState(false);
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false);
  const [printDrawerOpen, setPrintDrawerOpen] = useState(false);

  const params = useParams();
  const navigate = useNavigate();

  const {
    invoiceInfo,
    setInvoiceInfo,
    filteredCategorys,
    grades,
    chkAllItem,
    setChkAllItem,
    playerAge,
    isValidate,
    playerValidate,
    isConfirmedInfo,
    setIsConfirmedInfo,
    refs,
    setCategoriesAndGrades,
    handleInputs,
    handleInvoiceInfo,
    handlePlayerValidateButtonClick,
  } = useContestForm({ initialIsValidate: true });

  useEffect(() => {
    let isMounted = true;

    const loadEditBundle = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const {
          invoice,
          contest,
          notice,
          categories,
          grades: gradeList,
        } = await fetchInvoiceEditBundle(params.invoiceId);
        if (!isMounted) return;
        setInvoiceInfo(invoice);
        setContests(contest);
        setNoticeInfo(notice);
        setCategoriesAndGrades(categories, gradeList);
      } catch {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEditBundle();
    return () => {
      isMounted = false;
    };
  }, [params.invoiceId, setInvoiceInfo, setCategoriesAndGrades]);

  const priceSource = noticeInfo?.contestPriceBasic ? noticeInfo : invoiceInfo;
  const associateName =
    noticeInfo.contestAssociate ||
    invoiceInfo.contestAssociate ||
    contests.contestAssociate ||
    noticeInfo.contestPromoter ||
    invoiceInfo.contestPromoter ||
    contests.contestPromoter ||
    "보디빌딩협회";
  const collectionFileLink =
    noticeInfo.contestCollectionFileLink ||
    invoiceInfo.contestCollectionFileLink ||
    contests.contestCollectionFileLink ||
    "";
  const bankName =
    invoiceInfo.contestBankName || noticeInfo.contestBankName || "";
  const accountNumber =
    invoiceInfo.contestAccountNumber || noticeInfo.contestAccountNumber || "";
  const accountOwner =
    invoiceInfo.contestAccountOwner || noticeInfo.contestAccountOwner || "";

  return (
    <div className="relative min-h-screen bg-[#F6F7F9] text-[#111111] font-sans antialiased pb-28">
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex justify-center items-center">
          <RotatingLines
            strokeColor="#111111"
            strokeWidth="4"
            animationDuration="0.75"
            width="52"
            visible={true}
          />
        </div>
      )}

      {!isLoading && error && (
        <div className="relative z-10 min-h-screen bg-[#F6F7F9] text-[#111111] w-full flex flex-col items-center justify-center p-6 text-center gap-4">
          <p className="text-base text-neutral-600 font-bold">
            신청 내역을 불러올 수 없거나 존재하지 않는 문서입니다.
          </p>
          <button
            type="button"
            onClick={() => navigate("/myprofile")}
            className="px-6 py-3.5 bg-[#111111] text-white font-bold text-sm rounded-xl cursor-pointer"
          >
            내 신청내역으로 돌아가기
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <div className="relative z-10">
          <BottomMenu />
          <Header title="참가신청 내역 및 수정" />

          <AppDrawer
            open={confirmDrawerOpen}
            onClose={() => setConfirmDrawerOpen(false)}
            size="md"
          >
            <JoinCupEditConfirm
              propInvoiceInfo={invoiceInfo}
              prevSetModal={setConfirmDrawerOpen}
            />
          </AppDrawer>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            <ContestHeaderBanner
              associateName={associateName}
              badgeSubtitle="참가신청 수정"
              contestTitle={
                invoiceInfo.contestTitle ||
                noticeInfo.contestTitle ||
                contests.contestTitle
              }
              contestDate={invoiceInfo.contestDate || noticeInfo.contestDate}
              contestLocation={
                invoiceInfo.contestLocation || noticeInfo.contestLocation
              }
              contestPriceBasic={priceSource.contestPriceBasic}
              bankInfo={
                bankName || accountNumber
                  ? {
                      bankName,
                      accountNumber,
                      accountOwner,
                    }
                  : null
              }
              collectionFileLink={collectionFileLink}
              onOpenPrintModal={() => setPrintDrawerOpen(true)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-8 flex flex-col gap-y-6">
                <PlayerInfoStep
                  stepTitle="선수 정보 수정"
                  guideText="입력 정보를 확인한 뒤 아래 버튼을 누르면 종목 변경 단계로 이동합니다."
                  invoiceInfo={invoiceInfo}
                  playerAge={playerAge}
                  playerValidate={playerValidate}
                  isConfirmedInfo={isConfirmedInfo}
                  setIsConfirmedInfo={setIsConfirmedInfo}
                  handleInputs={handleInputs}
                  handlePlayerValidateButtonClick={
                    handlePlayerValidateButtonClick
                  }
                  refs={refs}
                />

                {isValidate && (
                  <CategorySelectStep
                    stepTitle="참가 종목 및 체급 변경"
                    chkAllItem={chkAllItem}
                    setChkAllItem={setChkAllItem}
                    filteredCategorys={filteredCategorys}
                    grades={grades}
                    invoiceInfo={invoiceInfo}
                    priceSource={priceSource}
                    handleInvoiceInfo={handleInvoiceInfo}
                  />
                )}
              </div>

              {/* Right Column: Sticky Summary & Action Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-20 bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-[0_2px_20px_rgba(0,0,0,0.03)] flex flex-col gap-y-5">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#111111] border-b border-neutral-100 pb-3.5 flex items-center justify-between">
                    <span>선택 종목 내역</span>
                    <span className="text-xs font-bold text-[#111111] bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-[4px]">
                      총 {invoiceInfo.joins?.length || 0}개 선택
                    </span>
                  </h3>

                  {invoiceInfo.joins?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-neutral-400 font-medium">
                      참가하실 종목을 선택해 주세요.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-y-2.5 max-h-60 overflow-y-auto pr-1">
                      {invoiceInfo.joins?.map((join, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#FAFAFA] border border-neutral-200/70 rounded-xl p-3.5 text-sm"
                        >
                          <span className="font-bold text-[#111111]">
                            {join.contestCategoryTitle}
                          </span>
                          <span className="font-semibold text-neutral-700 bg-white px-2.5 py-0.5 rounded-[4px] text-xs border border-neutral-200">
                            {join.contestGradeTitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {invoiceInfo.joins?.length > 0 && (
                    <div className="flex items-center justify-between bg-[#FAFAFA] border border-neutral-200 rounded-xl px-4 py-3.5 text-sm">
                      <span className="font-semibold text-neutral-600">
                        예상 참가비 합계
                      </span>
                      <span className="text-lg font-black text-[#111111] tabular-nums">
                        {calculateContestPrice(
                          invoiceInfo.joins,
                          priceSource
                        ).toLocaleString()}{" "}
                        원
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-neutral-100 flex flex-col gap-y-2.5">
                    <button
                      type="button"
                      onClick={() => setConfirmDrawerOpen(true)}
                      disabled={
                        !invoiceInfo.joins || invoiceInfo.joins.length === 0
                      }
                      className={`w-full py-4 rounded-xl font-bold text-[15px] transition cursor-pointer ${
                        invoiceInfo.joins?.length > 0
                          ? "bg-[#111111] hover:bg-neutral-800 text-white"
                          : "bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      신청 정보 수정 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintDrawerOpen(true)}
                      className="w-full py-3.5 bg-[#FAFAFA] hover:bg-neutral-100 text-[#111111] border border-neutral-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RiPrinterLine className="text-base text-neutral-700" />
                      <span>접수증 A4 인쇄 / PDF 저장</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
          {printDrawerOpen && (
            <InvoicePrintModal
              invoiceInfo={invoiceInfo}
              contestInfo={contests}
              noticeInfo={noticeInfo}
              onClose={() => setPrintDrawerOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ContestJoinEdit;
