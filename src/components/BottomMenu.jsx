import React, { useState } from "react";
import {
  RxHome,
  RxCalendar,
  RxSketchLogo,
  RxDotsHorizontal,
} from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import Drawer from "react-modern-drawer";
import DrawMenu from "./DrawMenu";
import "react-modern-drawer/dist/index.css";

const BottomMenu = () => {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const location = useLocation();

  const handleDrawer = () => {
    setIsOpenDrawer((prev) => !prev);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-2xl border-t border-neutral-900 shadow-2xl shadow-black">
        <div className="max-w-md mx-auto h-16 px-4 flex justify-around items-center">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-150 ${
              isActive("/")
                ? "text-white font-black"
                : "text-neutral-500 hover:text-neutral-200 font-semibold"
            }`}
          >
            <RxHome className="text-xl" />
            <span className="text-[11px] mt-1 tracking-tight">홈</span>
            {isActive("/") && (
              <span className="w-1 h-1 rounded-full bg-white mt-0.5 shadow-[0_0_8px_#ffffff]"></span>
            )}
          </Link>

          <Link
            to="/gbbf"
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-150 ${
              isActive("/gbbf")
                ? "text-white font-black"
                : "text-neutral-500 hover:text-neutral-200 font-semibold"
            }`}
          >
            <RxSketchLogo className="text-xl" />
            <span className="text-[11px] mt-1 tracking-tight">경기도협회</span>
            {isActive("/gbbf") && (
              <span className="w-1 h-1 rounded-full bg-white mt-0.5 shadow-[0_0_8px_#ffffff]"></span>
            )}
          </Link>

          <Link
            to="/cuplist"
            className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-150 ${
              isActive("/cuplist")
                ? "text-white font-black"
                : "text-neutral-500 hover:text-neutral-200 font-semibold"
            }`}
          >
            <RxCalendar className="text-xl" />
            <span className="text-[11px] mt-1 tracking-tight">대회일정</span>
            {isActive("/cuplist") && (
              <span className="w-1 h-1 rounded-full bg-white mt-0.5 shadow-[0_0_8px_#ffffff]"></span>
            )}
          </Link>

          <button
            onClick={() => handleDrawer()}
            className="flex flex-col items-center justify-center w-16 h-full text-neutral-500 hover:text-neutral-200 font-semibold transition-all duration-150 cursor-pointer"
          >
            <RxDotsHorizontal className="text-xl" />
            <span className="text-[11px] mt-1 tracking-tight">전체메뉴</span>
          </button>
        </div>
      </div>

      <Drawer
        open={isOpenDrawer}
        onClose={handleDrawer}
        direction="right"
        size={320}
        style={{ zIndex: 9999 }}
      >
        <DrawMenu setOpen={handleDrawer} />
      </Drawer>
    </>
  );
};

export default BottomMenu;
