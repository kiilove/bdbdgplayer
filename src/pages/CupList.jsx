import React, { useContext } from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import moment from "moment";
import { useMemo } from "react";
import { useState } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { RotatingLines } from "react-loader-spinner";
import { async } from "q";
import { useEffect } from "react";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestores";
import dayjs from "dayjs";
import { AuthContext } from "../context/AuthContext";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { UserContext } from "../context/UserContext";

const CupList = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoin, setIsJoin] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const [noticeList, setNoticeList] = useState([]);
  const [error, setError] = useState(false);
  const getQuery = useFirestoreQuery();

  const navigate = useNavigate();

  const redirectLogin = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const messageClose = () => {
    setMessageOpen(false);
  };

  const fetchNotice = async () => {
    setIsLoading(true);
    const conditions = [where("contestStatus", "==", "접수중")];
    try {
      const data = await getQuery.getDocuments(
        "contest_notice",
        conditions,
        "contestDate"
      );

      if (data.length > 0) {
        setNoticeList([...data]);
      } else {
        setNoticeList([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuery = async () => {
    const conditions = [where("playerUid", "==", pInfo.playerUid)];
    try {
      const data = await getQuery.getDocuments("invoices_pool", conditions);
      if (data.length > 0) {
        setIsJoin(true);

        setInvoiceId(data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  useEffect(() => {
    fetchQuery();
  }, [noticeList]);

  return (
    <div className="flex justify-center items-start align-top bg-white">
      {isLoading && (
        <div
          className={`absolute top-0 left-1/2 w-full h-full border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center`}
          style={{
            backgroundColor: "rgba(123, 124, 129, 0.4)",
            maxWidth: "420px",
            transform: "translate(-50%, 0%)",
          }}
        >
          <RotatingLines
            strokeColor="white"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}
      {error && <div>error</div>}
      {!isLoading && (
        <>
          <BottomMenu />
          <ConfirmationModal
            isOpen={messageOpen}
            onConfirm={redirectLogin}
            onCancel={messageClose}
            message={message}
          />
          <div
            className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
            style={{ maxWidth: "420px" }}
          >
            <Header title="대회 일정" />
            <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-slate-100 px-2 mb-10">
              <div className="flex flex-col w-full gap-y-5 mt-5 mb-5">
                {noticeList?.length > 0 &&
                  noticeList.map((item, idx) => {
                    let titleLink =
                      "https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fblank%2Fdefault_poster.jpg?alt=media&token=9501d1f2-3e92-45f3-9d54-8d8746ba288d";
                    if (item.contestPoster) {
                      titleLink = item.contestPoster;
                    }
                    return (
                      <div className="flex w-full h-auto flex-col bg-white rounded-lg shadow-sm cursor-pointer">
                        <div className="flex w-full h-auto">
                          <img
                            src={titleLink}
                            alt=""
                            className="w-full h-full object-cover object-center rounded-t-lg"
                          />
                        </div>
                        <div className="flex w-full justify-center items-center h-full">
                          <div className="flex w-3/4 flex-col">
                            <div className="flex w-full h-auto p-2">
                              <span className="text-sm">
                                {item.contestTitle}
                              </span>
                            </div>
                            <div className="flex w-full h-auto p-2">
                              <span className="text-sm">
                                {dayjs(item.contestDate).format("YYYY-MM-DD")}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-1/4">
                            {isJoin && (
                              <button
                                className="w-full flex justify-center items-center bg-orange-300 h-10 rounded-lg mr-2"
                                onClick={() =>
                                  navigate(`/contestjoinedit/${invoiceId}`)
                                }
                              >
                                변경신청
                              </button>
                            )}
                            {!isJoin &&
                              (pInfo.playerUid ? (
                                <button
                                  className="flex w-full bg-orange-500 h-8 rounded-lg shadow justify-center items-center text-white"
                                  onClick={() => {
                                    navigate(
                                      "/contestjoin/GVD75Y1hAMFzsqMnRge1"
                                    );
                                  }}
                                >
                                  참가신청
                                </button>
                              ) : (
                                <button
                                  className="flex w-full bg-orange-500 h-8 rounded-lg shadow justify-center items-center text-white"
                                  onClick={() => {
                                    setMessage({
                                      body: "로그인이 필요합니다.",
                                      isButton: true,
                                      confirmButtonText: "이동",
                                    });
                                    setMessageOpen(true);
                                  }}
                                >
                                  참가신청
                                </button>
                              ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CupList;
