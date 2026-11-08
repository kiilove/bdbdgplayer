import { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 비로그인 상태에서 대회 신청 클릭 시 로그인 이동 확인 모달을 관리하고,
 * 로그인 성공 후 원래 신청하려던 대회 페이지로 자동 복귀시키는 커스텀 훅
 */
export const useLoginPrompt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState({});
  const [targetRedirectPath, setTargetRedirectPath] = useState("");

  const handleRequireLogin = useCallback((desiredPath = "") => {
    setTargetRedirectPath(
      typeof desiredPath === "string" && desiredPath ? desiredPath : ""
    );
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
    const fromPath =
      targetRedirectPath || `${location.pathname}${location.search}`;
    navigate("/login", { state: { from: fromPath } });
  }, [navigate, targetRedirectPath, location.pathname, location.search]);

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
