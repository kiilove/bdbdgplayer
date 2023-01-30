import React from "react";
import QrGenerator from "../components/QrGenerator";

const QrFull = ({ qrValue }) => {
  return (
    <div className="flex w-screen h-screen  flex-col justify-start items-center">
      <div className="flex w-full h-10 ">
        <button className="text-gray-700" onClick={() => window.history.back()}>
          닫기
        </button>
      </div>
      <div className="flex w-full h-full justify-center items-center px-3 ">
        <QrGenerator />
      </div>
    </div>
  );
};

export default QrFull;
