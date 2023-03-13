import React from "react";
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
import useFirestoreSearch from "../customHooks/useFirestoreSearch";

const CupList = () => {
  //const [cupsData, setCupsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefresh, setIsRefresh] = useState(false);
  const navigate = useNavigate();
  const conditions = [where("cupInfo.cupState", "==", "대회준비중")];
  const { data, loading, error } = useFirestoreSearch(
    "cups",
    conditions,
    "cupInfo.cupDate.startDate"
  );

  useMemo(() => {
    if (data.length) {
      setIsLoading(false);
    }
  }, [data]);

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
          <div
            className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
            style={{ maxWidth: "420px" }}
          >
            <Header title="대회 일정" />
            <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-slate-100 px-2">
              <div className="flex flex-col w-full gap-y-5 mt-5 mb-5">
                {data &&
                  data.map((item, idx) => {
                    let titleLink =
                      "https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fblank%2Fdefault_poster.jpg?alt=media&token=9501d1f2-3e92-45f3-9d54-8d8746ba288d";
                    const posterTitle = item.cupInfo.cupPoster.filter(
                      (poster) => poster.title === true
                    );
                    if (posterTitle.length > 0) {
                      titleLink = posterTitle[0].link;
                    }
                    return (
                      <div
                        className="flex w-full h-36 flex-col bg-white rounded-lg shadow-sm cursor-pointer"
                        onClick={() => navigate(`/cupjoin/${item.id}`)}
                      >
                        <div className="flex w-full h-20">
                          <img
                            src={titleLink}
                            alt=""
                            className="w-full h-20 object-cover object-center rounded-t-lg"
                          />
                        </div>
                        <div className="flex w-full justify-center items-center h-full">
                          <div className="flex w-3/4 flex-col">
                            <div className="flex w-full h-6 p-2">
                              <span className="text-sm">
                                {item.cupInfo.cupName}
                              </span>
                              <span className="text-sm ml-2">
                                {item.cupInfo.cupCount}회
                              </span>
                            </div>
                            <div className="flex w-full h-6 p-2">
                              <span className="text-sm">
                                {moment(item.cupInfo.cupDate.startDate).format(
                                  "YYYY-MM-DD"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-1/4">
                            <button
                              className="w-full flex justify-center items-center bg-orange-300 h-10 rounded-lg mr-2"
                              onClick={() => navigate(`/cupjoin/${item.id}`)}
                            >
                              참가신청
                            </button>
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
