import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#F6F8FB] text-[#191F28] p-4 font-sans antialiased">
      <div className="flex w-full flex-col items-center max-w-md bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-1">
            <span className="text-2xl font-black text-[#191F28] tracking-tighter">
              BDBDG<span className="text-[#2563EB]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191F28] tracking-tight">
            선수 회원가입
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            간편하게 가입하고 공식 보디빌딩 대회에 참가신청하세요.
          </p>
        </div>

        <button
          type="button"
          className="w-full py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-[15px] rounded-full shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition cursor-pointer text-center"
          onClick={() => navigate("/registeremail")}
        >
          이메일 계정으로 가입하기
        </button>

        <div className="flex justify-center items-center mt-8 pt-6 border-t border-slate-100 w-full text-center">
          <p className="text-sm text-slate-500 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-[#2563EB] font-bold ml-2 underline underline-offset-4">
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
