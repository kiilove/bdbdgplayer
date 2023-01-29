import React, { useState } from "react";
import {
  RxHome,
  RxCalendar,
  RxSketchLogo,
  RxCamera,
  RxTextAlignJustify,
} from "react-icons/rx";
import { Link } from "react-router-dom";
import Drawer from "./Drawer";
const BottomMenu = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  return (
    <div className="block bottom-0 fixed w-full h-14 bg-white justify-center z-30">
      <div
        className="flex w-full h-full justify-around items-center align-middle box-border"
        style={{ maxWidth: "440px", margin: "0 auto" }}
      >
        <Link to="/home">
          <div className="flex w-16 h-16 justify-center items-center flex-col gap-y-1">
            <RxHome className="text-gray-700 text-xl" />
            <span className="text-xs">홈</span>
          </div>
        </Link>
        <Link to="/career">
          <div className="flex w-16 h-16 justify-center items-center flex-col gap-y-1">
            <RxSketchLogo className="text-gray-700 text-xl" />
            <span className="text-xs">커리어</span>
          </div>
        </Link>
        <div className="flex w-16 h-16 justify-center items-center flex-col gap-y-1">
          <RxCamera className="text-gray-700 text-xl" />
          <span className="text-xs">포토</span>
        </div>
        <div className="flex w-16 h-16 justify-center items-center flex-col gap-y-1">
          <RxCalendar className="text-gray-700 text-xl" />
          <span className="text-xs">대회일정</span>
        </div>
        <div
          className="flex w-16 h-16 justify-center items-center flex-col gap-y-1"
          onClick={() => setIsOpenDrawer(true)}
        >
          <RxTextAlignJustify className="text-gray-700 text-xl" />
          <span className="text-xs">메뉴</span>
        </div>
        <Drawer isOpen={isOpenDrawer} setIsOpen={setIsOpenDrawer} />
      </div>
    </div>
  );
};

export default BottomMenu;
