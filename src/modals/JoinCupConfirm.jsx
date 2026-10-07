import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useFirestoreAddData } from "../hooks/useFirestores";
import { RiTrophyLine, RiUserLine, RiCheckDoubleLine, RiCloseLine, RiErrorWarningLine } from "react-icons/ri";

const JoinCupConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [invoiceInfo, setInvoiceInfo] = useState({ ...propInvoiceInfo });
  const [isLoading, setIsLoading] = useState(false);
  const addInvoice = useFirestoreAddData("invoices_pool");
  const navigate = useNavigate();

  const handlePrice = (data, priceInfo) => {
    let basePrice = 0;
    let extraPrice = 0;
    let totalPrice = 0;
    const categoryCount = data ? data.length : 0;

    if (categoryCount <= 1) {
      if (data && data.length > 0) {
        switch (data[0].contestCategoryPriceType) {
          case "기본참가비":
            totalPrice = parseInt(priceInfo.contestPriceBasic || 0);
            break;
          case "타입1":
            totalPrice = parseInt(priceInfo.contestPriceType1 || 0);
            break;
          case "타입2":
            totalPrice = parseInt(priceInfo.contestPriceType2 || 0);
            break;
          default:
            totalPrice = parseInt(priceInfo.contestPriceBasic || 0);
            break;
        }
      }
    } else {
      if (priceInfo.contestPriceExtraType === "누적") {
        extraPrice = parseInt(priceInfo.contestPriceExtra || 0) * (categoryCount - 1);
      } else if (priceInfo.contestPriceExtraType === "정액") {
        extraPrice = parseInt(priceInfo.contestPriceExtra || 0);
      } else {
        extraPrice = 0;
      }

      const findType1 = data.some((d) => d.contestCategoryPriceType === "타입1");
      const findType2 = data.some((d) => d.contestCategoryPriceType === "타입2");

      if (findType1) {
        basePrice = parseInt(priceInfo.contestPriceType1 || 0);
      } else if (findType2) {
        basePrice = parseInt(priceInfo.contestPriceType2 || 0);
      } else {
        basePrice = parseInt(priceInfo.contestPriceBasic || 0);
      }

      totalPrice = basePrice + extraPrice;
    }

    return totalPrice;
  };

  const priceInfo = {
    contestPriceBasic: invoiceInfo.contestPriceBasic,
    contestPriceExtra: invoiceInfo.contestPriceExtra,
    contestPriceExtraType: invoiceInfo.contestPriceExtraType,
    contestPriceType1: invoiceInfo.contestPriceType1,
    contestPriceType2: invoiceInfo.contestPriceType2,
  };

  useEffect(() => {
    setInvoicePrice(handlePrice(invoiceInfo.joins, priceInfo));
  }, [invoiceInfo]);

  const handleInvoice = () => {
    setIsLoading(true);
    saveJoinCup(invoiceInfo);
  };

  const saveJoinCup = async (datas) => {
    if (!datas.playerName || !datas.playerUid) {
      alert("로그인 정보 또는 선수 이름이 누락되었습니다. 다시 로그인 후 시도해 주세요.");
      setIsLoading(false);
      return;
    }
    if (!datas.joins || datas.joins.length === 0) {
      alert("참가 신청 종목이 선택되지 않았습니다. 돌아가서 종목을 선택해 주세요.");
      setIsLoading(false);
      return;
    }

    const randomString = Math.random().toString(36).substring(2, 6);
    const docuId = (
      randomString +
      "-" +
      Date.now().toString().substr(-6)
    ).toUpperCase();

    const rawData = {
      ...datas,
      docuId,
      isCanceled: false,
      invoiceCreateAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      contestPriceSum: parseInt(invoicePrice || 0),
      createBy: "web",
    };

    const newData = {};
    Object.keys(rawData).forEach((key) => {
      newData[key] = rawData[key] !== undefined ? rawData[key] : "";
    });

    try {
      await addInvoice.addData(newData);
      setIsLoading(false);
      navigate("/successpage", { replace: true });
    } catch (error) {
      console.error("Save Error:", error);
      setIsLoading(false);
      alert("접수 신청 저장 중 오류가 발생했습니다. 네트워크 또는 로그인 상태를 확인 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#141414] rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800 my-6 max-h-[90vh] overflow-y-auto text-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4 mb-5">
        <div className="flex items-center gap-x-2.5">
          <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-black text-lg">
            <RiCheckDoubleLine />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white">참가신청 내용 확인</h2>
            <p className="text-xs text-neutral-400 font-medium">신청 정보를 최종 확인 후 접수를 완료해 주세요</p>
          </div>
        </div>
        <button
          onClick={() => prevSetModal(false)}
          className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer"
        >
          <RiCloseLine className="text-xl" />
        </button>
      </div>

      <div className="flex flex-col gap-y-5">
        {/* Contest Info Card */}
        <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4.5 flex flex-col gap-y-3">
          <div className="flex items-center gap-x-2 text-xs font-black text-white border-b border-neutral-800/80 pb-2">
            <RiTrophyLine className="text-base text-neutral-300" />
            <span>참가 대회 정보</span>
          </div>
          <div className="grid grid-cols-1 gap-y-2 text-xs">
            <div className="flex justify-between items-start">
              <span className="text-neutral-400 font-medium whitespace-nowrap mr-2">대회명</span>
              <span className="text-white font-bold text-right">{invoiceInfo?.contestTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium">대회일자</span>
              <span className="text-white font-bold">{invoiceInfo?.contestDate}</span>
            </div>
            {invoiceInfo?.contestLocation && (
              <div className="flex justify-between items-start">
                <span className="text-neutral-400 font-medium whitespace-nowrap mr-2">대회장소</span>
                <span className="text-white font-bold text-right">{invoiceInfo?.contestLocation}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-neutral-800/80 mt-1">
              <span className="text-neutral-300 font-bold">최종 참가비</span>
              <span className="text-lg font-black text-white">
                {invoicePrice?.toLocaleString()} 원
              </span>
            </div>
          </div>
        </div>

        {/* Player Info Card */}
        <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4.5 flex flex-col gap-y-3">
          <div className="flex items-center gap-x-2 text-xs font-black text-white border-b border-neutral-800/80 pb-2">
            <RiUserLine className="text-base text-neutral-300" />
            <span>개인 정보</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-400 font-medium block mb-0.5">이름</span>
              <span className="text-white font-bold">{invoiceInfo?.playerName}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-medium block mb-0.5">연락처</span>
              <span className="text-white font-bold">{invoiceInfo?.playerTel}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-medium block mb-0.5">생년월일</span>
              <span className="text-white font-bold">{invoiceInfo?.playerBirth}</span>
            </div>
            <div>
              <span className="text-neutral-400 font-medium block mb-0.5">소속</span>
              <span className="text-white font-bold">{invoiceInfo?.playerGym || "무소속"}</span>
            </div>
          </div>
        </div>

        {/* Joins Info Card */}
        <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4.5 flex flex-col gap-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
            <span className="text-xs font-black text-white flex items-center gap-x-1.5">
              <RiCheckDoubleLine className="text-base text-neutral-300" />
              참가 신청 종목
            </span>
            <span className="text-xs font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
              총 {invoiceInfo.joins?.length || 0}개
            </span>
          </div>

          {invoiceInfo.joins?.length > 0 ? (
            <div className="flex flex-col gap-y-2 max-h-48 overflow-y-auto pr-1">
              {invoiceInfo.joins.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-[#121212] border border-neutral-800 rounded-xl p-3 text-xs"
                >
                  <div className="flex items-center gap-x-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-white">{item.contestCategoryTitle}</span>
                  </div>
                  <span className="font-bold text-black bg-white px-2 py-0.5 rounded-full text-[11px]">
                    {item.contestGradeTitle}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-neutral-500 font-medium text-center py-3 block">
              참가 신청 종목이 없습니다.
            </span>
          )}
        </div>

        {/* 참가비 유의사항 안내 박스 */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-start gap-x-2.5 text-neutral-300 text-[11px] leading-relaxed">
          <RiErrorWarningLine className="text-neutral-400 text-base flex-shrink-0 mt-0.5" />
          <span>
            학생부, 피트니스 챌린지와 보디빌딩 중복 출전의 경우 정확한 참가비용은 경기도보디빌딩협회를 통해 안내 받으시기 바랍니다.
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-x-3 mt-6 pt-2">
        {!isLoading && (
          <button
            className="flex-1 py-3.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-sm rounded-full transition cursor-pointer text-center"
            onClick={() => prevSetModal(false)}
          >
            돌아가기
          </button>
        )}

        {isLoading ? (
          <button
            className="flex-1 py-3.5 bg-white text-black font-black text-sm rounded-full flex justify-center items-center cursor-not-allowed opacity-90"
            disabled
          >
            <RotatingLines
              strokeColor="black"
              strokeWidth="5"
              animationDuration="0.75"
              width="20"
              visible={true}
            />
          </button>
        ) : (
          <button
            className="flex-1 py-3.5 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full transition shadow-xl cursor-pointer text-center tracking-tight"
            onClick={() => handleInvoice()}
          >
            신청서접수
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinCupConfirm;
