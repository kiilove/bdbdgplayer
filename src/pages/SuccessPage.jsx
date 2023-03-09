import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>감사합니다.</h1>
      <p>곧 첫화면으로 이동합니다. {countdown} 초...</p>
    </div>
  );
};

export default SuccessPage;
