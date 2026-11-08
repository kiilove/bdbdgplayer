import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  fetchActiveContests,
  fetchUserActiveInvoiceMap,
  getCachedActiveContests,
  getCachedUserInvoiceMap,
} from "../services/contestService";

export const useActiveContests = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const playerUid = pInfo?.playerUid;

  // 캐시가 존재하면 초기 렌더링부터 로딩 스피너 없이 즉시 데이터 표시
  const [contests, setContests] = useState(
    () => getCachedActiveContests() || []
  );
  const [invoices, setInvoices] = useState(
    () => getCachedUserInvoiceMap(playerUid) || {}
  );
  const [isLoading, setIsLoading] = useState(
    () => !getCachedActiveContests()
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContests = async () => {
      if (!getCachedActiveContests()) {
        setIsLoading(true);
      }
      try {
        const list = await fetchActiveContests();
        if (isMounted) {
          setContests(list);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContests();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (!playerUid) {
      setInvoices({});
      return undefined;
    }

    const cachedMap = getCachedUserInvoiceMap(playerUid);
    if (cachedMap) {
      setInvoices(cachedMap);
    }

    fetchUserActiveInvoiceMap(playerUid)
      .then((invMap) => {
        if (isMounted) {
          setInvoices(invMap);
        }
      })
      .catch(() => {
        // Non-blocking invoice lookup error
      });

    return () => {
      isMounted = false;
    };
  }, [playerUid]);

  return {
    contests,
    invoices,
    isLoading,
    error,
    playerInfo: pInfo,
  };
};
