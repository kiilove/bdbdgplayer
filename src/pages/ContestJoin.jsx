import React from "react";
import { useState } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { Modal } from "@mui/material";
import {
  MdCreditCard,
  MdOutlineAlternateEmail,
  MdOutlineLocationOn,
} from "react-icons/md";
import {
  RiBankLine,
  RiCalendarLine,
  RiCheckDoubleFill,
  RiTimeLine,
} from "react-icons/ri";
import { RxCopy } from "react-icons/rx";
import { BsGenderAmbiguous } from "react-icons/bs";
import { GoDeviceMobile } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { saveAs } from "file-saver";
import { useNavigate, useParams } from "react-router-dom";
import {
  useFirestoreGetDocument,
  useFirestoreQuery,
} from "../hooks/useFirestores";
import { useEffect } from "react";
import { PlayerEditContext } from "../context/PlayerContext";
import { useContext } from "react";
import JoinCupConfirm from "../modals/JoinCupConfirm";
import dayjs from "dayjs";
import { AuthContext } from "../context/AuthContext";
import { useRef } from "react";

const ContestJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [noticeInfo, setNoticeInfo] = useState({});
  const [contests, setContests] = useState({});
  const [error, setError] = useState(false);
  const [playerAge, setPlayerAge] = useState();
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");
  const [chkAllItem, setChkAllItem] = useState(false);
  const [isValidate, setIsValidate] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [filteredCategorys, setFilteredCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
  const [playerInfo, setPlayerInfo] = useState({});
  const [playerValidate, setPlayerValidate] = useState({
    playerName: false,
    playerTel: false,
    playerBirth: false,
    playerGym: false,
    playerGender: false,
  });
  const [joinCategorys, setJoinCategorys] = useState([]);
  const [isApply, setIsApply] = useState({
    title: "m1",
    value: false,
    applyDate: "",
  });
  const getNotice = useFirestoreGetDocument("contest_notice");
  const getContests = useFirestoreGetDocument("contests");
  const getCategorys = useFirestoreGetDocument("contest_categorys_list");
  const getGrades = useFirestoreGetDocument("contest_grades_list");
  const { pInfo } = useContext(PlayerEditContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const pNameRef = useRef();
  const pTelRef = useRef();
  const pGenderRef = useRef();
  const pEmailRef = useRef();
  const pBirthRef = useRef();
  const pGymRef = useRef();
  const pTextRef = useRef();

  const params = useParams();
  const handleOpenModal = ({ component }) => {
    setModal(() => true);
    setModalComponent((prev) => (prev = component));
  };

  const handleCloseModal = () => {
    setModal(() => false);
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

  const handleInvoiceInfo = (e) => {
    const { name, id, value } = e.target;
    const splitValue = value.split(",");
    const gradeId = splitValue[0];
    const gradeTitle = splitValue[1];
    const categoryPriceType = splitValue[2];
    let dummy = [...invoiceInfo.joins];
    let newInvoiceInfo = { ...invoiceInfo };
    const findCategory = dummy.some(
      (category) => category.contestCategoryId === id
    );
    const findIndex = dummy.findIndex(
      (category) => category.contestCategoryId === id
    );

    const newValue = {
      contestCategoryId: id,
      contestCategoryTitle: name,
      contestCategoryPriceType: categoryPriceType,
      contestGradeId: gradeId,
      contestGradeTitle: gradeTitle,
    };

    if (gradeId === "체급선택") {
      dummy.splice(findIndex, 1);
    } else if (!findCategory) {
      dummy.push({ ...newValue });
    } else {
      dummy.splice(findIndex, 1, { ...newValue });
    }

    setInvoiceInfo({ ...newInvoiceInfo, joins: [...dummy] });
  };

  const fetchNotice = async () => {
    setIsLoading(true);
    try {
      const data = await getNotice.getDocument(params.contestId);
      if (!data.refContestId) {
        setError(true);
        setIsLoading(false);
        return;
      } else {
        setNoticeInfo({ ...data });
        const contest = await getContests.getDocument(data.refContestId);
        if (!contest.contestNoticeId) {
          return;
        } else {
          setContests({ ...contest });
        }
      }
    } catch (error) {
      setError(true);
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategorysAndGrades = async (categoryListId, gradeListId) => {
    try {
      const categoryData = await getCategorys.getDocument(categoryListId);
      console.log(categoryData);
      const gradeData = await getGrades.getDocument(gradeListId);
      if (categoryData.id && gradeData.id) {
        setCategorys([...categoryData.categorys]);
        setFilteredCategorys([...categoryData.categorys]);
        setGrades([...gradeData.grades]);
      } else {
        return;
      }
    } catch (error) {
      setError(true);
    }
  };
  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  }
  useEffect(() => {
    fetchNotice();
  }, []);

  useEffect(() => {
    fetchCategorysAndGrades(
      contests.contestCategorysListId,
      contests.contestGradesListId
    );
  }, [contests]);

  useEffect(() => {
    let age;
    const gender = invoiceInfo.playerGender === "m" ? "남" : "여";
    if (invoiceInfo.playerBirth) {
      age = calculateAge(invoiceInfo.playerBirth);
    }
    setPlayerAge(age);

    if (chkAllItem) {
      setFilteredCategorys([...categorys]);
    } else {
      const dummy = categorys.filter(
        (category) =>
          category.contestCategoryGender === gender ||
          category.contestCategoryGender === "무관"
      );
      setFilteredCategorys([...dummy]);
    }
  }, [chkAllItem, invoiceInfo.playerGender, invoiceInfo.playerBirth]);

  useEffect(() => {
    if (
      !noticeInfo.contestTitle ||
      !contests.contestNoticeId ||
      !pInfo.pName ||
      !userInfo.pUid
    ) {
      return;
    }
    const initInvocieInfo = {
      invoicePoolId: contests.invoicesPoolId,
      contestId: contests.id,
      contestTitle: noticeInfo.contestTitle,
      contestDate: noticeInfo.contestDate,
      contestLocation: noticeInfo.contestLocation,
      contestCollectionFileLink: noticeInfo.contestCollectionFileLink,
      contestPriceBasic: noticeInfo.contestPriceBasic,
      contestPriceExtra: noticeInfo.contestPriceExtra,
      contestPriceExtraType: noticeInfo.contestPriceExtraType,
      contestPriceType1: noticeInfo.contestPriceType1,
      contestPriceType2: noticeInfo.contestPriceType2,
      contestBankName: noticeInfo.contestBankName,
      contestAccountNumber: noticeInfo.contestAccountNumber,
      contestAccountOwner: noticeInfo.contestAccountOwner,
      playerUid: userInfo.pUid,
      playerName: pInfo.pName,
      playerTel: pInfo.pTel,
      playerEmail: pInfo.pEmail,
      playerBirth: pInfo.pBirth,
      playerGym: pInfo.pGym,
      playerGender: pInfo.pGender,
      playerText: "",
      isPriceCheck: false,
      joins: [],
    };
    setInvoiceInfo({ ...initInvocieInfo });
  }, [noticeInfo, contests, pInfo, userInfo]);

  const fileSave = (fileUrl) => {
    const fileURL = fileUrl;

    saveAs(fileURL, "filename.hwp");
  };

  useEffect(() => {
    handlePlayerValidate();
  }, [invoiceInfo]);

  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "playerText") {
      e.preventDefault();
      setInvoiceInfo({ ...invoiceInfo, [name]: value });
    } else {
      setInvoiceInfo({ ...invoiceInfo, [name]: value.trim() });
    }

    handlePlayerValidate();
  };

  const handlePlayerValidate = () => {
    const updatedPlayerValidate = {
      playerName:
        !invoiceInfo.playerName || invoiceInfo.playerName.trim() === "",
      playerTel:
        !invoiceInfo.playerTel || !validatePhoneNumber(invoiceInfo.playerTel),
      playerBirth:
        !invoiceInfo.playerBirth || !validateDate(invoiceInfo.playerBirth),
      playerGender: !invoiceInfo.playerGender,
      playerGym: !invoiceInfo.playerGym || invoiceInfo.playerGym.trim() === "",
    };

    setPlayerValidate(updatedPlayerValidate);
    const validate = Object.values(updatedPlayerValidate).some(
      (u) => u === true
    );
    setIsValidate(!validate);
  };

  function validateEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhoneNumber(phoneNumber) {
    return phoneNumber && /^\d{3}-\d{3,4}-\d{4}$/.test(phoneNumber);
  }

  function validateDate(date) {
    return date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) {
      return;
    }
    const trimmedNumber = phoneNumber.replace(/-/g, ""); // 기존의 '-' 제거
    const match = trimmedNumber.match(/^(\d{2,3})(\d{0,4})(\d{0,4})$/); // 숫자 그룹으로 분리

    if (!match) {
      return phoneNumber; // 형식에 맞지 않는 경우 그대로 반환
    }

    const formattedNumber = match.slice(1).filter(Boolean).join("-"); // '-' 추가하여 조합

    return formattedNumber;
  }

  function formatDate(date) {
    if (!date) {
      return;
    }
    const sanitizedDate = date.replace(/[^\d.-]/g, ""); // `.`과 `,`을 제외한 다른 문자 제거

    const match = sanitizedDate.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/); // 숫자 그룹으로 분리

    if (!match) return date; // 형식에 맞지 않는 경우 그대로 반환

    const formattedDate = match.slice(1).filter(Boolean).join("-"); // '-' 추가하여 조합
    return formattedDate;
  }

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

      {!isLoading && (
        <>
          <BottomMenu />
          <div
            className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-24"
            style={{ maxWidth: "420px" }}
          >
            <Header title="참가신청" />
            <Modal open={modal} onClose={handleCloseModal}>
              <div className="flex w-full">{modalComponent}</div>
            </Modal>
            <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white">
              <div className="flex flex-col w-full mb-5">
                <div className="flex w-full h-60 flex-col bg-orange-300 p-4 gap-y-1">
                  <div className="flex">
                    <span className="text-lg font-medium z-10">
                      {noticeInfo.contestPromoter}-참가공고
                      <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                    </span>
                  </div>
                  <span className="text-2xl font-normal font-san">
                    {noticeInfo.contestTitle}
                  </span>
                  <div className="flex w-full text-purple-700">
                    <div className="flex w-1/4 justify-start">
                      <div className="flex justify-start items-center">
                        <RiTimeLine />
                      </div>
                      <div className="flex">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {noticeInfo.contestDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-3/4">
                      <div className="flex justify-start items-center ml-5">
                        <MdOutlineLocationOn />
                      </div>
                      <div className="flex">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {noticeInfo.contestLocation}
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
                          {noticeInfo.contestPriceBasic?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-3/4 items-center">
                      <div className="flex justify-start items-center">
                        <RiCheckDoubleFill />
                      </div>
                      <div className="flex justify-start items-center">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {noticeInfo.contestPriceExtra?.toLocaleString()}
                        </span>
                        <span className="text-xs ml-2">중복출전비용</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full text-gray-700 ">
                    <div className="flex w-3/4">
                      <div className="flex justify-start items-center">
                        <RiBankLine />
                      </div>
                      <div className="flex items-center">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {noticeInfo?.contestBankName}{" "}
                          {noticeInfo?.contestAccountNumber}{" "}
                          {noticeInfo?.contestAccountOwner}
                        </span>
                        <button className="ml-1">
                          <RxCopy />
                        </button>
                      </div>
                    </div>
                    <div className="flex w-1/4 justify-end mr-2">
                      <button
                        className="text-xs text-orange-800 p-1 border border-orange-500 bg-orange-400"
                        onClick={() =>
                          fileSave(noticeInfo.contestCollectionFileLink)
                        }
                      >
                        공고문내려받기
                      </button>
                    </div>
                  </div>
                </div>
                {/* <div className="flex w-full px-2 relative -top-4 z-10">
                  <div className="flex w-full h-full">
                    <img
                      src={noticeInfo?.contestPoster}
                      className="flex w-full h-full object-cover object-top"
                    />
                  </div>
                </div> */}
                <div className="flex  w-full h-auto flex-col bg-white px-2 gap-y-2">
                  <div className="flex flex-col w-full p-4 border h-auto gap-y-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium z-10">
                        개인정보
                        <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex w-full">
                        <div className="flex w-1/5 items-center">
                          <span>이름 : </span>
                        </div>
                        <div className="flex w-auto px-2">
                          <input
                            type="text"
                            value={invoiceInfo.playerName}
                            name="playerName"
                            ref={pNameRef}
                            onChange={(e) => {
                              handleInputs(e);
                            }}
                            className={`${
                              playerValidate.playerName
                                ? "border-2 p-2 outline-none border-red-400 rounded-lg w-full"
                                : "border p-2 outline-none rounded-lg w-full"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <span></span>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-center">
                        <span>성별 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <select
                          name="playerGender"
                          ref={pGenderRef}
                          value={
                            invoiceInfo.playerGender === "m" ? "남자" : "여자"
                          }
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className=" bg-transparent border rounded-lg p-2"
                        >
                          <option>남자</option>
                          <option>여자</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-center">
                        <span>생년월일 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <input
                          type="text"
                          value={invoiceInfo.playerBirth}
                          name="playerBirth"
                          ref={pBirthRef}
                          onBlur={(e) =>
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              playerBirth: formatDate(e.target.value),
                            }))
                          }
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className={`${
                            playerValidate.playerBirth
                              ? "border-2 p-2 outline-none border-red-400 rounded-lg w-40"
                              : "border p-2 outline-none rounded-lg w-40"
                          }`}
                        />
                        <span className="flex justify-start items-center ml-2 text-sm">
                          {Number.isInteger(playerAge) &&
                            "만 " + playerAge + "세"}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-center">
                        <span>전화번호 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <input
                          type="text"
                          value={invoiceInfo.playerTel}
                          name="playerTel"
                          ref={pTelRef}
                          onBlur={(e) =>
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              playerTel: formatPhoneNumber(e.target.value),
                            }))
                          }
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className={`${
                            playerValidate.playerTel
                              ? "border-2 p-2 outline-none border-red-400 rounded-lg w-full"
                              : "border p-2 outline-none rounded-lg w-full"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-center">
                        <span>이메일 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <input
                          type="text"
                          value={invoiceInfo.playerEmail}
                          name="playerEmail"
                          ref={pEmailRef}
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className="border p-2 outline-none rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-center">
                        <span>소속 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <input
                          type="text"
                          value={invoiceInfo.playerGym}
                          name="playerGym"
                          ref={pGymRef}
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className={`${
                            playerValidate.playerGym
                              ? "border-2 p-2 outline-none border-red-400 rounded-lg w-full"
                              : "border p-2 outline-none rounded-lg w-full"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/5 items-start">
                        <span>참여동기 : </span>
                      </div>
                      <div className="flex w-auto pl-2 ">
                        <textarea
                          value={invoiceInfo.playerText}
                          name="playerText"
                          ref={pTextRef}
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className="border p-2 outline-none rounded-lg w-60"
                        />
                      </div>
                    </div>
                    <div className="flex w-full">
                      <div className="flex w-1/3 items-center">
                        <span>무대사진신청 : </span>
                      </div>
                      <div className="flex w-2/3 px-2 justify-start items-center">
                        <input
                          type="checkbox"
                          checked={invoiceInfo.playerService}
                          name="playerService"
                          onChange={(e) => {
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              playerService: e.target.checked,
                            }));
                          }}
                        />
                        <span className="ml-2">유료서비스</span>
                      </div>
                    </div>
                  </div>
                </div>
                {!isValidate ? (
                  <div className="flex  w-full flex-col bg-white px-2 mt-4 justify-center items-center">
                    <span className="text-sm text-orange-500">
                      필수 개인정보를 정확하게 입력하시면 종목선택화면이
                      표시됩니다.
                    </span>
                  </div>
                ) : (
                  <div className="flex  w-full flex-col bg-white px-2 mt-4">
                    <div className="flex flex-col w-full p-4 border">
                      <div className="flex justify-between">
                        <span className="text-lg font-medium z-10">
                          참가종목선택
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
                          {chkAllItem === true
                            ? "최적종목표시"
                            : "전체종목표시"}
                        </button>
                        <button
                          className="bg-white border-orange-500 border rounded-md px-2 py-1 flex justify-center items-center mt-2  text-sm w-36 font-light"
                          onClick={() =>
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              joins: [],
                            }))
                          }
                        >
                          선택초기화
                        </button>
                      </div>
                    </div>
                    <div className="flex w-full items-start justify-between mt-4 flex-wrap gap-2">
                      {filteredCategorys?.length > 0 &&
                        filteredCategorys.map((category, cIdex) => {
                          const {
                            contestCategoryTitle: cTitle,
                            contestCategoryId: cId,
                            contestCategoryPriceType: cType,
                          } = category;
                          const matchGrades = grades.filter(
                            (grade) => grade.refCategoryId === cId
                          );
                          //console.log(matchGrades);

                          return (
                            <div
                              className={`${
                                invoiceInfo?.joins.some(
                                  (join) => join.contestCategoryId === cId
                                )
                                  ? "flex w-full h-14 border px-2 items-center justify-center bg-orange-300"
                                  : "flex w-full h-14 border px-2 items-center justify-center"
                              }`}
                            >
                              <div className="flex h-10 justify-start items-center w-2/3">
                                <span className="text-sm">{cTitle}</span>
                              </div>
                              <div className="flex h-10 justify-start items-center w-1/3">
                                {matchGrades?.length > 0 && (
                                  <select
                                    id={cId}
                                    name={cTitle}
                                    className="text-sm bg-transparent outline-none"
                                    onChange={(e) => handleInvoiceInfo(e)}
                                  >
                                    <option>체급선택</option>
                                    {matchGrades.map((grade, gIdx) => {
                                      const {
                                        contestGradeTitle: gTitle,
                                        contestGradeId: gId,
                                      } = grade;

                                      return (
                                        <option
                                          id={gId}
                                          selected={invoiceInfo?.joins.some(
                                            (i) => i.contestGradeId === gId
                                          )}
                                          value={
                                            gId + "," + gTitle + "," + cType
                                          }
                                        >
                                          {gTitle}
                                        </option>
                                      );
                                    })}
                                  </select>
                                )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <div className="flex  w-full flex-col bg-white px-2 mt-4">
                  <div className="flex flex-col w-full p-4 border">
                    <span className="text-sm">개인정보수집동의</span>
                    <div className="flex w-full justify-between">
                      <label className="flex justify-start items-center align-middle">
                        <input
                          type="checkbox"
                          name="m2Apply"
                          value="m2Apply"
                          className="mr-2"
                          onChange={() => handleApply()}
                        />
                        <span className="text-gray-500 mr-1 text-xs">
                          [필수]
                        </span>
                        <span className="text-xs">
                          개인정보 수집 이용 동의 및 초상권 사용동의서
                        </span>
                      </label>
                      <button onClick={() => navigate("/policy3")}>
                        <span className="font-bold">
                          <FontAwesomeIcon icon={faArrowRight} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex w-full h-full mt-4">
                  <div className="flex w-full justify-center items px-2">
                    {invoiceInfo.joins.length > 0 &&
                    isApply.value &&
                    isValidate ? (
                      <button
                        className="flex w-full bg-orange-500 h-14 rounded-lg shadow justify-center items-center"
                        onClick={() =>
                          handleOpenModal({
                            component: (
                              <JoinCupConfirm
                                propInvoiceInfo={invoiceInfo}
                                prevSetModal={setModal}
                              />
                            ),
                          })
                        }
                      >
                        <span className="font-bold text-white text-lg">
                          참가신청
                        </span>
                      </button>
                    ) : (
                      <button
                        className="flex w-full bg-gray-500 h-14 rounded-lg shadow justify-center items-center"
                        disabled
                      >
                        <span className="font-bold text-white">
                          개인정보/종목선택과 개인정보 수집동의가 필요합니다.
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContestJoin;
