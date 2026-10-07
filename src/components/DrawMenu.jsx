import React from "react";
import { DEFAULT_AVATAR } from "../consts";
import QrGenerator from "./QrGenerator";
import { IoLogOutOutline, IoCloseOutline } from "react-icons/io5";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { json, useNavigate } from "react-router-dom";
import { PlayerEditContext } from "../context/PlayerContext";
import { UserContext } from "../context/UserContext";

const DrawMenu = ({ setOpen }) => {
  const navigate = useNavigate();
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);

  const handleLogin = () => {
    setOpen();
    navigate("/login");
  };
  const handleLogout = () => {
    setCurrentUserInfo({});
    localStorage.setItem(
      "globalValue",
      JSON.stringify({ value: "", token: "" })
    );
    setOpen();
    navigate("/");
  };

  return (
    <div className="flex w-full h-full flex-col bg-[#0C0C0C] text-neutral-100 p-6 border-l border-neutral-800 shadow-2xl">
      {/* Top Close Bar */}
      <div className="flex w-full justify-between items-center pb-4 border-b border-neutral-800 mb-6">
        <span className="text-xs font-black tracking-widest text-white uppercase">
          BDBDg ATHLETIC
        </span>
        <button
          onClick={() => setOpen()}
          className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-900 transition cursor-pointer"
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>

      {/* User Info Header */}
      <div className="flex items-center gap-x-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6 shadow-xl">
        <img
          src={
            pInfo.pPic !== null && pInfo.pPic !== undefined && pInfo.pPic !== ""
              ? pInfo.pPic
              : DEFAULT_AVATAR
          }
          alt="Profile Avatar"
          className="rounded-full w-14 h-14 object-cover border-2 border-white shadow-md"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-base font-black text-white truncate">
            {pInfo.pNick ? pInfo.pNick : pInfo.pName ? pInfo.pName : "선수 회원"}
          </span>
          <span className="text-xs text-neutral-400 truncate mt-0.5">
            {pInfo.pEmail || "접수 시스템 회원"}
          </span>

          <div className="flex items-center gap-x-2 mt-2.5">
            {pInfo.playerUid ? (
              <>
                <button
                  className="px-3.5 py-1 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full shadow-md transition cursor-pointer active:scale-95"
                  onClick={() => {
                    setOpen();
                    navigate("/myprofile");
                  }}
                >
                  내 정보
                </button>
                <button
                  className="px-3.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-full border border-neutral-700 transition cursor-pointer active:scale-95"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                className="px-4 py-1.5 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full shadow-lg transition cursor-pointer active:scale-95"
                onClick={handleLogin}
              >
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="flex flex-col gap-y-1.5">
        <button
          onClick={() => {
            setOpen();
            navigate("/");
          }}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between cursor-pointer"
        >
          <span>통합 홈 대시보드</span>
          <span className="text-xs text-neutral-500 font-black">→</span>
        </button>

        <button
          onClick={() => {
            setOpen();
            navigate("/gbbf");
          }}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between cursor-pointer"
        >
          <span>경기도보디빌딩협회 대회목록</span>
          <span className="text-xs text-neutral-500 font-black">→</span>
        </button>

        <button
          onClick={() => {
            setOpen();
            navigate("/cuplist");
          }}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between cursor-pointer"
        >
          <span>대회 일정 전체보기</span>
          <span className="text-xs text-neutral-500 font-black">→</span>
        </button>

        {pInfo.playerUid && (
          <button
            onClick={() => {
              setOpen();
              navigate("/myprofile");
            }}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-left text-neutral-300 hover:text-white hover:bg-neutral-900 transition flex items-center justify-between cursor-pointer"
          >
            <span>마이페이지 (신청내역 조회)</span>
            <span className="text-xs text-neutral-500 font-black">→</span>
          </button>
        )}
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-6 border-t border-neutral-900 text-center">
        <span className="text-[11px] font-black tracking-widest text-neutral-600 uppercase">
          BDBDg BODYBUILDING PLATFORM
        </span>
      </div>
    </div>
  );
};

export default DrawMenu;
