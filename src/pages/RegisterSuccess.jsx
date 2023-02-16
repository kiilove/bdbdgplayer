import React from "react";

const RegisterSuccess = () => {
  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex w-full flex-col items-center align-top mt-10">
          <span className="text-3xl text-orange-500 font-extrabold align-middle">
            BDBDg 가입을 축하합니다.
          </span>
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
