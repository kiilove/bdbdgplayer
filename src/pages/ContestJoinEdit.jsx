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
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import { useContestForm } from "../hooks/useContestForm";
import {
  formatBirthDate,
  formatPhoneNumber,
  calculateContestPrice,
} from "../utils/formatUtils";

const ContestJoinEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contests, setContests] = useState({});
  const [noticeInfo, setNoticeInfo] = useState({});
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerComponent, setDrawerComponent] = useState(null);
  const [printDrawerOpen, setPrintDrawerOpen] = useState(false);

  const getInvoice = useFirestoreGetDocument("invoices_pool");
  const getContests = useFirestoreGetDocument("contests");
  const getNotice = useFirestoreGetDocument("contest_notice");
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
    fetchCategorysAndGrades,
    handleInputs,
    handleInvoiceInfo,
    handlePlayerValidateButtonClick,
  } = useContestForm({ initialIsValidate: true });

  const handleOpenDrawer = ({ component }) => {
    setDrawerComponent(component);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      setIsLoading(true);
      try {
        const data = await getInvoice.getDocument(params.invoiceId);
        if (!data?.id) {
          setError(true);
          return;
        }

        setInvoiceInfo({
          ...data,
          playerTel: formatPhoneNumber(data.playerTel || ""),
          playerBirth: formatBirthDate(data.playerBirth || ""),
        });

        const contest = await getContests.getDocument(data.contestId);
        if (contest?.contestNoticeId) {
          setContests({ ...contest });
          const notice = await getNotice.getDocument(contest.contestNoticeId);
          if (notice?.id) {
            setNoticeInfo({ ...notice });
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.invoiceId]);

  useEffect(() => {
    fetchCategorysAndGrades(
      contests.contestCategorysListId,
      contests.contestGradesListId,
      () => setError(true)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contests]);

  const priceSource = noticeInfo?.contestPriceBasic ? noticeInfo : invoiceInfo;
  const associateName =
    noticeInfo.contestAssociate ||
    invoiceInfo.contestAssociate ||
    contests.contestAssociate ||
    noticeInfo.contestPromoter ||
    invoiceInfo.contestPromoter ||
    contests.contestPromoter ||
    "보디빌딩협회";

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#111111] font-sans antialiased pb-28">
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
        <div className="min-h-screen bg-[#F5F5F7] text-[#111111] w-full flex flex-col items-center justify-center p-6 text-center gap-4">
          <p className="text-base text-neutral-600 font-bold">
            신청 내역을 불러올 수 없거나 존재하지 않는 문서입니다.
          </p>
          <button
            type="button"
            onClick={() => navigate("/myprofile")}
            className="px-6 py-3.5 bg-[#111111] text-white font-bold text-sm rounded-full cursor-pointer"
          >
            내 신청내역으로 돌아가기
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <BottomMenu />
          <Header title="참가신청 내역 및 수정" />
          <AppDrawer open={drawerOpen} onClose={handleCloseDrawer} size="md">
            {drawerComponent}
          </AppDrawer>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            <ContestHeaderBanner
              associateName={associateName}
              badgeSubtitle="참가신청 수정"
              contestTitle={invoiceInfo.contestTitle || contests.contestTitle}
              contestDate={invoiceInfo.contestDate}
              contestLocation={invoiceInfo.contestLocation}
              contestPriceBasic={invoiceInfo.contestPriceBasic}
              bankInfo={
                invoiceInfo.contestBankName
                  ? {
                      bankName: invoiceInfo.contestBankName,
                      accountNumber: invoiceInfo.contestAccountNumber,
                      accountOwner: invoiceInfo.contestAccountOwner,
                    }
                  : null
              }
              collectionFileLink={contests.contestCollectionFileLink}
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
                <div className="sticky top-20 bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-y-5">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#111111] border-b border-neutral-100 pb-3.5 flex items-center justify-between">
                    <span>선택 종목 내역</span>
                    <span className="text-xs font-bold text-white bg-[#111111] px-3 py-1 rounded-full">
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
                          className="flex items-center justify-between bg-[#F5F5F7] rounded-xl p-3.5 text-sm"
                        >
                          <span className="font-bold text-[#111111]">
                            {join.contestCategoryTitle}
                          </span>
                          <span className="font-semibold text-[#111111] bg-white px-3 py-1 rounded-full text-xs border border-neutral-200">
                            {join.contestGradeTitle}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {invoiceInfo.joins?.length > 0 && (
                    <div className="flex items-center justify-between bg-[#F5F5F7] rounded-2xl px-4 py-3.5 text-sm">
                      <span className="font-semibold text-neutral-600">
                        예상 참가비 합계
                      </span>
                      <span className="text-lg font-extrabold text-[#111111]">
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
                      onClick={() =>
                        handleOpenDrawer({
                          component: (
                            <JoinCupEditConfirm
                              propInvoiceInfo={invoiceInfo}
                              prevSetModal={setDrawerOpen}
                            />
                          ),
                        })
                      }
                      disabled={
                        !invoiceInfo.joins || invoiceInfo.joins.length === 0
                      }
                      className={`w-full py-4 rounded-full font-bold text-[15px] transition cursor-pointer ${
                        invoiceInfo.joins?.length > 0
                          ? "bg-[#111111] hover:bg-neutral-800 text-white shadow-sm"
                          : "bg-neutral-100 border border-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      신청 정보 수정 완료
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrintDrawerOpen(true)}
                      className="w-full py-3.5 bg-[#F5F5F7] hover:bg-neutral-200/80 text-[#111111] border border-neutral-200 font-bold text-sm rounded-full transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RiPrinterLine className="text-base" />
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
        </>
      )}
    </div>
  );
};

export default ContestJoinEdit;
