import React from "react";
import { RxArrowLeft } from "react-icons/rx";

const Header = ({ title, banner }) => {
  return (
    <div className="block top-0 sticky w-full h-full z-30">
      <div className="flex w-full h-full justify-center items-center flex-col">
        <div className="flex w-full h-14 justify-center items-center bg-white">
          <div className="flex h-10 w-1/6 justify-start items-center ml-2">
            <RxArrowLeft className=" text-2xl font-semibold" />
          </div>
          <div className="flex h-full w-5/6 justify-start items-center">
            <p
              className="text-lg font-bold px-2 absolute left-1/2"
              style={{ transform: "translate(-50%,0%)" }}
            >
              {title}
            </p>
          </div>
        </div>

        {/* 배너시작 */}
        {banner}

        {/* 배터종료 */}
      </div>
    </div>
  );
};

export default Header;
