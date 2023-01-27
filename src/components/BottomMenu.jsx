import React from "react";
import {
  RxHome,
  RxCalendar,
  RxSketchLogo,
  RxCamera,
  RxTextAlignJustify,
} from "react-icons/rx";
import { Link } from "react-router-dom";
const BottomMenu = () => {
  return (
    <div className="block bottom-0 fixed w-full h-14 bg-white justify-center">
      <div className="flex w-full h-full justify-center items-center">
        <Link to="/home">
          <div className="flex w-20 h-full justify-center items-center flex-col gap-y-1">
            <RxHome className="text-gray-700 text-xl" />
            <span className="text-xs">홈</span>
          </div>
        </Link>
        <Link to="/career">
          <div className="flex w-20 h-full justify-center items-center flex-col gap-y-1">
            <RxSketchLogo className="text-gray-700 text-xl" />
            <span className="text-xs">커리어</span>
          </div>
        </Link>
        <div className="flex w-20 h-full justify-center items-center flex-col gap-y-1">
          <RxCamera className="text-gray-700 text-xl" />
          <span className="text-xs">포토</span>
        </div>
        <div className="flex w-20 h-full justify-center items-center flex-col gap-y-1">
          <RxCalendar className="text-gray-700 text-xl" />
          <span className="text-xs">대회일정</span>
        </div>
        <div className="flex w-20 h-full justify-center items-center flex-col gap-y-1">
          <RxTextAlignJustify className="text-gray-700 text-xl" />
          <span className="text-xs">메뉴</span>
        </div>
      </div>
    </div>
  );
};

export default BottomMenu;
