import dayjs from "dayjs";
import { addDoc, collection } from "firebase/firestore";
import moment from "moment/moment";
import React from "react";
import { db } from "../firebase";

const JoinCupConfirm = ({ joinGameInvoice, prevSetModal }) => {
  const handleInvoice = () => {
    const invoice = {
      cupId: joinGameInvoice.id,
      cupName: joinGameInvoice.cupInfo.cupName,
      cupOrg: joinGameInvoice.cupInfo.cupOrg,
      cupDate: dayjs(joinGameInvoice.cupInfo.cupDate.startDate).format(
        "YYYY-MM-DD"
      ),
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
    await addDoc(collection(db, "cupsjoin"), { docuId: id, ...datas }).then(
      (addDoc) => console.log(addDoc.id)
    );
  };
  return (
    <div className="flex w-full h-screen flex-col bg-white">
      <div className="flex w-full flex-col gap-y-1">
        <div className="flex w-full h-10 justify-center items-center">
          <span className="text-lg font-semibold">참가신청내용확인</span>
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
      <div className="flex w-full">참가신청정보</div>
      <div className="flex w-full h-20 justify-center items-center gap-x-3">
        <button
          className="w-32 h-12 bg-gray-400 rounded-lg shasdow text-white font-semibold"
          onClick={() => prevSetModal(false)}
        >
          돌아가기
        </button>
        <button
          className="w-32 h-12 bg-orange-500 rounded-lg shasdow text-white font-semibold"
          onClick={() => handleInvoice()}
        >
          신청서접수
        </button>
      </div>
    </div>
  );
};

export default JoinCupConfirm;
