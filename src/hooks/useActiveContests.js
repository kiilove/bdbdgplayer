import { useState, useEffect, useContext } from "react";
import { where } from "firebase/firestore";
import { useFirestoreQuery } from "./useFirestores";
import { UserContext } from "../context/UserContext";

export const useActiveContests = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [contests, setContests] = useState([]);
  const [invoices, setInvoices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const getQuery = useFirestoreQuery();

  const fetchContests = async () => {
    setIsLoading(true);
    const conditions = [where("contestStatus", "==", "접수중")];
    try {
      const data = await getQuery.getDocuments(
        "contest_notice",
        conditions,
        "contestDate"
      );
      setContests(data && data.length > 0 ? data : []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserInvoices = async (playerUid) => {
    if (!playerUid) {
      setInvoices({});
      return;
    }
    const conditions = [where("playerUid", "==", playerUid)];
    try {
      const data = await getQuery.getDocuments("invoices_pool", conditions);
      if (data && data.length > 0) {
        const invMap = {};
        data.forEach((inv) => {
          if (!inv.isCanceled && inv.contestId) {
            invMap[inv.contestId] = inv.id;
          }
        });
        setInvoices(invMap);
      } else {
        setInvoices({});
      }
    } catch (err) {
      // Non-blocking invoice lookup error
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    if (pInfo?.playerUid) {
      fetchUserInvoices(pInfo.playerUid);
    } else {
      setInvoices({});
    }
  }, [pInfo?.playerUid]);

  return {
    contests,
    invoices,
    isLoading,
    error,
    playerInfo: pInfo,
  };
};

