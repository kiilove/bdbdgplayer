import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React, { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RxCopy } from "react-icons/rx";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { db } from "../firebase";
import { DEFAULT_AVATAR, DEFAULT_POSTER } from "../consts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "@mui/material";
import JoinCupConfirm from "../modals/JoinCupConfirm";
import dayjs from "dayjs";
import { useContext } from "react";
import { PlayerEditContext } from "../context/PlayerContext";
import { RiTimeLine, RiBankLine, RiCalendarLine } from "react-icons/ri";
import {
  MdOutlineLocationOn,
  MdCreditCard,
  MdOutlineAlternateEmail,
} from "react-icons/md";
import { GoDeviceMobile } from "react-icons/go";
import { RotatingLines } from "react-loader-spinner";
import { BsGenderAmbiguous } from "react-icons/bs";
import { AuthContext } from "../context/AuthContext";
import useFirestore from "../customHooks/useFirestore";

const CupJoin = () => {
  const params = useParams();
  const { pInfo } = useContext(PlayerEditContext);
  const { userInfo } = useContext(AuthContext);
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
  const [filterdGameCategory, setFilterdGameCategory] = useState([
    {
      title: "",
      index: 0,
      launched: false,
      gender: "none",
      class: [{ title: "", launched: "false" }],
    },
  ]);
  const [playerAge, setPlayerAge] = useState(0);
  const [playerBirth, setPlayerBirth] = useState("");
  const [playerProfile, setPlayerProfile] = useState({
    pId: userInfo.id || "",
    pUid: userInfo.pUid || "",
    pName: pInfo.pName || "",
    pBirth: pInfo.pBirth || "",
    pGender: pInfo.pGender || "",
    pHeight: pInfo.pHeight || "",
    pWeight: pInfo.pWeight || "",
    pEmail: pInfo.pEmail || "",
    pTel: pInfo.pTel || "",
  });
  const [isApply, setIsApply] = useState({
    title: "m1",
    value: false,
    applyDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [chkValue, setChkValue] = useState("");
  const [chkAllItem, setChkAllItem] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");

  const [playerJoinGames, setPlayerJoinGames] = useState([]);
  const [joinGameInvoice, setJoinGameInvoice] = useState({});
  const navigate = useNavigate();
  const {
    loading,
    error,
    data,
    searchData,
    selectedDoc,
    addDocument,
    updateDocument,
    deleteDocument,
    searchDocuments,
    getDocument,
  } = useFirestore("cups");

  const handleOpenModal = ({ component }) => {
    setModal(() => true);
    setModalComponent((prev) => (prev = component));
  };

  const handleCloseModal = () => {
    setModal(() => false);
  };
  const initCheckBox = (datas) => {
    let initValue = "";
    let initClass = [];
    let dummy = [];

    datas.length > 0 &&
      datas.map((items, idx) => {
        items.class.map((item) => {
          const classValue = { title: item.title, chk: false };
          initClass.push({ ...classValue });
        });
        initValue = { title: items.title, class: initClass };
        dummy.push(initValue);
        initClass = [];
      });
  };

  const getCup = async () => {
    setIsLoading(true);
    await getDoc(doc(db, "cups", cupId))
      .then((data) => {
        return { id: data.id, ...data.data() };
      })
      .then((data) => {
        setCupData((prev) => (prev = { ...data }));
        console.log(data);
        return data;
      })
      .then((data) => {
        setFilterdGameCategory((prev) => (prev = [...data.gamesCategory]));
        return data;
      })
      .then((data) => initCheckBox(data.gamesCategory))
      .then(() => setIsLoading(false))
      .catch((error) => console.log(error));
  };

  const handleAge = (birth, cup) => {
    const birthDate = dayjs(birth).format("YYYY-MM-DD");
    const cupDate = dayjs(cup).format("YYYY-MM-DD");

    let age = dayjs(cupDate).year() - dayjs(birthDate).year();
    const month = dayjs(cupDate).month() - dayjs(birthDate).month();

    if (
      month < 0 ||
      (month === 0 && dayjs(cupDate).day() < dayjs(birthDate).day())
    ) {
      age--;
    }
    age && setPlayerAge((prev) => (prev = age));
    return age;
  };

  const handleApply = () => {
    const apply = {
      title: "m1",
      value: !isApply.value,
      date: dayjs().format("YYYY-MM-DD HH:MM:ss"),
    };

    console.log(apply);

    setIsApply((prev) => (prev = apply));
  };

  const refreshCheck = () => {
    setChkValue((prev) => (prev = "refresh"));
    setPlayerJoinGames([]);
  };

  const handlePlayerJoinGames = (e, gameTitle, gameId) => {
    // e.preventDefault();

    let dummy = [...playerJoinGames];
    const dummyIndex = dummy.findIndex((game) => game.gameTitle === gameTitle);

    dummyIndex === -1
      ? dummy.push({ id: gameId, gameTitle, gameClass: e.target.value })
      : dummy.splice(dummyIndex, 1, {
          id: gameId,
          gameTitle,
          gameClass: e.target.value,
        });
    console.log("dummy", dummy);
    setPlayerJoinGames((prev) => (prev = dummy));
  };

  const handlePosterTitle = () => {
    let dummy = [...cupData.cupInfo.cupPoster];
    let posterTitleLink = DEFAULT_POSTER;
    if (dummy.length > 0) {
      const title = dummy.filter((item) => item.title === true);
      if (title[0].link !== undefined) {
        posterTitleLink = title[0].link;
      }

      if (dummy.length === 1) {
        if (dummy[0].link !== undefined) {
          posterTitleLink = dummy[0].link;
        }
      }

      return posterTitleLink;
    }
  };

  const handleFilterdGamesCategory = (gender, games) => {
    let dummy = [...games];

    let filterdGamesCategory = [];

    !chkAllItem
      ? (filterdGamesCategory = dummy.filter(
          (filter) =>
            filter.launched === true &&
            (filter.gender === gender || filter.gender === "all")
        ))
      : (filterdGamesCategory = dummy.filter(
          (filter) => filter.launched === true
        ));

    return filterdGamesCategory;
  };

  const handleJoinGameInvoice = () => {
    const gameInvoice = {
      ...playerProfile,
      ...cupData,
      joinGames: [...playerJoinGames],
      apply: isApply,
    };
    console.log(gameInvoice);
    return gameInvoice;
  };

  useMemo(() => {
    setFilterdGameCategory(
      (prev) =>
        (prev = handleFilterdGamesCategory(
          playerProfile.pGender,
          cupData.gamesCategory
        ))
    );
  }, [chkAllItem, playerProfile, cupData.gamesCategory]);

  useMemo(() => {
    console.log(filterdGameCategory);
  }, [filterdGameCategory]);

  useMemo(
    () => handleAge(playerProfile.pBirth, cupData.cupInfo.cupDate.startDate),
    [playerProfile.pBirth, cupData.cupInfo.cupDate.startDate]
  );

  useMemo(
    () => setJoinGameInvoice((prev) => (prev = handleJoinGameInvoice())),
    [playerJoinGames, isApply]
  );
  useMemo(() => console.log(playerProfile), [playerProfile]);

  useEffect(() => {
    //getCup();

    const getCupDocument = async () => {
      await getDocument(cupId);
    };

    getCupDocument();

   
  }, []);

  useEffect(() => {
    if (selectedDoc !== null) {
      setCupData(selectedDoc);
      setIsLoading(loading);
    }
  }, [selectedDoc]);

  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-24"
        style={{ maxWidth: "420px" }}
      >
        <div
          className={`absolute top-0 left-1/2 w-full h-full border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
            !isLoading && "hidden"
          }`}
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
        <Header title="참가신청" />
        <Modal open={modal} onClose={handleCloseModal}>
          <div className="flex w-full">{modalComponent}</div>
        </Modal>

        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white">
          <div className="flex flex-col w-full mb-5">
            <div className="flex w-full h-44 flex-col bg-orange-300  p-4 gap-y-1">
              <div className="flex">
                <span className="text-lg font-medium z-10">
                  {cupData.cupInfo.cupOrg}-참가공고
                  <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                </span>
              </div>
              <span className="text-2xl font-normal font-san">
                {cupData.cupInfo.cupName}
              </span>
              <div className="flex w-full text-purple-700">
                <div className="flex w-1/4 justify-start">
                  <div className="flex justify-start items-center">
                    <RiTimeLine />
                  </div>
                  <div className="flex">
                    <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                      {dayjs(cupData.cupInfo.cupDate.startDate).format(
                        "YYYY-MM-DD"
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex w-3/4">
                  <div className="flex justify-start items-center ml-5">
                    <MdOutlineLocationOn />
                  </div>
                  <div className="flex">
                    <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                      {cupData.cupInfo.cupLocation}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex w-full text-gray-700">
                <div className="flex w-1/4">
                  <div className="flex justify-start items-center">
                    <MdCreditCard />
                  </div>
                  <div className="flex">
                    <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                      100,000원
                    </span>
                  </div>
                </div>
                <div className="flex w-3/4">
                  <div className="flex justify-start items-center ml-5">
                    <RiBankLine />
                  </div>
                  <div className="flex">
                    <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                      대한은행 : 000-0000-00000-0000
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full px-6 relative -top-5 z-10">
              <div className="flex w-full h-full">
                {cupData.cupInfo.cupPoster.length > 0 &&
                  cupData.cupInfo.cupPoster[0] !== (undefined || null) && (
                    <img
                      src={handlePosterTitle()}
                      className="flex w-full h-80 object-cover object-top"
                    />
                  )}
              </div>
            </div>
            <div className="flex  w-full h-44 flex-col bg-white px-2">
              <div className="flex flex-col w-full p-4 border">
                <div className="flex justify-between">
                  <span className="text-lg font-medium z-10">
                    프로필
                    <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                  </span>
                  <button
                    className="bg-orange-400 rounded-md px-2 py-1 flex justify-center items-center mt-2"
                    onClick={() => navigate("/myprofile")}
                  >
                    <span className="text-xs text-white">프로필설정</span>
                  </button>
                </div>
                <span className="text-xl font-normal font-san">
                  {playerProfile.pName || ""}
                </span>
                <div className="flex w-full text-purple-700">
                  <div className="flex w-1/4 justify-start">
                    <div className="flex justify-start items-center">
                      <BsGenderAmbiguous />
                    </div>
                    <div className="flex">
                      <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                        {playerProfile.pGender === "m" ? "남자" : "여자"}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-3/4">
                    <div className="flex justify-start items-center ml-5">
                      <RiCalendarLine />
                    </div>
                    <div className="flex">
                      <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                        {dayjs(playerProfile.pBirth).format("YYYY-MM-DD")} (만{" "}
                        {playerAge}세)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex w-full text-gray-700 flex-col">
                  <div className="flex w-full">
                    <div className="flex justify-start items-center">
                      <MdOutlineAlternateEmail />
                    </div>
                    <div className="flex">
                      <span className="ml-1 text-sm font-light justify-start items-center">
                        {playerProfile.pEmail}
                      </span>
                    </div>
                  </div>
                  <div className="flex w-full">
                    <div className="flex justify-start items-center">
                      <GoDeviceMobile />
                    </div>
                    <div className="flex">
                      <span className="ml-1 text-sm font-light justify-start items-center">
                        {playerProfile.pTel}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex  w-full flex-col bg-white px-2">
              <div className="flex flex-col w-full p-4 border">
                <div className="flex justify-between">
                  <span className="text-lg font-medium z-10">
                    종목참가
                    <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                  </span>
                </div>
                <span className="text-sm font-light">
                  상향지원 가능하지만 하향지원은 불가능합니다.
                </span>
                <span className="text-sm font-light">
                  신중한 선택 부탁드립니다.
                </span>
                <div className="flex w-full justify-around mt-2">
                  <button
                    className="bg-white border-orange-500 border rounded-md px-2 py-1 flex justify-center items-center mt-2  text-sm w-36 font-light"
                    onClick={() => setChkAllItem(!chkAllItem)}
                  >
                    {chkAllItem === true ? "최적종목표시" : "전체종목표시"}
                  </button>
                  <button
                    className="bg-white border-orange-500 border rounded-md px-2 py-1 flex justify-center items-center mt-2  text-sm w-36 font-light"
                    onClick={() => refreshCheck()}
                  >
                    선택초기화
                  </button>
                </div>
              </div>
              <div className="flex w-full items-start justify-between mt-4 flex-wrap gap-2">
                {filterdGameCategory.length > 0 &&
                  filterdGameCategory.map((game, idx) => {
                    let ageGrade = "";
                    if (playerAge < 20) {
                      ageGrade = "학생부";
                    }
                    if (playerAge > 40 && playerAge < 49) {
                      ageGrade = "장년부";
                    }

                    if (playerAge > 50) {
                      ageGrade = "마스터즈";
                    }

                    return (
                      <div
                        className={`flex w-28 h-20 border flex-col ${
                          chkAllItem === false &&
                          (game.title === "학생부" ||
                            game.title === "장년부" ||
                            game.title === "마스터즈")
                            ? game.title !== ageGrade
                              ? "hidden"
                              : ""
                            : ""
                        }`}
                      >
                        <div className="flex text-xs font-light w-full h-10 justify-center items-center">
                          {game.title}
                        </div>
                        <div className="flex text-xs font-light w-full h-10 justify-center items-center px-1">
                          <select
                            name={`${game.title}Item`}
                            id={`${game.title}Item`}
                            className="border-b focus:ring-0 outline-none bg-whitetext-gray-800 w-full"
                            onChange={(e) => {
                              handlePlayerJoinGames(e, game.title, game.id);
                            }}
                          >
                            <option
                              name="default"
                              id="default"
                              value="notSelected"
                              className="bg-gray-300"
                              selected={playerJoinGames.length === 0}
                            >
                              종목선택
                            </option>
                            {game.class.map((item, iIdx) => (
                              <option
                                name={`${game.title}_${item.title}`}
                                id={`${game.title}_${item.title}`}
                                value={item.title}
                              >
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="flex  w-full flex-col bg-white px-2 mt-4">
              <div className="flex flex-col w-full p-4 border">
                <span className="text-md">개인정보수집동의</span>
                <div className="flex w-full justify-between">
                  <label className="flex justify-start items-center align-middle">
                    <input
                      type="checkbox"
                      name="m2Apply"
                      value="m2Apply"
                      className="mr-2"
                      onChange={() => handleApply()}
                    />
                    <span className="text-gray-500 mr-1">[필수]</span>
                    개인정보 수집 및 이용 동의
                  </label>
                  <button>
                    <span className="font-bold">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex w-full h-full mt-4">
              <div className="flex w-full justify-center items px-2">
                <button
                  className="flex w-full bg-orange-500 h-14 rounded-lg shadow justify-center items-center"
                  onClick={() =>
                    handleOpenModal({
                      component: (
                        <JoinCupConfirm
                          joinGameInvoice={joinGameInvoice}
                          prevSetModal={setModal}
                        />
                      ),
                    })
                  }
                >
                  <span className="font-bold text-white text-lg">참가신청</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupJoin;
