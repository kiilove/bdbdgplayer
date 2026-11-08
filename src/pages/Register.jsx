import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#F4F5FA] text-[#0F172A] p-4 font-sans antialiased">
      <div className="flex w-full flex-col items-center max-w-md bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(15,23,42,0.05)]">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-1">
            <span className="text-2xl font-black text-[#0F172A] tracking-tighter">
              BDBDG<span className="text-[#FF2E54]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            선수 회원가입
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            간편하게 가입하고 공식 보디빌딩 대회에 참가신청하세요.
          </p>
        </div>

        <button
          type="button"
          className="w-full py-4 bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] hover:from-[#4338CA] hover:to-[#6D28D9] text-white font-bold text-[15px] rounded-xl shadow-[0_6px_18px_rgba(79,70,229,0.28)] transition cursor-pointer text-center"
          onClick={() => navigate("/registeremail")}
        >
          이메일 계정으로 가입하기
        </button>

        <div className="flex justify-center items-center mt-8 pt-6 border-t border-slate-100 w-full text-center">
          <p className="text-sm text-slate-500 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-[#4F46E5] font-bold ml-2 underline underline-offset-4">
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
