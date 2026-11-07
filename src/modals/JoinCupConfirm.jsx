import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import ConfirmModalLayout from "../components/contest/ConfirmModalLayout";
import { useFirestoreAddData } from "../hooks/useFirestores";
import { calculateContestPrice } from "../utils/formatUtils";

const JoinCupConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [invoiceInfo] = useState({ ...propInvoiceInfo });
  const [isLoading, setIsLoading] = useState(false);
  const addInvoice = useFirestoreAddData("invoices_pool");
  const navigate = useNavigate();

  const priceInfo = {
    contestPriceBasic: invoiceInfo.contestPriceBasic,
    contestPriceExtra: invoiceInfo.contestPriceExtra,
    contestPriceExtraType: invoiceInfo.contestPriceExtraType,
    contestPriceType1: invoiceInfo.contestPriceType1,
    contestPriceType2: invoiceInfo.contestPriceType2,
  };

  useEffect(() => {
    setInvoicePrice(calculateContestPrice(invoiceInfo.joins, priceInfo));
  }, [invoiceInfo]);

  const handleInvoice = async () => {
    if (!invoiceInfo.playerName || !invoiceInfo.playerUid) {
      alert(
        "로그인 정보 또는 선수 이름이 누락되었습니다. 다시 로그인 후 시도해 주세요."
      );
      return;
    }
    if (!invoiceInfo.joins || invoiceInfo.joins.length === 0) {
      alert(
        "참가 신청 종목이 선택되지 않았습니다. 돌아가서 종목을 선택해 주세요."
      );
      return;
    }

    setIsLoading(true);
    const randomString = Math.random().toString(36).substring(2, 6);
    const docuId = (
      randomString +
      "-" +
      Date.now().toString().substr(-6)
    ).toUpperCase();

    const rawData = {
      ...invoiceInfo,
      docuId,
      isCanceled: false,
      invoiceCreateAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      contestPriceSum: parseInt(invoicePrice || 0, 10),
      createBy: "web",
    };

    const newData = {};
    Object.keys(rawData).forEach((key) => {
      newData[key] = rawData[key] !== undefined ? rawData[key] : "";
    });

    try {
      await addInvoice.addData(newData);
      setIsLoading(false);
      navigate("/successpage", { replace: true });
    } catch (error) {
      console.error("Save Error:", error);
      setIsLoading(false);
      alert(
        "접수 신청 저장 중 오류가 발생했습니다. 네트워크 또는 로그인 상태를 확인 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <ConfirmModalLayout
      title="참가신청 내용 확인"
      subtitle="신청 정보를 최종 확인 후 접수를 완료해 주세요"
      confirmButtonText="신청서접수"
      invoiceInfo={invoiceInfo}
      invoicePrice={invoicePrice}
      isLoading={isLoading}
      onClose={() => prevSetModal && prevSetModal(false)}
      onConfirm={handleInvoice}
    />
  );
};

export default JoinCupConfirm;
