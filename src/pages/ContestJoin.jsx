import React, { useState, useEffect, useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import Policy3 from "../components/Policy3";
import AppDrawer from "../components/common/AppDrawer";
import ContestHeaderBanner from "../components/contest/ContestHeaderBanner";
import PlayerInfoStep from "../components/contest/PlayerInfoStep";
import CategorySelectStep from "../components/contest/CategorySelectStep";
import JoinCupConfirm from "../modals/JoinCupConfirm";
import { UserContext } from "../context/UserContext";
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import { useContestForm } from "../hooks/useContestForm";
import {
  formatBirthDate,
  formatPhoneNumber,
  calculateContestPrice,
} from "../utils/formatUtils";

const ContestJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [noticeInfo, setNoticeInfo] = useState({});
  const [contests, setContests] = useState({});
  const [error, setError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerComponent, setDrawerComponent] = useState(null);
  const [isApply, setIsApply] = useState({
    title: "m1",
    value: false,
    applyDate: "",
  });

  const getNotice = useFirestoreGetDocument("contest_notice");
  const getContests = useFirestoreGetDocument("contests");
  const { currentUserInfo: pInfo } = useContext(UserContext);
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
  } = useContestForm({ initialIsValidate: false });

  const handleOpenDrawer = ({ component }) => {
    setDrawerComponent(component);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleApply = (e) => {
    setIsApply({
      title: "m1",
      value: e.target.checked,
      date: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  useEffect(() => {
    const fetchNotice = async () => {
      setIsLoading(true);
      try {
        const data = await getNotice.getDocument(params.contestId);
        if (!data?.refContestId) {
          setError(true);
          return;
        }
        setNoticeInfo({ ...data });
        const contest = await getContests.getDocument(data.refContestId);
        if (contest?.contestNoticeId) {
          setContests({ ...contest });
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.contestId]);

  useEffect(() => {
    fetchCategorysAndGrades(
      contests.contestCategorysListId,
      contests.contestGradesListId,
      () => setError(true)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contests]);

  useEffect(() => {
    if (
      !noticeInfo.contestTitle ||
      !contests.contestNoticeId ||
      !pInfo.pName ||
      !pInfo.playerUid
    ) {
      return;
    }
    const initInvoiceInfo = {
      invoicePoolId: contests.invoicesPoolId || "",
      contestId: contests.id || params.contestId || "",
      contestTitle: noticeInfo.contestTitle || "",
      contestDate: noticeInfo.contestDate || "",
      contestLocation: noticeInfo.contestLocation || "",
      conntestPromoter: noticeInfo.contestPromoter || "",
      contestPromoter: noticeInfo.contestPromoter || "",
      contestAssociate: noticeInfo.contestAssociate || "",
      contestCollectionFileLink: noticeInfo.contestCollectionFileLink || "",
      contestPriceBasic: noticeInfo.contestPriceBasic || 0,
      contestPriceExtra: noticeInfo.contestPriceExtra || 0,
      contestPriceExtraType: noticeInfo.contestPriceExtraType || "",
      contestPriceType1: noticeInfo.contestPriceType1 || 0,
      contestPriceType2: noticeInfo.contestPriceType2 || 0,
      contestBankName: noticeInfo.contestBankName || "",
      contestAccountNumber: noticeInfo.contestAccountNumber || "",
      contestAccountOwner: noticeInfo.contestAccountOwner || "",
      playerUid: pInfo.playerUid || "",
      playerName: pInfo.pName || "",
      playerTel: formatPhoneNumber(pInfo.pTel || ""),
      playerEmail: pInfo.pEmail || "",
      playerBirth: formatBirthDate(pInfo.pBirth || ""),
      playerGym: pInfo.pGym || "",
      playerGender: pInfo.pGender || "m",
      playerText: "",
      isPriceCheck: false,
      joins: [],
    };
    setInvoiceInfo(initInvoiceInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noticeInfo, contests, pInfo]);

  return (
    <div className="flex justify-center items-start align-top bg-[#F5F5F7] min-h-screen">
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
            대회 정보를 불러올 수 없거나 종료된 공고입니다.
          </p>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-3.5 bg-[#111111] text-white font-bold text-sm rounded-full cursor-pointer"
          >
            홈으로 돌아가기
          </button>
        </div>
      )}

      {!isLoading && !error && noticeInfo.contestTitle && (
        <div className="min-h-screen bg-[#F5F5F7] text-[#111111] w-full pb-28 font-sans antialiased">
          <BottomMenu />
          <Header title="대회 참가신청" />
          <AppDrawer open={drawerOpen} onClose={handleCloseDrawer} size="md">
            {drawerComponent}
          </AppDrawer>

          <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            <ContestHeaderBanner
              associateName={
                noticeInfo.contestAssociate ||
                noticeInfo.contestPromoter ||
                "보디빌딩협회"
              }
              badgeSubtitle="공식 참가접수"
              contestTitle={noticeInfo.contestTitle}
              contestDate={noticeInfo.contestDate}
              contestLocation={noticeInfo.contestLocation}
              contestPriceBasic={noticeInfo.contestPriceBasic}
              collectionFileLink={noticeInfo.contestCollectionFileLink}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Steps */}
              <div className="lg:col-span-8 flex flex-col gap-y-6">
                <PlayerInfoStep
                  stepTitle="선수 정보 입력"
                  guideText="입력 정보를 확인한 뒤 아래 버튼을 누르면 2단계 종목 선택이 열립니다."
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
                    stepTitle="참가 종목 및 체급 선택"
                    chkAllItem={chkAllItem}
                    setChkAllItem={setChkAllItem}
                    filteredCategorys={filteredCategorys}
                    grades={grades}
                    invoiceInfo={invoiceInfo}
                    priceSource={noticeInfo}
                    handleInvoiceInfo={handleInvoiceInfo}
                  >
                    {/* Step 3: Terms Agreement */}
                    <div className="bg-[#F5F5F7] border border-neutral-200/90 rounded-2xl p-5 mt-2">
                      <div className="flex items-start justify-between gap-x-3">
                        <label className="flex items-start gap-x-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            name="m2Apply"
                            value="m2Apply"
                            className="mt-1 w-4 h-4 accent-[#111111] rounded cursor-pointer shrink-0"
                            onChange={handleApply}
                          />
                          <div>
                            <span className="text-sm font-bold text-[#111111] mr-1.5">
                              [필수]
                            </span>
                            <span className="text-sm font-medium text-neutral-700">
                              개인정보 수집·이용 동의 및 초상권 사용 동의서에 동의합니다.
                            </span>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDrawer({
                              component: (
                                <Policy3 onClose={handleCloseDrawer} />
                              ),
                            })
                          }
                          className="text-xs sm:text-sm text-[#111111] hover:underline font-bold shrink-0 cursor-pointer"
                        >
                          약관보기
                        </button>
                      </div>
                    </div>
                  </CategorySelectStep>
                )}
              </div>

              {/* Right Column: Sticky Summary & Action Card */}
              <div className="lg:col-span-4">
                <div className="sticky top-20 bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] flex flex-col gap-y-5">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#111111] border-b border-neutral-100 pb-3.5 flex items-center justify-between">
                    <span>선택 종목 및 신청 요약</span>
                    <span className="text-xs font-bold text-white bg-[#111111] px-3 py-1 rounded-full">
                      {invoiceInfo.joins.length}개 선택
                    </span>
                  </h3>

                  <div className="flex flex-col gap-y-2.5 min-h-[100px]">
                    {invoiceInfo.joins.length > 0 ? (
                      invoiceInfo.joins.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#F5F5F7] rounded-xl p-3.5 text-sm"
                        >
                          <span className="font-bold text-[#111111]">
                            {item.contestCategoryTitle}
                          </span>
                          <span className="font-semibold text-[#111111] bg-white px-3 py-1 rounded-full text-xs border border-neutral-200">
                            {item.contestGradeTitle}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-sm text-neutral-400 font-medium">
                        선택된 참가 종목이 없습니다.
                      </div>
                    )}
                  </div>

                  {invoiceInfo.joins.length > 0 && (
                    <div className="flex items-center justify-between bg-[#F5F5F7] rounded-2xl px-4 py-3.5 text-sm">
                      <span className="font-semibold text-neutral-600">
                        예상 참가비 합계
                      </span>
                      <span className="text-lg font-extrabold text-[#111111]">
                        {calculateContestPrice(
                          invoiceInfo.joins,
                          noticeInfo
                        ).toLocaleString()}{" "}
                        원
                      </span>
                    </div>
                  )}

                  {noticeInfo.contestAccountOwner && (
                    <div className="bg-[#F5F5F7] rounded-2xl p-4 text-sm flex flex-col gap-y-1 text-[#111111]">
                      <span className="font-bold text-neutral-600 text-xs">
                        입금 계좌 안내
                      </span>
                      <p className="font-bold text-[#111111] mt-0.5">
                        {noticeInfo.contestBankName || ""}{" "}
                        {noticeInfo.contestAccountNumber}
                      </p>
                      <p className="text-xs text-neutral-500 font-medium">
                        예금주: {noticeInfo.contestAccountOwner}
                      </p>
                    </div>
                  )}

                  {invoiceInfo.joins.length > 0 &&
                  isApply.value &&
                  isValidate ? (
                    <button
                      type="button"
                      className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-full shadow-sm transition cursor-pointer text-center"
                      onClick={() =>
                        handleOpenDrawer({
                          component: (
                            <JoinCupConfirm
                              propInvoiceInfo={invoiceInfo}
                              prevSetModal={setDrawerOpen}
                            />
                          ),
                        })
                      }
                    >
                      참가신청서 확인 및 제출
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="w-full py-4 bg-neutral-100 border border-neutral-200 text-neutral-400 font-semibold text-sm rounded-full cursor-not-allowed text-center"
                      disabled
                    >
                      {!isValidate
                        ? "1단계 선수정보 확인을 완료해 주세요"
                        : invoiceInfo.joins.length === 0
                        ? "2단계 참가 종목을 선택해 주세요"
                        : "필수 약관에 동의해 주세요"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default ContestJoin;
