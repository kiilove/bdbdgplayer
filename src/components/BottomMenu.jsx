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
    { to: "/cuplist", label: "전체일정", icon: RxCalendar },
  ];

  return (
    <>
      <div className="fixed bottom-4 left-0 right-0 z-40 px-4 pointer-events-none">
        <nav className="max-w-md mx-auto h-15 p-1.5 rounded-full bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_10px_30px_rgba(37,99,235,0.10)] flex items-center justify-between gap-1 pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex-1 h-12 rounded-full flex items-center justify-center gap-1.5 transition-all duration-200 ${
                  active
                    ? "bg-[#2563EB] text-white font-bold shadow-[0_4px_12px_rgba(37,99,235,0.28)]"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 font-semibold"
                }`}
              >
                <Icon className="text-[18px] shrink-0" />
                <span className="text-xs tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleDrawer}
            className="flex-1 h-12 rounded-full flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 font-semibold transition-all duration-200 cursor-pointer"
          >
            <RxHamburgerMenu className="text-[18px] shrink-0" />
            <span className="text-xs tracking-tight whitespace-nowrap">
              메뉴
            </span>
          </button>
        </nav>
      </div>

      <AppDrawer open={isOpenDrawer} onClose={handleDrawer} size="sm">
        <DrawMenu setOpen={handleDrawer} />
      </AppDrawer>
    </>
  );
};

export default BottomMenu;
