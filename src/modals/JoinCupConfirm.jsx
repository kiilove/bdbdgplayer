import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModalLayout from "../components/contest/ConfirmModalLayout";
import { handleToast } from "../components/HandleToast";
import { submitNewInvoice } from "../services/contestService";
import { calculateContestPrice } from "../utils/formatUtils";

const JoinCupConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoiceInfo] = useState(() => ({ ...propInvoiceInfo }));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const invoicePrice = useMemo(
    () =>
      calculateContestPrice(invoiceInfo.joins, {
        contestPriceBasic: invoiceInfo.contestPriceBasic,
        contestPriceExtra: invoiceInfo.contestPriceExtra,
        contestPriceExtraType: invoiceInfo.contestPriceExtraType,
        contestPriceType1: invoiceInfo.contestPriceType1,
        contestPriceType2: invoiceInfo.contestPriceType2,
      }),
    [invoiceInfo]
  );

  const handleInvoice = async () => {
    if (!invoiceInfo.playerName || !invoiceInfo.playerUid) {
      handleToast(
        "warn",
        "로그인 정보 또는 선수 이름이 누락되었습니다. 다시 로그인 후 시도해 주세요."
      );
      return;
    }
    if (!invoiceInfo.joins || invoiceInfo.joins.length === 0) {
      handleToast(
        "warn",
        "참가 신청 종목이 선택되지 않았습니다. 종목을 선택해 주세요."
      );
      return;
    }

    setIsLoading(true);
    try {
      await submitNewInvoice(invoiceInfo, invoicePrice);
      setIsLoading(false);
      navigate("/successpage", { replace: true });
    } catch {
      setIsLoading(false);
      handleToast(
        "error",
        "접수 신청 저장 중 오류가 발생했습니다. 네트워크 또는 로그인 상태를 확인해 주세요."
      );
    }
  };

  return (
    <ConfirmModalLayout
      title="참가신청 내용 확인"
      subtitle="신청 정보를 최종 확인 후 접수를 완료해 주세요"
      confirmButtonText="신청서 접수 완료"
      invoiceInfo={invoiceInfo}
      invoicePrice={invoicePrice}
      isLoading={isLoading}
      onClose={() => prevSetModal && prevSetModal(false)}
      onConfirm={handleInvoice}
    />
  );
};

export default JoinCupConfirm;
