import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import React from "react";
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

const CupJoin = () => {
  const params = useParams();
  const { pInfo } = useContext(PlayerEditContext);
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
    pName: pInfo.pName || "",
    pBirth: pInfo.pBirth || "",
    pGender: pInfo.pGender || "",
    pHeight: pInfo.pHeight || "",
    pWeight: pInfo.pWeight || "",
    pEmail: pInfo.pEmail || "",
    pTel: pInfo.pTel || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chkValue, setChkValue] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");

  const [playerJoinGames, setPlayerJoinGames] = useState([]);
  const navigate = useNavigate();

  const initCheckBox = (datas) => {
    let initValue = "";
    let initClass = [];
    let dummy = [];
    //console.log(datas);

    datas.length > 0 &&
      datas.map((item, idx) => {
        item.class.map((classes) => {
          //console.log(classes.title);
          const classValue = { title: classes.title, chk: false };
          initClass.push({ ...classValue });
          //console.log(initClass);
        });
        initValue = { title: item.title, class: initClass };
        dummy.push(initValue);
        initClass = [];
      });

    setChkValue((prev) => (prev = dummy));
    //console.log(dummy);
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

    console.log(dayjs(birthDate).year());
    console.log(dayjs(cupDate).year());
    let age = dayjs(cupDate).year() - dayjs(birthDate).year();
    const month = dayjs(cupDate).month() - dayjs(birthDate).month();

    if (
      month < 0 ||
      (month === 0 && dayjs(cupDate).day() < dayjs(birthDate).day())
    ) {
      age--;
    }
    console.log(age);
    age && setPlayerAge((prev) => (prev = age));
    return age;
  };

  const handlePlayerProfile = (e) => {
    e.preventDefault();
    const playerUpdate = { ...playerProfile, [e.target.name]: e.target.value };
    setPlayerProfile((prev) => (prev = playerUpdate));
    console.log(playerUpdate);
  };

  const refreshCheck = () => {
    setChkValue(false);
    setPlayerJoinGames([]);
  };

  const handlePlayerJoinGames = (e) => {
    // e.preventDefault();
    setChkValue(undefined);
    const chkValue = e.target.value.split("_");

    const newGame = { gameName: chkValue[0], gameClass: chkValue[1] };
    let dummy = [...playerJoinGames];
    const dummyIndex = dummy.findIndex((game) => game.gameName === chkValue[0]);

    dummyIndex === -1
      ? dummy.push(newGame)
      : dummy.splice(dummyIndex, 1, newGame);
    console.log("dummy", dummy);
    setPlayerJoinGames((prev) => (prev = dummy));
  };

  const handleEnd = () => {
    // const cupDatas = JSON.parse(localStorage.getItem("newCup"));
    // cupDatas !== undefined && setCupData((prev) => (prev = cupDatas));
    //addCupData(cupDatas);
  };

  const saveJoinCup = async (datas) => {
    await addDoc(collection(db, "cupsjoin"), { ...datas }).then((addDoc) =>
      console.log(addDoc.id)
    );
  };

  const handleOpenModal = ({ component }) => {
    setModal(() => true);
    setModalComponent((prev) => (prev = component));
  };

  const handleCloseModal = () => {
    setModal(() => false);
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
  useMemo(() => getCup(), []);
  //useMemo(() => , [cupData.cupInfo.cupPoster]);
  useMemo(() => {
    console.log(playerJoinGames);
  }, [playerJoinGames]);
  useMemo(() => {
    console.log(chkValue);
  }, [chkValue]);
  useMemo(
    () =>
      console.log(
        cupData.gamesCategory.filter(
          (filter) =>
            filter.launched === true &&
            (filter.gender === playerProfile.pGender || filter.gender === "all")
        )
      ),
    [playerProfile]
  );

  useMemo(
    () => handleAge(playerProfile.pBirth, cupData.cupInfo.cupDate.startDate),
    [playerProfile.pBirth, cupData.cupInfo.cupDate.startDate]
  );

  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
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

            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm">
              <div className="flex w-full items-start justify-center p-4 flex-col">
                <span>참가종목</span>
                <span className="text-sm font-light">
                  대회당일 계측을 통해 상향지원 가능하지만
                </span>
                <span className="text-sm font-light">
                  하향지원은 불가능합니다.
                </span>
                <span className="text-sm font-light">
                  신중한 선택 부탁드립니다.
                </span>
                <button
                  className="text-sm font-light"
                  onClick={() => refreshCheck()}
                >
                  선택초기화
                </button>
              </div>
              <div className="flex w-full items-start justify-center p-4 flex-col gap-y-2">
                {cupData.gamesCategory.length > 0 &&
                  cupData.gamesCategory
                    .filter(
                      (filter) =>
                        filter.launched === true &&
                        (filter.gender === playerProfile.pGender ||
                          filter.gender === "all")
                    )
                    .map((game, idx) => {
                      return (
                        <div className="flex flex-col w-full">
                          <div className="flex w-full">
                            <span className="text-sm">{game.title}</span>
                          </div>
                          <div className="flex w-full mt-1 flex-wrap">
                            {game.class.length > 0 &&
                              game.class.map((item, iIdx) => {
                                let chk;
                                playerJoinGames.length === 0 && (chk = false);
                                return game.title !== "학생부" ? (
                                  game.title !== "장년부" ? (
                                    game.title !== "마스터즈" ? (
                                      <div className="flex mr-4">
                                        <input
                                          type="radio"
                                          name={game.title + "_"}
                                          checked={chk}
                                          value={game.title + "_" + item.title}
                                          id={game.title + "_" + item.title}
                                          onChange={(e) => {
                                            handlePlayerJoinGames(e);
                                          }}
                                        />
                                        <label
                                          htmlFor={
                                            game.title + "_" + item.title
                                          }
                                          className="text-sm ml-1"
                                        >
                                          {item.title}
                                        </label>
                                      </div>
                                    ) : (
                                      <div className="flex mr-4">연령제한</div>
                                    )
                                  ) : playerAge >= 40 && playerAge < 49 ? (
                                    <div className="flex mr-4">
                                      <input
                                        type="radio"
                                        name={game.title + "_"}
                                        checked={chk}
                                        value={game.title + "_" + item.title}
                                        id={game.title + "_" + item.title}
                                        onChange={(e) => {
                                          handlePlayerJoinGames(e);
                                        }}
                                      />
                                      <label
                                        htmlFor={game.title + "_" + item.title}
                                        className="text-sm ml-1"
                                      >
                                        {item.title}
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="flex mr-4">연령제한</div>
                                  )
                                ) : playerAge > 0 && playerAge < 20 ? (
                                  <div className="flex mr-4">
                                    <input
                                      type="radio"
                                      name={game.title + "_"}
                                      checked={chk}
                                      value={game.title + "_" + item.title}
                                      id={game.title + "_" + item.title}
                                      onChange={(e) => {
                                        handlePlayerJoinGames(e);
                                      }}
                                    />
                                    <label
                                      htmlFor={game.title + "_" + item.title}
                                      className="text-sm ml-1"
                                    >
                                      {item.title}
                                    </label>
                                  </div>
                                ) : (
                                  <div className="flex mr-4">연령제한</div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm p-4 gap-y-1">
              <span className="text-md">개인정보수집동의</span>
              <div className="flex w-full justify-between">
                <label className="flex justify-start items-center align-middle">
                  <input
                    type="checkbox"
                    name="m2Apply"
                    value="m2Apply"
                    className="mr-2"
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
            <div className="flex w-full h-full ">
              <div className="flex w-full justify-center items'">
                <button
                  className="flex w-3/4 bg-orange-500 h-14 rounded-lg shadow justify-center items-center"
                  onClick={() =>
                    handleOpenModal({
                      component: (
                        <JoinCupConfirm
                          cupData={cupData}
                          joinGames={playerJoinGames}
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
