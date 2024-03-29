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

const successMessage = (
  <div className="flex w-full h-full flex-col">
    <div className="flex w-full h-full justify-center items-center">
      <span className="text-xl">가입신청이 정상적으로 처리되었습니다.</span>
    </div>
  </div>
);

const JoinCupConfirm = ({ joinGameInvoice, prevSetModal }) => {
  const [joinFee, setJoinFee] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFee = () => {
    let sumFee = 0;
    let extraCount = 0;
    const basicFee = joinGameInvoice.cupInfo.cupFee.basicFee;
    const extraFee = joinGameInvoice.cupInfo.cupFee.extraFee;
    const extraType = joinGameInvoice.cupInfo.cupFee.extraType;
    const gameCount = joinGameInvoice.joinGames.length;

    if (gameCount <= 1) {
      extraCount = 0;
    } else {
      extraCount = gameCount - 1;
    }

    switch (extraType) {
      case "정액":
        console.log("정액");
        if (extraCount > 0) {
          sumFee = basicFee + extraFee;
        } else {
          sumFee = basicFee;
        }
        break;
      case "누적":
        console.log(extraCount);
        if (extraCount > 0) {
          sumFee = basicFee + extraFee * extraCount;
        } else {
          sumFee = basicFee;
        }
        break;
      case "없음":
        sumFee = basicFee;

      default:
        break;
    }

    setJoinFee(sumFee);
  };
  const handleInvoice = () => {
    setIsLoading(true);
    const invoice = {
      cupId: joinGameInvoice.id,
      cupName: joinGameInvoice.cupInfo.cupName,
      cupOrg: joinGameInvoice.cupInfo.cupOrg,
      cupDate: dayjs(joinGameInvoice.cupInfo.cupDate.startDate).format(
        "YYYY-MM-DD"
      ),
      feeInfo: {
        joinFee,
        incomeFee: 0,
        incomeType: "",
        incomeChecker: "",
        incomeDate: "",
        incomeMemo: "",
      },
      pId: joinGameInvoice.pId,
      pUid: joinGameInvoice.pUid,
      pName: joinGameInvoice.pName,
      pBirth: joinGameInvoice.pBirth,
      pGender: joinGameInvoice.pGender,
      pTel: joinGameInvoice.pTel,
      pEmail: joinGameInvoice.pEmail,
      invoiceDate: dayjs().format("YYYY-MM-DD HH:MM:ss"),
      joinGames: joinGameInvoice.joinGames,
      apply: joinGameInvoice.apply,
    };

    saveJoinCup(invoice);
  };

  const saveJoinCup = async (datas) => {
    const randomString = Math.random().toString(36).substring(2, 6);
    const id = (
      randomString +
      "-" +
      Date.now().toString().substr(-6)
    ).toUpperCase();
    await addDoc(collection(db, "cupsjoin"), { docuId: id, ...datas })
      .then((addDoc) => console.log(addDoc.id))
      .then(() => setIsLoading(false))
      .then(() => {
        navigate("/successpage", { replace: true });
      });
  };
  useMemo(() => console.log(joinGameInvoice), []);

  useMemo(() => handleFee(), [joinGameInvoice]);
  useMemo(() => console.log(joinFee), [joinFee]);
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
              대회명 : {joinGameInvoice.cupInfo.cupName}
            </span>
          </div>
          <div className="flex w-full justify-start items-center px-2">
            <span className="text-sm ">
              대회일자 :{" "}
              {moment(joinGameInvoice.cupInfo.cupDate.startDate).format(
                "YYYY-MM-DD"
              )}
            </span>
          </div>
          <div className="flex w-full justify-start items-center px-2">
            <span className="text-sm ">
              대회장소 : {joinGameInvoice.cupInfo.cupLocation}
            </span>
          </div>
          <div className="flex w-full justify-start items-center px-2">
            <span className="text-sm ">
              참가비 : {Number(joinFee).toLocaleString()}
            </span>
          </div>
          <div className="flex w-full justify-start items-center  flex-col">
            <div className="flex w-full justify-start items-center px-2">
              <span className="text-sm ">참가신청</span>
            </div>
            {joinGameInvoice.joinGames.length > 0 ? (
              <div className="flex w-full justify-start flex-col">
                {joinGameInvoice.joinGames.map((item, idx) => (
                  <div className="flex w-full ml-2">
                    <span className="text-sm mr-1">{idx + 1}.</span>
                    <span className="text-sm mr-1">{item.gameTitle}</span>
                    <span className="text-sm">({item.gameClass})</span>
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
