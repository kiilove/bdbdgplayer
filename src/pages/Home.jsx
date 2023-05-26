import React, { useContext } from "react";
import { DEFAULT_AVATAR } from "../consts";

import { ResponsiveRadar } from "@nivo/radar";
import BottomMenu from "../components/BottomMenu";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { useFirestoreQuery } from "../hooks/useFirestores";
import { useState } from "react";
import { where } from "firebase/firestore";
import { useEffect } from "react";
import { UserContext } from "../context/UserContext";

const data = [
  {
    point: "신체",
    내점수: 70,
    평균: 104,
  },
  {
    point: "예술",
    내점수: 45,
    평균: 67,
  },
  {
    point: "독창",
    내점수: 88,
    평균: 44,
  },
  {
    point: "규정",
    내점수: 86,
    평균: 112,
  },
  {
    point: "의상",
    내점수: 110,
    평균: 81,
  },
];
const MyResponsiveRadar = ({ data /* see data tab */ }) => (
  <ResponsiveRadar
    data={data}
    keys={["평균", "내점수"]}
    indexBy="point"
    valueFormat=">-.2f"
    margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
    borderColor={["#f1f1f1"]}
    borderWidth={1}
    gridLabelOffset={36}
    dotSize={10}
    dotColor={["#fff"]}
    dotBorderWidth={1}
    colors={["#cfcfcf", "#e9ad08"]}
    motionConfig="wobbly"
    legends={[
      {
        anchor: "top-left",
        direction: "column",
        translateX: -50,
        translateY: -40,
        itemWidth: 80,
        itemHeight: 20,
        itemTextColor: "#999",
        symbolSize: 12,
        symbolShape: "circle",
        effects: [
          {
            on: "hover",
            style: {
              itemTextColor: "#000",
            },
          },
        ],
      },
    ]}
  />
);

const Home = () => {
  const { currentUserInfo: pInfo } = useContext(UserContext);
  // const { userInfo } = useContext(AuthContext);
  // const { pInfo } = useContext(PlayerEditContext);
  const [isJoin, setIsJoin] = useState(false);
  const [invoiceId, setInvoiceId] = useState("");
  const navigate = useNavigate();
  const getQuery = useFirestoreQuery();

  const fetchQuery = async () => {
    const conditions = [where("playerUid", "==", pInfo.pUid)];
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
    fetchQuery();
  }, []);

  return (
    <div className="flex justify-center items-start align-top bg-slate-100">
      <BottomMenu />
      <div
        className="flex justify-center mt-3 flex-col gap-y-8 px-2 w-full"
        style={{ maxWidth: "420px" }}
      >
        <div className="flex w-full justify-start">
          <span className="flex text-lg font-extrabold">BDBDg</span>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex w-1/2 h-full justify-start flex-col gap-y-3 mt-6">
            <p className="text-3xl font-light">Hi~</p>
            <p className="text-2xl font-base">
              {pInfo.pNick ? pInfo.pNick : pInfo.pName} 님
            </p>
          </div>
          <div className="flex w-1/2 justify-end">
            <div className="flex">
              <img
                src={
                  (pInfo.pPic !== null || undefined || "") &&
                  (pInfo.pPic || DEFAULT_AVATAR)
                }
                className="rounded-full w-32 h-32"
              />
            </div>
          </div>
        </div>
        <div className="flex w-full h-full flex-col">
          <div className="flex h-full bg-white w-full rounded-lg shadow-sm flex-col ">
            <div className="flex">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/bdbdgmain.appspot.com/o/images%2Fposter%2Fcompress%2Fbdbdg_1684842361004?alt=media&token=a8a289bd-3450-4d3a-8f2f-ab49289876ec"
                className="object-cover w-full h-full rounded-lg "
              />
            </div>
            <div className="flex w-full h-10 px-2">
              {isJoin && (
                <button
                  className="flex w-full bg-orange-500 h-8 rounded-lg shadow justify-center items-center text-white"
                  onClick={() => navigate(`/contestjoinedit/${invoiceId}`)}
                >
                  변경신청
                </button>
              )}
              {!isJoin && (
                <button
                  className="flex w-full bg-orange-500 h-8 rounded-lg shadow justify-center items-center text-white"
                  onClick={() => {
                    navigate("/contestjoin/GVD75Y1hAMFzsqMnRge1");
                  }}
                >
                  참가신청
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full h-full flex-col">
          <div className="flex w-full justify-between h-10 mb-2">
            <span className="flex h-10 text-lg text-gray-600 items-end">
              나의 모습 분석
            </span>
            <Link to="/analyzedetail">
              <span className="flex h-10 text-sm text-gray-600 items-end">
                상세보기
              </span>
            </Link>
          </div>
          <div className="flex h-80 bg-white w-full rounded-lg shadow-sm flex-col relative">
            <MyResponsiveRadar data={data} />
            <div className="flex absolute left-0 top-0 bg-white w-full h-full rounded-lg opacity-70 justify-center items-center">
              현재 준비중입니다.
            </div>
          </div>
        </div>
        <div className="flex w-full h-full flex-col">
          <div className="flex w-full justify-between h-10 mb-2">
            <span className="flex h-10 text-lg text-gray-600 items-end">
              나의 대회 사진
            </span>
            <span className="flex h-10 text-sm text-gray-600 items-end">
              더보기
            </span>
          </div>
          <div className="flex h-60 bg-white w-full rounded-lg shadow-sm p-5 mb-20 gap-x-2 overflow-x-auto overflow-y-hidden flex-nowrap relative">
            <div className="flex absolute left-0 top-0 bg-white w-full h-full rounded-lg opacity-70 justify-center items-center">
              현재 준비중입니다.
            </div>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmsyrN_VtrlXd3FkyugXUBrmKvlowe_nq3aQ&usqp=CAU"
              className="w-32 h-48 object-cover rounded-lg"
            />

            <img
              src="https://mblogthumb-phinf.pstatic.net/20160911_38/wju0504_1473605742521bF9uO_JPEG/2016_yongin_%281903%29_%BB%E7%BA%BB.jpg?type=w2"
              className="w-32 h-48 object-cover rounded-lg"
            />

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG_glhcj_QrJsmWWhTsvPw5x4GxKsKSF7Lqg&usqp=CAU"
              className="w-32 h-48 object-cover rounded-lg"
            />

            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtP8XZJETvg0drg8cUGXENNaD9IclYEgSWGQ&usqp=CAU"
              className="w-32 h-48 object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
