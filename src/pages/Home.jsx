import React, { useContext, useState, useEffect } from "react";
import { DEFAULT_AVATAR } from "../consts";
import { ResponsiveRadar } from "@nivo/radar";
import BottomMenu from "../components/BottomMenu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { where } from "firebase/firestore";
import { UserContext } from "../context/UserContext";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { Button, Card, Spin } from "antd";
import Meta from "antd/es/card/Meta";
import { saveAs } from "file-saver";

const Home = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  const [selectedContest, setSelectedContest] = useState({});
  const [activeContests, setActiveContests] = useState([]);
  const [message, setMessage] = useState({});
  const [messageOpen, setMessageOpen] = useState(false);
  const [noActiveOpen, setNoActiveOpen] = useState(false);
  const [joinErrorOpen, setJoinErrorOpen] = useState(false);
  const [isJoin, setIsJoin] = useState(false);
  const [invoiceId, setInvoiceId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const getContest = useFirestoreQuery();
  const getQuery = useFirestoreQuery();

  const DEFAULT_POSTER =
    "https://firebasestorage.googleapis.com/v0/b/bdbdgmain.appspot.com/o/images%2F2024-09-03_06-53-49_9248.png?alt=media&token=ac3c2647-9d24-4955-9ec8-eff1ca125c3f";

  const fetchContest = async () => {
    const condition = [where("contestStatus", "==", "접수중")];
    try {
      const contests = await getContest.getDocuments(
        "contest_notice",
        condition
      );
      if (contests.length === 0) {
        setNoActiveOpen(true);
      } else {
        setActiveContests(contests);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuery = async (playerUid, contestId) => {
    const conditions = [
      where("playerUid", "==", playerUid),
      where("contestId", "==", contestId),
    ];
    try {
      const data = await getQuery.getDocuments("invoices_pool", conditions);
      if (data.length > 1) {
        setJoinErrorOpen(true);
      } else if (data.length === 1) {
        setInvoiceId((prevInvoiceId) => [
          ...prevInvoiceId,
          { contestId, invoiceId: data[0].id },
        ]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const redirectLogin = () => {
    navigate("/login");
    setMessageOpen(false);
  };

  const messageClose = () => setMessageOpen(false);

  useEffect(() => {
    const loadContent = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2초간 로딩
      await fetchContest();
    };
    loadContent();
  }, []);

  useEffect(() => {
    if (pInfo?.playerUid && activeContests.length > 0) {
      activeContests.forEach((item) =>
        fetchQuery(pInfo.playerUid, item.refContestId)
      );
    }
  }, [pInfo?.playerUid, activeContests]);

  const fileSave = (fileUrl) => {
    const fileURL = fileUrl;

    saveAs(fileURL, "filename.hwp");
  };

  return (
    <>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <div className="flex justify-center items-start bg-slate-100">
          <ConfirmationModal
            isOpen={messageOpen}
            onConfirm={redirectLogin}
            onCancel={messageClose}
            message={message}
          />
          <ConfirmationModal
            isOpen={noActiveOpen}
            onConfirm={() => setNoActiveOpen(false)}
            onCancel={() => setNoActiveOpen(false)}
            message={{
              body: "접수중인 대화가 없습니다.",
              isButton: true,
              confirmButtonText: "확인",
            }}
          />
          <ConfirmationModal
            isOpen={joinErrorOpen}
            onConfirm={() => setJoinErrorOpen(false)}
            onCancel={() => setJoinErrorOpen(false)}
            message={{
              body: "잘못된 접수현황이 확인되었습니다.",
              body2: "협회측에 문의해주세요.",
              isButton: true,
              confirmButtonText: "확인",
            }}
          />
          <div
            className="flex justify-center mt-3 flex-col gap-y-8 px-2 w-full"
            style={{ maxWidth: "420px" }}
          >
            <div className="flex w-full justify-center">
              <span className="text-xl font-extrabold">대회접수</span>
            </div>
            {pInfo.playerUid && (
              <div className="flex w-full justify-between">
                <div className="flex flex-col gap-y-3 mt-6">
                  <p className="text-3xl font-light">Hi~</p>
                  <p className="text-2xl font-base">
                    {pInfo.pNick || pInfo.pName} 님
                  </p>
                </div>
                <div className="flex">
                  <img
                    src={pInfo.pPic || DEFAULT_AVATAR}
                    className="rounded-full w-32 h-32"
                    alt="avatar"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2">
              {activeContests.length > 0 &&
                activeContests.map((item) => {
                  const {
                    contestPoster,
                    contestTitle,
                    contestAssociate,
                    contestPromoter,
                    contestDate,
                    contestLocation,
                    refContestId,
                    contestCollectionFileLink,
                    id,
                  } = item;

                  const findInvoice = invoiceId.find(
                    (f) => f.contestId === refContestId
                  );

                  const actionButton = pInfo.playerUid ? (
                    findInvoice?.invoiceId ? (
                      <div
                        onClick={() =>
                          navigate(`/contestjoinedit/${findInvoice.invoiceId}`)
                        }
                      >
                        변경신청
                      </div>
                    ) : (
                      <div onClick={() => navigate(`/contestjoin/${id}`)}>
                        접수
                      </div>
                    )
                  ) : (
                    <div onClick={() => navigate("/login")}>
                      로그인이 필요합니다.
                    </div>
                  );

                  return (
                    <Card
                      hoverable
                      key={refContestId}
                      cover={
                        <img
                          src={contestPoster || DEFAULT_POSTER}
                          alt="poster"
                        />
                      }
                      actions={[
                        actionButton,
                        <div
                          onClick={() => fileSave(contestCollectionFileLink)}
                        >
                          공고문
                        </div>,
                      ]}
                    >
                      <Meta
                        title={contestTitle}
                        description={
                          <div className="flex flex-col">
                            <div>대회일자 : {contestDate}</div>
                            <div>대회장소 : {contestLocation}</div>
                            <div>
                              {contestAssociate}/{contestPromoter}
                            </div>
                          </div>
                        }
                      />
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
