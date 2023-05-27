import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import { replace } from "formik";
import moment from "moment/moment";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useEffect } from "react";
import {
  useFirestoreAddData,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";

const successMessage = (
  <div className="flex w-full h-full flex-col">
    <div className="flex w-full h-full justify-center items-center">
      <span className="text-xl">가입신청이 정상적으로 처리되었습니다.</span>
    </div>
  </div>
);

const JoinCupEditConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [invoiceInfo, setInvoiceInfo] = useState({ ...propInvoiceInfo });
  const [isLoading, setIsLoading] = useState(false);
  const addInvoice = useFirestoreAddData("invoices_pool");
  const updateInvoice = useFirestoreUpdateData("invoices_pool");
  const navigate = useNavigate();

  const handlePrice = (data, priceInfo) => {
    let basePrice = 0;
    let extraPrice = 0;
    let totalPrice = 0;
    const categoryCount = data.length;

    if (categoryCount <= 1) {
      switch (data[0].contestCategoryPriceType) {
        case "기본참가비":
          totalPrice = parseInt(priceInfo.contestPriceBasic);
          break;
        case "타입1":
          totalPrice = parseInt(priceInfo.contestPriceType1);
          break;
        case "타입2":
          totalPrice = parseInt(priceInfo.contestPriceType2);
          break;
        default:
          break;
      }
    } else {
      if (priceInfo.contestPriceExtraType === "누적") {
        extraPrice =
          parseInt(priceInfo.contestPriceExtra) * (categoryCount - 1);
      } else if (priceInfo.contestPriceExtraType === "정액") {
        extraPrice = parseInt(priceInfo.contestPriceExtra);
      } else {
        extraPrice = 0;
      }

      const findType1 = data.some(
        (d) => d.contestCategoryPriceType === "타입1"
      );
      const findType2 = data.some(
        (d) => d.contestCategoryPriceType === "타입2"
      );
      const findBasic = data.some(
        (d) => d.contestCategoryPriceType === "기본참가비"
      );

      if (findType1) {
        basePrice = parseInt(priceInfo.contestPriceType1);
      } else if (findType2) {
        basePrice = parseInt(priceInfo.contestPriceType2);
      } else {
        basePrice = parseInt(priceInfo.contestPriceBasic);
      }

      totalPrice = basePrice + extraPrice;
    }

    return totalPrice;
  };

  const handleInvoice = () => {
    setIsLoading(true);

    saveJoinCup(invoiceInfo);
  };

  useEffect(() => {
    console.log(invoiceInfo);
  }, [invoiceInfo]);

  const saveJoinCup = async (datas) => {
    const newData = {
      ...datas,
      invoiceEditAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      contestPriceSum: parseInt(handlePrice(invoiceInfo.joins, priceInfo)),
    };
    try {
      await updateInvoice
        .updateData(invoiceInfo.id, newData)
        .then(() => setIsLoading(false))
        .then(() => {
          navigate("/editsuccesspage", { replace: true });
        });
    } catch (error) {
      console.log(error);
    }
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

  return (
    <div className="flex w-full h-screen flex-col bg-white items-center">
      <div
        className="flex w-full h-full flex-col p-2"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full flex-col gap-y-1 h-auto mt-2  border-2 border-dashed">
          <div className="flex w-full h-auto py-2 justify-center items-center">
            <span className="text-xl font-semibold">변경내용 확인</span>
          </div>
          <div className="flex  w-full h-auto flex-col bg-white px-2">
            <div className="flex flex-col w-full px-4 border h-auto gap-y-1 py-2">
              <div className="flex justify-between">
                <span className="text-lg font-medium z-10">
                  참가대회정보
                  <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  대회명 : {invoiceInfo?.contestTitle}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  대회일자 : {invoiceInfo?.contestDate}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  대회장소 : {invoiceInfo?.contestLocation}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  참가비 : {invoicePrice?.toLocaleString()} 원
                </span>
              </div>
            </div>
          </div>
          <div className="flex  w-full h-auto flex-col bg-white px-2 ">
            <div className="flex flex-col w-full px-4 border h-auto gap-y-1 py-2">
              <div className="flex justify-between">
                <span className="text-lg font-medium z-10">
                  개인정보
                  <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  이름 : {invoiceInfo?.playerName}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  연락처 : {invoiceInfo?.playerTel}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  생년월일 : {invoiceInfo?.playerBirth}
                </span>
              </div>
              <div className="flex w-full justify-start items-center px-2">
                <span className="text-sm ">
                  소속 : {invoiceInfo?.playerGym}
                </span>
              </div>
            </div>
          </div>
          <div className="flex  w-full h-auto flex-col bg-white px-2 mb-2">
            <div className="flex flex-col w-full px-4 border h-auto gap-y-1 py-2">
              <div className="flex justify-between">
                <span className="text-lg font-medium z-10">
                  참가신청종목
                  <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                </span>
              </div>
              {invoiceInfo.joins.length > 0 ? (
                <div className="flex w-full justify-start flex-col">
                  {invoiceInfo.joins.map((item, idx) => (
                    <div className="flex w-full ml-2">
                      <span className="text-sm mr-1">{idx + 1}.</span>
                      <span className="text-sm mr-1">
                        {item.contestCategoryTitle}
                      </span>
                      <span className="text-sm">
                        ({item.contestGradeTitle})
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex w-full justify-start flex-col">
                  <span className="text-sm ml-2 font-semibold">
                    참가 신청 종목이 없습니다.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full h-20 justify-center items-center gap-x-3">
          {!isLoading && (
            <button
              className="w-32 h-12 bg-gray-400 rounded-lg shasdow text-white font-semibold"
              onClick={() => prevSetModal(false)}
            >
              돌아가기
            </button>
          )}

          {isLoading ? (
            <button
              className="w-32 h-12 bg-orange-500 rounded-lg shasdow text-white font-semibold flex justify-center items-center"
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
              className="w-32 h-12 bg-orange-500 rounded-lg shasdow text-white font-semibold"
              onClick={() => handleInvoice()}
            >
              변경신청
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinCupEditConfirm;
