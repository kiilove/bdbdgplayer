import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ConfirmModalLayout from "../components/contest/ConfirmModalLayout";
import {
  useFirestoreDeleteData,
  useFirestoreQuery,
  useFirestoreUpdateData,
} from "../hooks/useFirestores";
import { calculateContestPrice } from "../utils/formatUtils";

const JoinCupEditConfirm = ({ propInvoiceInfo, prevSetModal }) => {
  const [invoicePrice, setInvoicePrice] = useState(0);
  const [invoiceInfo] = useState({ ...propInvoiceInfo });
  const [isLoading, setIsLoading] = useState(false);
  const updateInvoice = useFirestoreUpdateData("invoices_pool");
  const deleteEntries = useFirestoreDeleteData("contest_entrys_list");
  const fetchEntriesQuery = useFirestoreQuery();
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

  const handleCleanUpEntryList = async (data) => {
    const condition = [where("playerUid", "==", data.playerUid)];
    const returnEntries = await fetchEntriesQuery.getDocuments(
      "contest_entrys_list",
      condition
    );

    if (returnEntries?.length > 0) {
      await Promise.all(
        returnEntries.map(async (entry) => {
          try {
            await deleteEntries.deleteData(entry.id);
          } catch (error) {
            // error handled
          }
        })
      );
    }
  };

  const handleInvoice = async () => {
    setIsLoading(true);
    const newData = {
      ...invoiceInfo,
      invoiceEdited: true,
      isPriceCheck: false,
      invoiceEditAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
      contestPriceSum:
        parseInt(calculateContestPrice(invoiceInfo.joins, priceInfo), 10) || 0,
      createBy: "web",
    };

    try {
      await handleCleanUpEntryList(invoiceInfo);
      await updateInvoice.updateData(invoiceInfo.id, newData);
      setIsLoading(false);
      navigate("/editsuccesspage", { replace: true });
    } catch (error) {
      console.error("Update Error:", error);
      setIsLoading(false);
      alert(
        "신청 정보 수정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요."
      );
    }
  };

  return (
    <ConfirmModalLayout
      title="변경내용 확인"
      subtitle="수정된 신청 정보를 최종 확인해 주세요"
      confirmButtonText="변경신청"
      invoiceInfo={invoiceInfo}
      invoicePrice={invoicePrice}
      isLoading={isLoading}
      onClose={() => prevSetModal && prevSetModal(false)}
      onConfirm={handleInvoice}
    />
  );
};

export default JoinCupEditConfirm;
