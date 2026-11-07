import React, { useContext } from "react";
import { DEFAULT_AVATAR } from "../consts";
import { IoCloseOutline, IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";

const DrawMenu = ({ setOpen }) => {
  const navigate = useNavigate();
  const { handleSignOut } = useFirebaseAuth();
  const { currentUserInfo: pInfo, clearUserSession } = useContext(UserContext);

  const handleLogin = () => {
    setOpen();
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await handleSignOut();
    } catch {
      // ignore signOut errors
    }
    clearUserSession();
    setOpen();
    navigate("/");
  };

  const menuLinks = [
    { label: "통합 홈 대시보드", path: "/" },
    { label: "경기도보디빌딩협회 주관 대회", path: "/gbbf" },
    { label: "전체 대회 일정 보기", path: "/cuplist" },
    ...(pInfo.playerUid
      ? [{ label: "마이페이지 · 신청내역 조회", path: "/myprofile" }]
      : []),
  ];

  return (
    <div className="flex w-full h-full flex-col bg-white text-[#111111] p-6">
      {/* Top Close Bar */}
      <div className="flex w-full justify-between items-center pb-4 border-b border-neutral-200 mb-6">
        <span className="text-sm font-extrabold tracking-tight text-[#111111]">
          전체 메뉴
        </span>
        <button
          type="button"
          onClick={() => setOpen()}
          className="w-9 h-9 rounded-full text-neutral-500 hover:text-[#111111] hover:bg-neutral-100 flex items-center justify-center transition cursor-pointer"
        >
          <IoCloseOutline className="text-2xl" />
        </button>
      </div>

      {/* User Info Header */}
      <div className="flex items-center gap-x-4 bg-[#F5F5F7] rounded-2xl p-4 mb-6">
        <img
          src={
            pInfo.pPic !== null && pInfo.pPic !== undefined && pInfo.pPic !== ""
              ? pInfo.pPic
              : DEFAULT_AVATAR
          }
          alt="프로필 이미지"
          className="rounded-full w-14 h-14 object-cover border border-neutral-200 bg-white shrink-0"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-base font-bold text-[#111111] truncate">
            {pInfo.pNick
              ? pInfo.pNick
              : pInfo.pName
              ? `${pInfo.pName} 님`
              : "로그인이 필요합니다"}
          </span>
          <span className="text-xs text-neutral-500 truncate mt-0.5">
            {pInfo.pEmail || "대회 참가신청 및 접수내역 관리"}
          </span>

          <div className="flex items-center gap-x-2 mt-3">
            {pInfo.playerUid ? (
              <>
                <button
                  type="button"
                  className="px-4 py-1.5 bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs rounded-full transition cursor-pointer active:scale-95"
                  onClick={() => {
                    setOpen();
                    navigate("/myprofile");
                  }}
                >
                  내 정보 및 신청내역
                </button>
                <button
                  type="button"
                  className="px-3.5 py-1.5 bg-white hover:bg-neutral-100 text-neutral-600 font-semibold text-xs rounded-full border border-neutral-200 transition cursor-pointer active:scale-95"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <button
                type="button"
                className="px-4 py-2 bg-[#111111] hover:bg-neutral-800 text-white font-semibold text-xs rounded-full transition cursor-pointer active:scale-95"
                onClick={handleLogin}
              >
                로그인 / 회원가입
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Menu Links */}
      <div className="flex flex-col divide-y divide-neutral-100">
        {menuLinks.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              setOpen();
              navigate(item.path);
            }}
            className="w-full py-4 px-2 font-semibold text-[15px] text-left text-[#111111] hover:bg-neutral-50 rounded-xl transition flex items-center justify-between cursor-pointer"
          >
            <span>{item.label}</span>
            <IoChevronForward className="text-neutral-400 text-base" />
          </button>
        ))}
      </div>

      {/* Footer Branding */}
      <div className="mt-auto pt-6 border-t border-neutral-100 text-center">
        <span className="text-xs font-medium text-neutral-400">
          보디빌딩 & 피트니스 공식 대회 통합 접수 시스템
        </span>
      </div>
    </div>
  );
};

export default DrawMenu;
