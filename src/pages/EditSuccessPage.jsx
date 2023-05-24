import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditSuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  return (
    <div className="flex w-full h-screen flex-col bg-white items-center">
      <div
        className="flex flex-col h-screen justify-center items-center"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full flex-col justify-center items-center h-96">
          <h1 className="text-2xl font-semibold text-gray-900 mx-5">
            수정 접수되었습니다.
          </h1>
          <h1 className="text-2xl font-semibold text-gray-900 mx-5 mt-10">
            참가비 변동등이 있을 수 있습니다.
          </h1>
          <h1 className="text-2xl font-semibold text-gray-900 mx-5">
            확인 부탁드립니다.
          </h1>
        </div>
        <div className="flex w-full h-full justify-center items-center">
          <button
            className="w-32 h-12 bg-orange-500 rounded-lg shasdow text-white font-semibold"
            onClick={() => navigate("/")}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSuccessPage;
