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
    const randomString = Math.random().toString(36).substring(2, 6);
    const docuId = (
      randomString +
      "-" +
      Date.now().toString().substr(-6)
    ).toUpperCase();
    // await addDoc(collection(db, "cupsjoin"), { docuId: id, ...datas })
    //   .then((addDoc) => console.log(addDoc.id))
    //   .then(() => setIsLoading(false))
    //   .then(() => {
    //     navigate("/successpage", { replace: true });
    //   });

    //console.log(dayjs(new Date()).format("YYYY-MM-DD HH:mm"));
    const newData = {
      docuId,
      invoiceCreateAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      ...datas,
    };
    try {
      await addInvoice
        .addData(newData)
        .then(() => setIsLoading(false))
        .then(() => {
          navigate("/successpage", { replace: true });
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const priceInfo = {
      contestPriceBasic: invoiceInfo.contestPriceBasic,
      contestPriceExtra: invoiceInfo.contestPriceExtra,
      contestPriceExtraType: invoiceInfo.contestPriceExtraType,
      contestPriceType1: invoiceInfo.contestPriceType1,
      contestPriceType2: invoiceInfo.contestPriceType2,
    };

    setInvoicePrice(handlePrice(invoiceInfo.joins, priceInfo));
  }, [invoiceInfo]);

  return (
    <div className="flex w-full h-screen flex-col bg-white items-center">
      <div
        className="flex w-full h-full flex-col"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full flex-col gap-y-1 h-full mt-5 border-2 border-dashed p-5">
          <div className="flex w-full h-20 justify-center items-center mb-5 p-5">
            <span className="text-2xl font-semibold">참가신청내용확인</span>
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
          <div className="flex w-full justify-start items-center  flex-col">
            <div className="flex w-full justify-start items-center px-2">
              <span className="text-sm ">참가신청</span>
            </div>
            {invoiceInfo.joins.length > 0 ? (
              <div className="flex w-full justify-start flex-col">
                {invoiceInfo.joins.map((item, idx) => (
                  <div className="flex w-full ml-2">
                    <span className="text-sm mr-1">{idx + 1}.</span>
                    <span className="text-sm mr-1">
                      {item.contestCategoryTitle}
                    </span>
                    <span className="text-sm">({item.contestGradeTitle})</span>
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
              신청서접수
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JoinCupConfirm;
