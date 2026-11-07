import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import {
  fetchActiveContests,
  fetchUserActiveInvoiceMap,
} from "../services/contestService";

export const useActiveContests = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [contests, setContests] = useState([]);
  const [invoices, setInvoices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadContests = async () => {
      setIsLoading(true);
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
    const playerUid = pInfo?.playerUid;

    if (!playerUid) {
      setInvoices({});
      return undefined;
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
  }, [pInfo?.playerUid]);

  return {
    contests,
    invoices,
    isLoading,
    error,
    playerInfo: pInfo,
  };
};
