import React from "react";
import { DEFAULT_AVATAR } from "../consts";
import QrGenerator from "./QrGenerator";
import { IoLogOutOutline, IoCloseOutline } from "react-icons/io5";

const DrawMenu = ({ setOpen }) => {
  return (
    <div className="flex w-full h-screen flex-col">
      <div className="flex w-full px-1 py-10">
        <div className="flex w-1/3 h-14 justify-start items-center align-middle flex-col gap-y-2">
          <img src={DEFAULT_AVATAR} className="rounded-full w-16 h-16" />
          <button className="bg-orange-400 rounded-md px-2 py-1 flex justify-center items-center">
            <span className="text-xs text-white">프로필설정</span>
          </button>
        </div>
        <div className="flex w-2/3 h-full justify-start items-start align-middle flex-col">
          <div className="flex w-full h-full justify-center items-start align-middle flex-col">
            <span className="text-base font-semibold">김진배 님</span>
          </div>
          <div className="flex w-full h-full justify-center items-start align-middle flex-col">
            <span className="text-base ">kiilove@naver.com</span>
          </div>
        </div>
      </div>

      <div className="flex w-full p-5 flex-col gap-y-5">
        <div className="flex w-full h-full py-3 justify-between">
          <div className="flex">QR인증</div>
          <div className="flex">
            <button className="border border-blue-600 rounded-md px-1 py-1 flex justify-center items-center" onClick={()=> window.location.href = "/qrfull"}>
              <span className=" text-xs text-blue-800 font-light">
                크게보기
              </span>
            </button>
          </div>
        </div>

        <div className="flex w-full justify-center items-center h-full">
          <div className="flex w-48 h-48 bg-blue-500 rounded-lg p-5 justify-center items-center">
            <QrGenerator />
          </div>
        </div>
      </div>
      <div className="flex w-full justify-start items-end  h-full mb-24 p-5">
        <div className="flex w-full justify-start items-center gap-x-2">
          <span>
            <IoLogOutOutline className="text-gray-500 text-xl" />
          </span>
          <span className="text-gray-500">로그아웃</span>
        </div>
        <div className="flex w-full justify-end items-center gap-x-2">
          <span>
            <IoCloseOutline className="text-gray-500 text-xl" />
          </span>
          <span className="text-gray-500" onClick={() => setOpen()}>
            닫기
          </span>
        </div>
      </div>
    </div>
  );
};

export default DrawMenu;
