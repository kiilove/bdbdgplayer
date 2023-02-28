import React from "react";

const JoinCupConfirm = ({ cupData, JoinGames, prevSetModal }) => {
  return (
    <div className="flex w-full h-screen flex-col bg-white">
      <div className="flex w-full">참가신청정보</div>
      <div className="flex w-full">참가신청정보</div>
      <div className="flex w-full">
        <button
          className="w-20 h-15 bg-gray-200 rounded-lg shasdow"
          onClick={() => prevSetModal(false)}
        >
          돌아가기
        </button>
        <button className="w-20 h-15 bg-orange-500 rounded-lg shasdow">
          신청서접수
        </button>
      </div>
    </div>
  );
};

export default JoinCupConfirm;
