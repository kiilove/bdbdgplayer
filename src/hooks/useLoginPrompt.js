import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 비로그인 상태에서 대회 신청 클릭 시 로그인 이동 확인 모달을 관리하는 커스텀 훅
 */
export const useLoginPrompt = () => {
  const navigate = useNavigate();
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState({});

  const handleRequireLogin = useCallback(() => {
    setMessage({
      body: "대회 참가신청을 하려면 로그인이 필요합니다.",
      body2: "로그인 페이지로 이동하시겠습니까?",
      isButton: true,
      confirmButtonText: "로그인 이동",
      cancelButtonText: "취소",
    });
    setMessageOpen(true);
  }, []);

  const redirectLogin = useCallback(() => {
    setMessageOpen(false);
    navigate("/login");
  }, [navigate]);

  const messageClose = useCallback(() => {
    setMessageOpen(false);
  }, []);

  return {
    message,
    messageOpen,
    handleRequireLogin,
    redirectLogin,
    messageClose,
  };
};
