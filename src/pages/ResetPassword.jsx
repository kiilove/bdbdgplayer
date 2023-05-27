import React from "react";
import { RotatingLines } from "react-loader-spinner";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { useState } from "react";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({});
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [emailInfo, setEmailInfo] = useState({});

  const { resetPassword } = useFirebaseAuth();

  const navigate = useNavigate();

  const handleMessageBox = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const handleEmailInput = (e) => {
    setEmailInfo({ email: e.target.value.trim() });
  };

  const handelSendEmail = async () => {
    try {
      const result = await resetPassword(emailInfo.email);
      setMessage({
        body: result.success.message,
        isButton: true,
        confirmButtonText: "확인",
      });
      setMessageOpen(true);
    } catch (error) {
      console.log(error);
      setIsError({ code: error.code, message: error.message });
    }
  };
  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <ConfirmationModal
        isOpen={messageOpen}
        onCancel={handleMessageBox}
        onConfirm={handleMessageBox}
        message={message}
      />
      <div className="flex w-full flex-col items-center">
        <div
          className={`absolute top-0 left-1/2 w-full h-screen bg-orange-600 border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
            !isLoading && "hidden"
          }`}
          style={{
            maxWidth: "420px",
            transform: "translate(-50%, 0%)",
          }}
        >
          <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
        <div className="flex w-full justify-center mt-12 flex-col gap-y-1">
          <div className="flex w-full justify-center items-center h-20">
            <span className="text-2xl text-orange-500 font-bold align-middle">
              BDBDg
            </span>
          </div>

          <p className="text-lg flex justify-center align-middle items-center">
            등록하신 이메일 주소를 통해 비밀번호를 변경할 수 있습니다.
          </p>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "420px" }}
        >
          <div className="flex w-full justify-center items-center gap-x-2">
            <div className="flex">이메일주소 입력</div>
            <div className="flex h-10">
              <input
                type="text"
                className="text px-2"
                value={emailInfo.email}
                onChange={(e) => handleEmailInput(e)}
              />
            </div>
            <div className="flex">
              <button
                onClick={() => {
                  handelSendEmail();
                }}
              >
                전송
              </button>
            </div>
          </div>
          {isError.code && <div>{isError.message}</div>}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
