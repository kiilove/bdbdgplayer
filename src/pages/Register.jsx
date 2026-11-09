import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PosterWallBackground from "../components/common/PosterWallBackground";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex w-full min-h-screen justify-center items-center bg-[#F6F7F9] text-[#111111] p-4 font-sans antialiased">
      <PosterWallBackground />
      <div className="relative z-10 flex w-full flex-col items-center max-w-md bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-1">
            <span className="text-2xl font-black text-[#111111] tracking-tighter">
              BDBDG<span className="text-[#FF3B30]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            선수 회원가입
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            간편하게 가입하고 공식 보디빌딩 대회에 참가신청하세요.
          </p>
        </div>

        <button
          type="button"
          className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-xl transition cursor-pointer text-center active:scale-[0.99]"
          onClick={() => navigate("/registeremail")}
        >
          이메일 계정으로 가입하기
        </button>

        <div className="flex justify-center items-center mt-8 pt-6 border-t border-neutral-100 w-full text-center">
          <p className="text-sm text-neutral-500 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-[#111111] font-bold ml-2 underline underline-offset-4">
                로그인하기
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
