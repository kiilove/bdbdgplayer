import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";

const LoginError = () => {
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    setError(location.state);

    return () => {
      setError("");
    };
  }, [location.state]);

  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title="로그인 오류" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-slate-100 px-2">
          <div className="flex flex-col w-full gap-y-5 mt-5 mb-5">
            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm p-4 gap-y-1">
              {error === "auth/wrong-password" && (
                <span className="text-md">비밀번호 오류가 있습니다.</span>
              )}
              {error === "auth/user-not-found" && (
                <span className="text-md">등록된 이메일 주소가 없습니다.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginError;
