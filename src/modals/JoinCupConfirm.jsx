import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ConfirmModalLayout from "../components/contest/ConfirmModalLayout";
import { handleToast } from "../components/HandleToast";
import {
  useFirestoreAddData,
  useFirestoreQuery,
} from "../hooks/useFirestores";
import { calculateContestPrice } from "../utils/formatUtils";

const SAFE_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

const createReceiptCode = () => {
  const datePart = dayjs().format("YYMMDD");
  const randomBytes = new Uint32Array(6);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(randomBytes);
  } else {
    for (let i = 0; i < 6; i++) {
      randomBytes[i] = Math.floor(Math.random() * 100000);
    }
  }
  let randomPart = "";
  for (let i = 0; i < 6; i++) {
    randomPart += SAFE_CHARS[randomBytes[i] % SAFE_CHARS.length];
  }
  return `${datePart}-${randomPart}`;
};

const JoinCupConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [invoiceInfo] = useState({ ...propInvoiceInfo });
  const [isLoading, setIsLoading] = useState(false);
  const addInvoice = useFirestoreAddData("invoices_pool");
  const checkDuplicateQuery = useFirestoreQuery();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceInfo]);

  const generateUniqueDocuId = async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = createReceiptCode();
      try {
        const existing = await checkDuplicateQuery.getDocuments(
          "invoices_pool",
          [where("docuId", "==", candidate)]
        );
        if (!existing || existing.length === 0) {
          return candidate;
        }
      } catch (e) {
        return candidate;
      }
    }
    return `${dayjs().format("YYMMDD")}-${Date.now()
      .toString(36)
      .slice(-6)
      .toUpperCase()}`;
  };

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
      const docuId = await generateUniqueDocuId();

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

      await addInvoice.addData(newData);
      setIsLoading(false);
      navigate("/successpage", { replace: true });
    } catch (error) {
      console.error("Save Error:", error);
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
