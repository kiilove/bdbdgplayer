import { doc, getDoc } from "firebase/firestore";
import React from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { RxCopy } from "react-icons/rx";
import moment from "moment";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { db } from "../firebase";
import { DEFAULT_AVATAR } from "../consts";

const CupJoin = () => {
  const params = useParams();
  const [cupId, setCupId] = useState(params.cupId);
  const [cupData, setCupData] = useState({
    cupInfo: {
      cupName: "",
      cupOrg: "",
      cupDate: { startDate: "", endDate: "" },
      cupLocation: "",
      cupPoster: [],
      cupState: "",
      cupNotice: "많은 참여 부탁드립니다.",
    },
    gamesCategory: [],
    refereeAssing: [],
    refereePool: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const getCup = async () => {
    setIsLoading(true);
    await getDoc(doc(db, "cups", cupId))
      .then((data) => {
        return data.data();
      })
      .then((data) => {
        setCupData((prev) => (prev = { ...data }));
      })
      .then(() => setIsLoading(false))
      .catch((error) => console.log(error));
  };

  useMemo(() => getCup(), []);
  useMemo(() => console.log(cupData), [cupData]);
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="참가신청" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-slate-100 px-2">
          <div className="flex flex-col w-full gap-y-5 mt-5 mb-5">
            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm p-4 gap-y-1">
              <span className="text-md">모집요강</span>
              <span className="text-sm font-light ">
                대회명 : {cupData.cupInfo.cupName}
              </span>
              <span className="text-sm font-light ">
                대회일자 :{" "}
                {moment(cupData.cupInfo.cupDate.startDate).format("YYYY-MM-DD")}
              </span>
              <span className="text-sm font-light ">
                대회장소 : {cupData.cupInfo.cupLocation}
              </span>
              <span className="text-sm font-light ">
                주최기관 : {cupData.cupInfo.cupOrg}
              </span>
              <span className="text-sm font-light ">참가비 : 100,000원</span>
              <span className="text-sm font-light ">계좌번호 :</span>
              <div className="flex">
                <div className="flex flex-col">
                  <span className="text-sm font-light">
                    대한은행 : 000-0000-00000-0000
                  </span>
                  <span className="text-sm font-light">
                    예금주 :경기도용인보디빌딩협회
                  </span>
                </div>
                <div className="flex justify-center items-top mt-1 ml-2">
                  <RxCopy />
                </div>
              </div>
              <span className="text-sm font-light">
                종목 :{" "}
                {cupData.gamesCategory.length > 0
                  ? cupData.gamesCategory.filter(
                      (filter) => filter.launched === true
                    ).length
                  : "0"}
              </span>
              {/* <span className="text-sm font-light">
                {cupData.gamesCategory.length > 0 &&
                  cupData.gamesCategory
                    .filter((filter) => filter.launched === true)
                    .map((game, idx) => game.title + " / ")}
              </span> */}

              <span className="text-sm font-light">공지사항</span>
              <span className="text-sm font-light">
                {cupData.cupInfo.cupNotice
                  ? cupData.cupInfo.cupNotice
                  : "많은 관심 부탁드립니다."}
              </span>
            </div>
            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm gap-y-1">
              <div className="flex w-full items-start justify-center p-4 flex-col">
                <span>프로필 확인</span>
                <span className="text-sm font-light">
                  프로필에 따라 참가 가능 종목을 필터링 해드립니다.
                </span>
              </div>
              <div className="flex w-full items-center justify-start">
                <div className="flex items-center p-2 w-full">
                  <img src={DEFAULT_AVATAR} className="rounded-full w-10" />
                  <span className="text-sm ml-3">김진배 선수</span>
                </div>
                <div className="flex items-center justify-end mr-5 text-sm"></div>
              </div>
              <div className="flex w-full items-center justify-start py-2">
                <div className="flex items-center bg-gray-200 h-10 w-full">
                  성별 :
                </div>
                <div className="flex items-center bg-gray-200 h-10 w-full">
                  키 :
                </div>
                <div className="flex items-center bg-gray-200 h-10 w-full">
                  몸무게 :
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupJoin;
