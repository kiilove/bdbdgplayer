import React, { useState } from "react";
import {
  RxHome,
  RxCalendar,
  RxSketchLogo,
  RxHamburgerMenu,
} from "react-icons/rx";
import { Link, useLocation } from "react-router-dom";
import AppDrawer from "./common/AppDrawer";
import DrawMenu from "./DrawMenu";

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

  const navItems = [
    { to: "/", label: "홈", icon: RxHome },
    { to: "/gbbf", label: "경기도협회", icon: RxSketchLogo },
    { to: "/cuplist", label: "대회일정", icon: RxCalendar },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
        <div className="max-w-lg mx-auto h-16 px-2 flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  active
                    ? "text-[#111111] font-bold"
                    : "text-neutral-400 hover:text-neutral-700 font-medium"
                }`}
              >
                <Icon className="text-[21px]" />
                <span className="text-xs mt-1 tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleDrawer}
            className="flex flex-col items-center justify-center flex-1 h-full text-neutral-400 hover:text-[#111111] font-medium transition-colors cursor-pointer"
          >
            <RxHamburgerMenu className="text-[21px]" />
            <span className="text-xs mt-1 tracking-tight">전체메뉴</span>
          </button>
        </div>
      </nav>

      <AppDrawer open={isOpenDrawer} onClose={handleDrawer} size="sm">
        <DrawMenu setOpen={handleDrawer} />
      </AppDrawer>
    </>
  );
};

export default BottomMenu;
