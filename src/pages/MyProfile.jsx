import React, { useContext } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { DEFAULT_AVATAR } from "../consts";
import { AuthContext } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
const MyProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title="내 프로필" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
          <div className="flex flex-col w-full mt-5 mb-5">
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <button
                className="flex h-full w-full justify-center items-center"
                onClick={() =>
                  navigate("/editprofile", { state: { editType: "pPic" } })
                }
              >
                <img src={DEFAULT_AVATAR} className="rounded-3xl w-24 h-24" />
              </button>
              <button className="flex w-7 h-7 rounded-xl relative -top-7 left-52 bg-white shadow justify-center items-center">
                <BsFillCameraFill className="text-gray-600" />
              </button>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <span className="text-sm">실명</span>
              <span className="text-sm font-light text-gray-400">
                {currentUser.pName || "실명 확인이 필요합니다."}
              </span>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <span className="text-sm">전화번호</span>
              <span className="text-sm font-light text-gray-400">
                {currentUser.pTel || "전화번호 입력이 필요합니다."}
              </span>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <span className="text-sm">이메일</span>
              <span className="text-sm font-light text-gray-400">
                {currentUser.pEmail || "이메일 확인이 필요합니다."}
              </span>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <span className="text-sm">닉네임</span>
              <span className="text-sm font-light text-gray-400">
                {currentUser.pNick || "닉네임을 설정할 수 있습니다."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
