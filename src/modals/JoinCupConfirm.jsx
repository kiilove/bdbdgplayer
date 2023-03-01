import moment from "moment/moment";
import React from "react";

const JoinCupConfirm = ({ cupData, joinGames, playerData, prevSetModal }) => {
  return (
    <div className="flex w-full h-screen flex-col bg-white">
      <div className="flex w-full flex-col gap-y-1">
        <div className="flex w-full h-10 justify-center items-center">
          <span className="text-lg font-semibold">참가신청내용확인</span>
        </div>
        <div className="flex w-full justify-start items-center px-2">
          <span className="text-sm ">대회명 : {cupData.cupInfo.cupName}</span>
        </div>
        <div className="flex w-full justify-start items-center px-2">
          <span className="text-sm ">
            대회일자 :{" "}
            {moment(cupData.cupInfo.cupDate.startDate).format("YYYY-MM-DD")}
          </span>
        </div>
        <div className="flex w-full justify-start items-center px-2">
          <span className="text-sm ">
            대회장소 : {cupData.cupInfo.cupLocation}
          </span>
        </div>
        <div className="flex w-full justify-start items-center  flex-col">
          <div className="flex w-full justify-start items-center px-2">
            <span className="text-sm ">참가신청</span>
          </div>
          {joinGames.length > 0 ? (
            <div className="flex w-full justify-start flex-col">
              {joinGames.map((item, idx) => (
                <div className="flex w-full ml-2">
                  <span className="text-sm mr-1">{idx + 1}.</span>
                  <span className="text-sm mr-1">{item.gameName}</span>
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
        <button className="w-32 h-12 bg-orange-500 rounded-lg shasdow text-white font-semibold">
          신청서접수
        </button>
      </div>
    </div>
  );
};

export default JoinCupConfirm;
