import React from "react";
import QRCode from "react-qr-code";

const QrGenerator = () => {
  return (
    <div className="flex w-full h-full justify-center items-center">
      <QRCode
        size={256}
        className="w-full h-full"
        value={"https://www.bdbdg.kr/"}
      />
    </div>
  );
};

export default QrGenerator;
