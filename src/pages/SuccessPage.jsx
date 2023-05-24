import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/", { replace: true });
  //   }, 3000);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [navigate]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCountdown((prevCountdown) => prevCountdown - 1);
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);

  return (
    <div className="flex w-full h-screen flex-col bg-white items-center">
      <div
        className="flex flex-col h-screen justify-center items-center"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full flex-col justify-center items-center h-96">
          <h1 className="text-2xl font-semibold text-gray-900 mx-5">
            정상적으로 접수되었습니다.
          </h1>
          <h1 className="text-2xl font-semibold text-gray-900 mx-5">
            참여해주셔서 감사합니다.
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

export default SuccessPage;
