import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModalLayout from "../components/contest/ConfirmModalLayout";
import { handleToast } from "../components/HandleToast";
import { submitUpdatedInvoice } from "../services/contestService";
import { calculateContestPrice } from "../utils/formatUtils";

const JoinCupEditConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoiceInfo] = useState(() => ({ ...propInvoiceInfo }));
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const priceInfo = useMemo(
    () => ({
      contestPriceBasic: invoiceInfo.contestPriceBasic,
      contestPriceExtra: invoiceInfo.contestPriceExtra,
      contestPriceExtraType: invoiceInfo.contestPriceExtraType,
      contestPriceType1: invoiceInfo.contestPriceType1,
      contestPriceType2: invoiceInfo.contestPriceType2,
    }),
    [invoiceInfo]
  );

  const invoicePrice = useMemo(
    () => calculateContestPrice(invoiceInfo.joins, priceInfo),
    [invoiceInfo.joins, priceInfo]
  );

  const handleInvoice = async () => {
    setIsLoading(true);
    try {
      await submitUpdatedInvoice(invoiceInfo, priceInfo);
      setIsLoading(false);
      navigate("/editsuccesspage", { replace: true });
    } catch {
      setIsLoading(false);
      handleToast(
        "error",
        "신청 정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <ConfirmModalLayout
      title="변경내용 확인"
      subtitle="수정된 신청 정보를 최종 확인해 주세요"
      confirmButtonText="변경신청 완료"
      invoiceInfo={invoiceInfo}
      invoicePrice={invoicePrice}
      isLoading={isLoading}
      onClose={() => prevSetModal && prevSetModal(false)}
      onConfirm={handleInvoice}
    />
  );
};

export default JoinCupEditConfirm;
