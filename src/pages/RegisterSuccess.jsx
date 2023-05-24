import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <div className="flex flex-col w-full justify-center items-center h-full">
        <div className="flex w-full flex-col items-center align-top">
          <span className="text-4xl text-orange-500 font-extrabold align-middle">
            BDBDg 가입을 축하합니다.
          </span>
        </div>
        <div className="text-xl flex w-full flex-col items-center align-top mt-10">
          <span className="text-gray-800  align-middle">
            대회참가 신청을 위해선 몇가지 정보가 더 필요합니다.
          </span>
        </div>
        <div className="text-xl flex w-full flex-col items-center align-top">
          <span className="text-gray-800  align-middle">
            지금 바로 프로필 설정을 하시면 대회참가 신청이 더 쉬워집니다.
          </span>
        </div>
        <div className="text-xl flex w-full flex-col items-center align-top">
          <span className="text-gray-800  align-middle">
            방금 가입한 정보로 로그인후 프로필 설정해주세요.
          </span>
        </div>

        <div className="flex w-full justify-center items-center">
          <button
            className="w-32 h-12 bg-orange-400 rounded-md border-gray-300 border mt-5"
            onClick={() => navigate("/login")}
          >
            <span className=" text-base font-medium text-white">
              로그인하러가기
            </span>
          </button>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "400px" }}
        ></div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
