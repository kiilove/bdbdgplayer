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

import { RotatingLines } from "react-loader-spinner";
import { saveAs } from "file-saver";
import { useParams } from "react-router-dom";
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import { useEffect } from "react";

import JoinCupEditConfirm from "../modals/JoinCupEditConfirm";

import { useRef } from "react";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { BsFillQuestionCircleFill } from "react-icons/bs";

const ContestJoinEdit = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [contests, setContests] = useState({});
  const [error, setError] = useState(false);
  const [playerAge, setPlayerAge] = useState();
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");
  const [chkAllItem, setChkAllItem] = useState(true);
  const [isValidate, setIsValidate] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [filteredCategorys, setFilteredCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
  const [playerValidate, setPlayerValidate] = useState({
    playerName: false,
    playerTel: false,
    playerBirth: false,
    playerGym: false,
    playerGender: false,
  });

  const [optionOpen, setOptionOpen] = useState(false);
  const [message, setMessage] = useState({});

  const getInvoice = useFirestoreGetDocument("invoices_pool");
  const getContests = useFirestoreGetDocument("contests");
  const getCategorys = useFirestoreGetDocument("contest_categorys_list");
  const getGrades = useFirestoreGetDocument("contest_grades_list");

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

  const fetchCategorysAndGrades = async (categoryListId, gradeListId) => {
    try {
      const categoryData = await getCategorys.getDocument(categoryListId);
      const gradeData = await getGrades.getDocument(gradeListId);

      if (categoryData.id && gradeData.id) {
        // 그랑프리가 아닌 카테고리들만 필터링
        const filteredCategories = categoryData.categorys.filter(
          (category) => category.contestCategorySection !== "그랑프리"
        );

        setCategorys([...filteredCategories]); // 필터링된 카테고리 할당
        setFilteredCategorys([...filteredCategories]); // 필요 시 또 다른 필터링된 배열 할당
        setGrades([...gradeData.grades]); // 그대로 할당
      } else {
        return;
      }
    } catch (error) {
      setError(true);
    }
  };

  const fetchInvoice = async () => {
    setIsLoading(true);
    try {
      const data = await getInvoice.getDocument(params.invoiceId);
      if (!data.id) {
        setError(true);
        setIsLoading(false);
        return;
      }

      setInvoiceInfo({ ...data });

      const contest = await getContests.getDocument(data.contestId);
      if (!contest.contestNoticeId) {
        return;
      } else {
        setContests({ ...contest });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  const handelOptionOpen = () => {
    setMessage({
      body: "무대사진5장: 5만원 / 개인포징영상: 8만원",
      body2: "문의:010-9465-5114",
      body3: "카카오 7979-78-29056(엄소연)",
      isButton: true,
      confirmButtonText: "확인",
    });
    setOptionOpen(true);
  };
  useEffect(() => {
    fetchInvoice();
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
    console.log(invoiceInfo);
  }, [invoiceInfo]);

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
      setInvoiceInfo({
        ...invoiceInfo,
        [name]: value,
      });
    } else {
      setInvoiceInfo({
        ...invoiceInfo,
        [name]: value.trim(),
      });
    }
    handlePlayerValidate();
  };

  const handlePlayerValidate = () => {
    const updatedPlayerValidate = {
      playerName:
        !invoiceInfo.playerName || invoiceInfo.playerName.trim() === "",
      playerTel: !validatePhoneNumber(invoiceInfo.playerTel),
      playerBirth: !validateDate(invoiceInfo.playerBirth),
      playerGender: !invoiceInfo.playerGender,
      playerGym: !invoiceInfo.playerGym || invoiceInfo.playerGym.trim() === "",
    };

    setPlayerValidate(updatedPlayerValidate);
    const validate = Object.values(updatedPlayerValidate).some(
      (u) => u === true
    );
    setIsValidate(!validate);
  };

  function validatePhoneNumber(phoneNumber) {
    return phoneNumber && /^\d{2,3}-\d{3,4}-\d{3,4}$/.test(phoneNumber);
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
            <Header title="참가신청변경" />
            <Modal open={modal} onClose={handleCloseModal}>
              <div className="flex w-full">{modalComponent}</div>
            </Modal>
            <ConfirmationModal
              isOpen={optionOpen}
              onConfirm={() => setOptionOpen(false)}
              onCancel={() => setOptionOpen(false)}
              message={message}
            />
            <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white">
              <div className="flex flex-col w-full mb-5">
                <div className="flex w-full h-auto flex-col bg-orange-300 p-4 gap-y-1">
                  <div className="flex">
                    <span className="font-medium z-10">
                      {invoiceInfo.contestPromoter}-참가공고
                      <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                    </span>
                  </div>
                  <span className="text-xl font-normal font-san">
                    {invoiceInfo.contestTitle}
                  </span>
                  <div className="flex w-full text-purple-700">
                    <div className="flex w-1/2 justify-start">
                      <div className="flex justify-start items-center">
                        <RiTimeLine />
                      </div>
                      <div className="flex">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {invoiceInfo.contestDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-1/2">
                      <div className="flex justify-start items-center ml-5">
                        <MdOutlineLocationOn />
                      </div>
                      <div className="flex">
                        <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                          {invoiceInfo.contestLocation}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full text-gray-700">
                    <div className="flex w-1/2">
                      <div className="flex justify-start items-center">
                        <MdCreditCard />
                      </div>
                      <div className="flex">
                        <span className="ml-1 text-base font-semi-bold justify-start items-center">
                          {invoiceInfo.contestPriceBasic?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex w-1/2 items-center">
                      <div className="flex justify-start items-center">
                        <RiCheckDoubleFill />
                      </div>
                      <div className="flex justify-start items-center">
                        <span className="ml-1 text-base font-semi-bold justify-start items-center">
                          {invoiceInfo.contestPriceExtra?.toLocaleString()}
                        </span>
                        <span className="text-xs ml-2">중복출전비용</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full text-gray-700 ">
                    <div className="flex w-3/4">
                      <div className="flex justify-start items-start mt-1">
                        <RiBankLine />
                      </div>
                      <div className="flex items-center">
                        <div className="flex flex-col">
                          <span className="ml-1 text-base font-semi-bold justify-start items-center">
                            {invoiceInfo?.contestBankName}{" "}
                          </span>
                          <span className="ml-1 text-base font-semi-bold justify-start items-center">
                            {invoiceInfo?.contestAccountNumber}{" "}
                          </span>
                          <span className="ml-1 text-base font-semi-bold justify-start items-center">
                            {invoiceInfo?.contestAccountOwner}
                          </span>
                        </div>

                        <button className="ml-1">
                          <RxCopy />
                        </button>
                      </div>
                    </div>
                    {/* <div className="flex w-1/2 justify-end items-center mr-2">
                      <button
                        className="text-sm text-orange-900 p-1 border border-orange-500 bg-orange-400 h-10"
                        onClick={() =>
                          fileSave(invoiceInfo.contestCollectionFileLink)
                        }
                      >
                        공고문내려받기
                      </button>
                    </div> */}
                  </div>
                </div>

                <div className="flex  w-full h-auto flex-col bg-white px-2 gap-y-2">
                  <div className="flex flex-col w-full p-4 border h-auto gap-y-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium z-10">
                        개인정보
                        <div className="flex bg-amber-500 h-3 relative -top-3 -z-10"></div>
                      </span>
                    </div>
                    <div className="flex flex-col w-full">
                      <div className="flex w-full flex-col sm:flex-row">
                        <div className="flex w-1/2 sm:w-1/5 items-center">
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
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
                        <span>성별 : </span>
                      </div>
                      <div className="flex w-auto px-2">
                        <select
                          name="playerGender"
                          ref={pGenderRef}
                          selected={
                            invoiceInfo.playerGender === "m" ? "남자" : "여자"
                          }
                          onChange={(e) => {
                            handleInputs(e);
                          }}
                          className=" bg-transparent border rounded-lg p-2"
                        >
                          <option
                            value="m"
                            selected={invoiceInfo.playerGender === "m"}
                          >
                            남자
                          </option>
                          <option
                            value="f"
                            selected={invoiceInfo.playerGender === "f"}
                          >
                            여자
                          </option>
                        </select>
                      </div>
                    </div>
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
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
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              playerBirth: formatDate(e.target.value),
                            }));
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
                    {pBirthRef.current?.value.length < 8 && (
                      <div className="flex">
                        <span className="text-xs ml-2 bg-yellow-200 p-2">
                          8자리 생년월일을 작성해주세요.(예:2000-01-01)
                        </span>
                      </div>
                    )}
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
                        <span>휴대전화 : </span>
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
                            setInvoiceInfo(() => ({
                              ...invoiceInfo,
                              playerTel: formatPhoneNumber(e.target.value),
                            }));
                          }}
                          className={`${
                            playerValidate.playerTel
                              ? "border-2 p-2 outline-none border-red-400 rounded-lg w-full"
                              : "border p-2 outline-none rounded-lg w-full"
                          }`}
                        />
                      </div>
                    </div>
                    {pTelRef.current?.value.replaceAll("-", "").length < 9 && (
                      <div className="flex">
                        <span className="text-xs ml-2 bg-yellow-200 p-2">
                          '010' 포함된 휴대폰번호를 입력해주세요
                        </span>
                      </div>
                    )}
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
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
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
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
                    {pGymRef.current?.value.length <= 0 && (
                      <div className="flex">
                        <span className="text-xs ml-2 bg-yellow-200 p-2">
                          소속이 없다면 무소속으로 작성해주세요.
                        </span>
                      </div>
                    )}
                    <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/5 items-center">
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
                          placeholder="사회자에게 전달되어 선수소개시 발표됩니다."
                          className="border p-2 outline-none rounded-lg w-full lg:w-60"
                        />
                      </div>
                    </div>
                    {/* <div className="flex w-full flex-col sm:flex-row">
                      <div className="flex w-1/2 sm:w-1/3 items-center">
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
                        <button
                          className="bg-blue-500 ml-2 text-white text-sm px-2 py-1 rounded-lg "
                          onClick={() => handelOptionOpen()}
                        >
                          자세한내용
                        </button>
                      </div>
                    </div> */}
                  </div>
                </div>
                {!isValidate ? (
                  <div className="flex  w-full flex-col bg-white px-2 mt-4 justify-center items-center">
                    <span className="text-sm text-orange-500 font-sans font-semibold">
                      필수 개인정보를 정확하게 입력하시면 종목선택화면이
                      표시됩니다.
                    </span>
                    <span className="text-sm text-gray-500 font-sans font-semibold">
                      필수항목 : 이름, 성별, 생년월일, 전화번호, 소속
                    </span>
                    <div className="flex mt-4 w-full h-auto px-2">
                      <button
                        className="bg-orange-400 text-white w-full h-10"
                        onClick={() => handlePlayerValidate()}
                      >
                        <span>종목표시</span>
                      </button>
                    </div>
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
                          {" "}
                          선택초기화
                        </button>
                      </div>
                    </div>
                    <div className="flex w-full items-start justify-between mt-4 mb-8 flex-wrap gap-2">
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
                                    {matchGrades
                                      .sort(
                                        (a, b) =>
                                          a.contestGradeIndex -
                                          b.contestGradeIndex
                                      )
                                      .map((grade, gIdx) => {
                                        const {
                                          contestGradeTitle: gTitle,
                                          contestGradeId: gId,
                                        } = grade;

                                        return (
                                          <option
                                            id={gId}
                                            value={
                                              gId + "," + gTitle + "," + cType
                                            }
                                            selected={invoiceInfo?.joins.some(
                                              (i) => i.contestGradeId === gId
                                            )}
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

                <div className="flex w-full h-full mt-4">
                  <div className="flex w-full justify-center items px-2">
                    {invoiceInfo.joins.length > 0 && isValidate && (
                      <button
                        className="flex w-full bg-orange-500 h-14 rounded-lg shadow justify-center items-center"
                        onClick={() =>
                          handleOpenModal({
                            component: (
                              <JoinCupEditConfirm
                                propInvoiceInfo={invoiceInfo}
                                prevSetModal={setModal}
                              />
                            ),
                          })
                        }
                      >
                        <span className="font-bold text-white text-lg">
                          변경신청
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

export default ContestJoinEdit;
