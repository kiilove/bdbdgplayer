import { addDoc, collection, doc, getDoc } from "firebase/firestore";
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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "@mui/material";
import JoinCupConfirm from "../modals/JoinCupConfirm";

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
    playerName: "",
    playerAge: 0,
    playerBirth: "",
    playerGender: "",
    playerHeight: 0.0,
    playerWeight: 0.0,
    playerEmail: "",
    playerTel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [chkValue, setChkValue] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");

  const [playerJoinGames, setPlayerJoinGames] = useState([]);

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
    const birthDate = moment(birth).format("YYYY-MM-DD");
    const cupDate = moment(cup).format("YYYY-MM-DD");

    console.log(moment(birthDate).year());
    console.log(moment(cupDate).year());
    let age = moment(cupDate).year() - moment(birthDate).year();
    const month = moment(cupDate).month() - moment(birthDate).month();

    if (
      month < 0 ||
      (month === 0 && moment(cupDate).day() < moment(birthDate).day())
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
  useMemo(() => getCup(), []);
  useMemo(() => console.log(cupData), [cupData]);
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
            (filter.gender === playerProfile.playerGender ||
              filter.gender === "all")
        )
      ),
    [playerProfile]
  );
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title="참가신청" />
        <Modal open={modal} onClose={handleCloseModal}>
          <div className="flex w-full">{modalComponent}</div>
        </Modal>

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
                {filterdGameCategory.length > 0
                  ? filterdGameCategory.filter(
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
            <div className="flex w-full h-full flex-col bg-white rounded-lg shadow-sm">
              <div className="flex w-full items-start justify-center p-4 flex-col">
                <span>프로필 확인</span>
                <span className="text-sm font-light">
                  프로필에 따라 참가 가능 종목을 필터링 해드립니다.
                </span>
              </div>
              <div className="flex w-full items-center justify-start py-2 box-border">
                <div className="flex items-center bg-gray-200 h-10 w-full px-2">
                  <div className="flex w-full">
                    <input
                      type="text"
                      name="playerName"
                      className="w-full text-sm p-1 mr-1"
                      placeholder="이름"
                      value={playerProfile.playerName}
                      onChange={(e) => handlePlayerProfile(e)}
                    />
                  </div>
                </div>
                <div className="flex items-center bg-gray-200 h-10 w-full px-2">
                  <div className="flex w-3/4">
                    <input
                      type="text"
                      name="playerBirth"
                      className="w-full text-sm p-1 mr-1"
                      placeholder="생년월일(8자리)"
                      value={playerProfile.playerBirth}
                      onChange={(e) => handlePlayerProfile(e)}
                      onBlur={(e) =>
                        handleAge(
                          e.target.value,
                          cupData.cupInfo.cupDate.startDate
                        )
                      }
                    />
                  </div>
                  <span className="flex text-sm w-1/4">만 {playerAge}세</span>
                </div>
              </div>
              <div className="flex w-full items-center justify-start">
                <div className="flex items-center bg-gray-200 h-10">
                  <div className="flex ">
                    <select
                      id="playerGender"
                      name="playerGender"
                      className="ml-2 text-sm p-1 mr-2"
                      selected={playerProfile.playerGender}
                      onChange={(e) => handlePlayerProfile(e)}
                    >
                      <option selected disabled>
                        성별
                      </option>
                      <option value="m">남자</option>
                      <option value="f">여자</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center bg-gray-200 h-10 w-full">
                  <div className="flex w-full mr-2">
                    <input
                      type="text"
                      name="playerHeight"
                      className="w-full text-sm p-1 mr-1 text-end"
                      placeholder="키"
                      value={playerProfile.playerHeight}
                      onChange={(e) => handlePlayerProfile(e)}
                    />
                    <span className="text-sm flex items-center">cm</span>
                  </div>
                </div>
                <div className="flex items-center bg-gray-200 h-10 w-full">
                  <div className="flex w-full">
                    <input
                      type="text"
                      name="playerWeight"
                      className="w-full text-sm p-1 mr-1 text-end"
                      placeholder="체중"
                      value={playerProfile.playerWeight}
                      onChange={(e) => handlePlayerProfile(e)}
                    />
                    <span className="text-sm flex items-center">kg</span>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-start py-2 box-border">
                <div className="flex items-center bg-gray-200 h-10 w-full px-2">
                  <div className="flex w-full">
                    <input
                      type="text"
                      name="playerEmail"
                      className="w-full text-sm p-1 mr-1"
                      placeholder="이메일"
                      value={playerProfile.playerEmail}
                      onChange={(e) => handlePlayerProfile(e)}
                    />
                  </div>
                </div>
                <div className="flex items-center bg-gray-200 h-10 w-full px-2">
                  <div className="flex w-full">
                    <input
                      type="text"
                      name="playerTel"
                      className="w-full text-sm p-1 mr-1"
                      placeholder="연락처"
                      value={playerProfile.playerTel}
                      onChange={(e) => handlePlayerProfile(e)}
                    />
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
                        (filter.gender === playerProfile.playerGender ||
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
                          jonGames={playerJoinGames}
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
