import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiAlertLine } from "react-icons/ri";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";

const LoginError = () => {
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setError(location.state);

    return () => {
      setError("");
    };
  }, [location.state]);

  const getErrorMessage = () => {
    if (error === "auth/wrong-password") {
      return "비밀번호가 일치하지 않습니다. 다시 확인해주세요.";
    }
    if (error === "auth/user-not-found") {
      return "등록된 계정(이메일)을 찾을 수 없습니다.";
    }
    return "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex justify-center pb-24">
      <BottomMenu />
      <div className="w-full max-w-lg flex flex-col">
        <Header title="로그인 오류" />
        <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-full bg-[#141414] border border-neutral-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-700 text-white flex items-center justify-center text-3xl mb-5">
              <RiAlertLine />
            </div>
            <span className="text-xs uppercase font-black tracking-widest text-neutral-400 mb-1">
              Authentication Error
            </span>
            <h2 className="text-lg font-black text-white tracking-tight mb-3">
              로그인에 실패했습니다
            </h2>
            <p className="text-sm text-neutral-300 font-medium mb-6">
              {getErrorMessage()}
            </p>

            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => navigate("/login")}
                className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm uppercase tracking-tight rounded-full transition active:scale-[0.98] shadow-lg cursor-pointer"
              >
                다시 로그인하기
              </button>
              <button
                onClick={() => navigate("/resetpassword")}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white font-bold text-xs uppercase tracking-wider rounded-full border border-neutral-800 transition cursor-pointer"
              >
                계정 / 비밀번호 찾기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginError;
