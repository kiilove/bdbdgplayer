import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { Modal } from "@mui/material";
import { MdCreditCard, MdOutlineLocationOn } from "react-icons/md";
import { RiBankLine, RiCheckDoubleFill, RiTimeLine, RiErrorWarningLine } from "react-icons/ri";
import { RxCopy } from "react-icons/rx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { RotatingLines } from "react-loader-spinner";
import { saveAs } from "file-saver";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useFirestoreGetDocument } from "../hooks/useFirestores";
import JoinCupConfirm from "../modals/JoinCupConfirm";
import dayjs from "dayjs";
import { UserContext } from "../context/UserContext";
import Policy3 from "../components/Policy3";
import { replace } from "formik";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import ConfirmationModal from "../messageBox/ConfirmationModal";
import { formatBirthDate, formatPhoneNumber, calculateAge } from "../utils/formatUtils";

const ContestJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [noticeInfo, setNoticeInfo] = useState({});
  const [contests, setContests] = useState({});
  const [error, setError] = useState(false);
  const [playerAge, setPlayerAge] = useState();
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");
  const [chkAllItem, setChkAllItem] = useState(true);
  const [isValidate, setIsValidate] = useState(false);
  const [isConfirmedInfo, setIsConfirmedInfo] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [filteredCategorys, setFilteredCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
  const [modalOpen, setModalOpen] = useState(false);
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
  const [optionOpen, setOptionOpen] = useState(false);
  const [message, setMessage] = useState({});
  const getNotice = useFirestoreGetDocument("contest_notice");
  const getContests = useFirestoreGetDocument("contests");
  const getCategorys = useFirestoreGetDocument("contest_categorys_list");
  const getGrades = useFirestoreGetDocument("contest_grades_list");
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
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
  const handleApply = (e) => {
    const apply = {
      title: "m1",
      value: e.target.checked,
      date: dayjs(new Date()).format("YYYY-MM-DD HH:MM:ss"),
    };

    setIsApply((prev) => (prev = apply));
  };

  const handleInvoiceInfo = (e) => {
    const { name, id, value } = e.target;
    if (!value || value === "체급선택") {
      const dummy = (invoiceInfo.joins || []).filter(
        (category) => category.contestCategoryId !== id
      );
      setInvoiceInfo((prev) => ({ ...prev, joins: dummy }));
      return;
    }

    const splitValue = value.split(",");
    const gradeId = splitValue[0];
    const gradeTitle = splitValue[1];
    const categoryPriceType = splitValue[2] || "";
    let dummy = [...(invoiceInfo.joins || [])];
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

    if (findIndex === -1) {
      dummy.push({ ...newValue });
    } else {
      dummy.splice(findIndex, 1, { ...newValue });
    }

    setInvoiceInfo((prev) => ({ ...prev, joins: dummy }));
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

  const handelOptionOpen = () => {
    setMessage({
      body: "무대사진5컷(종목무관): 6만원",
      body2: "문의:정태천 대표(010-4886-0047)",
      body3: "우리은행 1002-250-33892 정태천",
      isButton: true,
      confirmButtonText: "확인",
    });
    setOptionOpen(true);
  };
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
      !pInfo.playerUid
    ) {
      return;
    }
    const initInvocieInfo = {
      invoicePoolId: contests.invoicesPoolId || "",
      contestId: contests.id || params.contestId || "",
      contestTitle: noticeInfo.contestTitle || "",
      contestDate: noticeInfo.contestDate || "",
      contestLocation: noticeInfo.contestLocation || "",
      conntestPromoter: noticeInfo.contestPromoter || "",
      contestCollectionFileLink: noticeInfo.contestCollectionFileLink || "",
      contestPriceBasic: noticeInfo.contestPriceBasic || 0,
      contestPriceExtra: noticeInfo.contestPriceExtra || 0,
      contestPriceExtraType: noticeInfo.contestPriceExtraType || "",
      contestPriceType1: noticeInfo.contestPriceType1 || 0,
      contestPriceType2: noticeInfo.contestPriceType2 || 0,
      contestBankName: noticeInfo.contestBankName || "",
      contestAccountNumber: noticeInfo.contestAccountNumber || "",
      contestAccountOwner: noticeInfo.contestAccountOwner || "",
      playerUid: pInfo.playerUid || "",
      playerName: pInfo.pName || "",
      playerTel: formatPhoneNumber(pInfo.pTel || ""),
      playerEmail: pInfo.pEmail || "",
      playerBirth: formatBirthDate(pInfo.pBirth || ""),
      playerGym: pInfo.pGym || "",
      playerGender: pInfo.pGender || "",
      playerText: "",
      isPriceCheck: false,
      joins: [],
    };
    setInvoiceInfo({ ...initInvocieInfo });
  }, [noticeInfo, contests, pInfo]);

  const fileSave = (fileUrl) => {
    const fileURL = fileUrl;

    saveAs(fileURL, "filename.hwp");
  };

  useEffect(() => {
    handlePlayerValidate();
  }, [invoiceInfo]);

  useEffect(() => {
    if (pGenderRef?.current?.value !== undefined) {
      setInvoiceInfo({
        ...invoiceInfo,
        playerGender: pGenderRef.current.value,
      });
    }
  }, [pGenderRef?.current]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "playerBirth") {
      formattedValue = formatBirthDate(value);
    } else if (name === "playerTel") {
      formattedValue = formatPhoneNumber(value);
    } else if (name !== "playerText") {
      formattedValue = value;
    }

    setInvoiceInfo((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

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
    return !validate;
  };

  const handlePlayerValidateButtonClick = () => {
    if (!invoiceInfo.playerName || invoiceInfo.playerName.trim() === "") {
      alert("선수 이름을 입력해 주세요.");
      pNameRef.current?.focus();
      return;
    }
    if (!validateDate(invoiceInfo.playerBirth)) {
      alert("생년월일을 올바른 형식(YYYY-MM-DD)으로 입력해 주세요. (예: 1995-05-20)");
      pBirthRef.current?.focus();
      return;
    }
    if (!validatePhoneNumber(invoiceInfo.playerTel)) {
      alert("연락처를 올바른 형식(010-0000-0000)으로 입력해 주세요.");
      pTelRef.current?.focus();
      return;
    }
    if (!invoiceInfo.playerGym || invoiceInfo.playerGym.trim() === "") {
      alert("소속 (체육관 / 팀명 또는 무소속)을 입력해 주세요.");
      pGymRef.current?.focus();
      return;
    }

    const isValid = handlePlayerValidate();
    if (isValid) {
      setIsConfirmedInfo(true);
    }
  };

  function validateEmail(email) {
    return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhoneNumber(phoneNumber) {
    if (!phoneNumber) return false;
    const cleaned = String(phoneNumber).replace(/[^0-9]/g, "");
    if (cleaned.length < 9 || cleaned.length > 11) return false;
    return /^\d{2,3}-\d{3,4}-\d{4}$/.test(formatPhoneNumber(phoneNumber));
  }

  function validateDate(date) {
    return date && /^\d{4}-\d{2}-\d{2}$/.test(date);
  }

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "";
    const cleaned = String(phoneNumber).replace(/[^0-9]/g, "").slice(0, 11);

    if (cleaned.startsWith("02")) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
      if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      if (cleaned.length <= 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  }

  function formatDate(date) {
    if (!date) {
      return;
    }
    const sanitizedDate = date.replace(/[^\d.-]/g, "").replace(/-/g, ""); // `.`과 `,`과 `-`을 제외한 다른 문자 제거

    const match = sanitizedDate.match(/^(\d{0,4})(\d{0,2})(\d{0,2})$/); // 숫자 그룹으로 분리

    if (!match) return date; // 형식에 맞지 않는 경우 그대로 반환

    const formattedDate = match.slice(1).filter(Boolean).join("-"); // '-' 추가하여 조합
    return formattedDate;
  }

  return (
    <div className="flex justify-center items-start align-top bg-[#0B0B0B]">
      {isLoading && (
        <div
          className={`absolute top-0 left-1/2 w-full h-full border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center`}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
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

      {!isLoading && noticeInfo.contestTitle && (
        <div className="min-h-screen bg-[#0B0B0B] text-white w-full pb-28 font-sans antialiased">
          <BottomMenu />
          <Header title="대회 참가신청" />
          <Modal open={modal} onClose={handleCloseModal}>
            <div className="flex w-full justify-center items-center">{modalComponent}</div>
          </Modal>
          <ConfirmationModal
            isOpen={optionOpen}
            onConfirm={() => setOptionOpen(false)}
            onCancel={() => setOptionOpen(false)}
            message={message}
          />

          <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
            {/* Top Contest Header Banner Card */}
            <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-col gap-y-2">
                <div className="flex items-center gap-x-2">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase tracking-wider">
                    {noticeInfo.contestPromoter || "보디빌딩협회"}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500">공식 참가접수</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                  {noticeInfo.contestTitle}
                </h1>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-neutral-400 mt-2">
                  <span className="flex items-center gap-x-1.5 font-medium">
                    <RiTimeLine className="text-white text-base" />
                    {dayjs(noticeInfo.contestDate).format("YYYY년 MM월 DD일")}
                  </span>
                  {noticeInfo.contestLocation && (
                    <span className="flex items-center gap-x-1.5 font-medium">
                      <MdOutlineLocationOn className="text-white text-base" />
                      {noticeInfo.contestLocation}
                    </span>
                  )}
                  {noticeInfo.contestPriceBasic && (
                    <span className="flex items-center gap-x-1.5 font-medium">
                      <MdCreditCard className="text-white text-base" />
                      기본 {noticeInfo.contestPriceBasic?.toLocaleString()}원
                    </span>
                  )}
                </div>
              </div>

              {noticeInfo.contestCollectionFileLink && (
                <a
                  href={noticeInfo.contestCollectionFileLink}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full shadow-lg transition flex items-center justify-center gap-2 cursor-pointer w-full md:w-auto text-center"
                >
                  모집 요강 다운로드
                </a>
              )}
            </div>

            {/* Main 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Steps (8 Cols on PC) */}
              <div className="lg:col-span-8 flex flex-col gap-y-8">
                {/* Step 1: Personal Info */}
                <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                    <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-x-2.5">
                      <span className="w-7 h-7 rounded-full bg-white text-black text-xs flex items-center justify-center font-black">1</span>
                      선수 정보 입력
                    </h2>
                    <span className="text-xs text-neutral-500 font-medium">* 필수정보 항목</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">선수 이름</label>
                      <input
                        type="text"
                        value={invoiceInfo.playerName}
                        name="playerName"
                        ref={pNameRef}
                        onChange={handleInputs}
                        disabled={isConfirmedInfo}
                        className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                          isConfirmedInfo
                            ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                            : playerValidate.playerName
                            ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                            : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                        }`}
                        placeholder="이름 입력"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">성별</label>
                      <select
                        name="playerGender"
                        ref={pGenderRef}
                        onChange={handleInputs}
                        value={invoiceInfo.playerGender}
                        disabled={isConfirmedInfo}
                        className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                          isConfirmedInfo
                            ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                            : "bg-[#1A1A1A] text-white border-neutral-800 focus:outline-none focus:border-white cursor-pointer"
                        }`}
                      >
                        <option value="m">남자</option>
                        <option value="f">여자</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">생년월일 (YYYY-MM-DD)</label>
                      <div className="flex items-center gap-x-2">
                        <input
                          type="text"
                          value={invoiceInfo.playerBirth || ""}
                          name="playerBirth"
                          ref={pBirthRef}
                          onChange={handleInputs}
                          disabled={isConfirmedInfo}
                          className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                            isConfirmedInfo
                              ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                              : playerValidate.playerBirth
                              ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                              : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                          }`}
                          placeholder="YYYY-MM-DD (예: 1995-05-20)"
                        />
                        <span className="text-xs font-black text-neutral-300 whitespace-nowrap bg-neutral-900 px-3 py-3 rounded-2xl border border-neutral-800">
                          {playerAge || 0}세
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">연락처</label>
                      <input
                        type="text"
                        value={invoiceInfo.playerTel}
                        name="playerTel"
                        ref={pTelRef}
                        onChange={handleInputs}
                        disabled={isConfirmedInfo}
                        className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                          isConfirmedInfo
                            ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                            : playerValidate.playerTel
                            ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                            : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                        }`}
                        placeholder="010-0000-0000"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-neutral-400 mb-1.5">소속 (체육관 / 소속팀)</label>
                      <input
                        type="text"
                        value={invoiceInfo.playerGym}
                        name="playerGym"
                        ref={pGymRef}
                        onChange={handleInputs}
                        disabled={isConfirmedInfo}
                        className={`w-full px-4 py-3 border rounded-2xl text-sm font-medium transition ${
                          isConfirmedInfo
                            ? "bg-neutral-900 text-neutral-500 cursor-not-allowed border-neutral-800"
                            : playerValidate.playerGym
                            ? "bg-[#1A1A1A] border-rose-500 text-white focus:outline-none"
                            : "bg-[#1A1A1A] border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-white"
                        }`}
                        placeholder="소속 헬스장 또는 무소속"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    {isConfirmedInfo ? (
                      <>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3.5 py-2 rounded-full border border-emerald-800/60 flex items-center gap-x-1.5">
                          <RiCheckDoubleFill className="text-base" />
                          선수 정보 검증 & 입력 잠금 완료
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsConfirmedInfo(false)}
                          className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs rounded-full border border-neutral-700 transition cursor-pointer"
                        >
                          정보 다시 수정하기
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-xs text-neutral-500 font-medium">
                          * 입력 정보 확인 후 아래 버튼을 클릭하면 2단계 종목 선택으로 이동합니다.
                        </span>
                        <button
                          type="button"
                          onClick={handlePlayerValidateButtonClick}
                          className="px-6 py-3 bg-white hover:bg-neutral-200 text-black font-black text-xs rounded-full transition shadow-lg cursor-pointer flex items-center gap-x-2"
                        >
                          <span>선수 정보 확인 및 잠금</span>
                          <span className="text-xs text-neutral-500 font-bold">→ Step 2</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Step 2: Category & Grade Selection */}
                {isValidate && (
                  <div className="bg-[#141414] border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col gap-y-6">
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                      <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-x-2.5">
                        <span className="w-7 h-7 rounded-full bg-white text-black text-xs flex items-center justify-center font-black">2</span>
                        참가 종목 및 체급 선택
                      </h2>
                      <span className="text-xs text-neutral-400 font-bold bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">중복 신청 가능</span>
                    </div>

                    {/* 참가비 유의사항 안내 박스 */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-start gap-x-3 text-neutral-300 text-xs leading-relaxed">
                      <RiErrorWarningLine className="text-neutral-400 text-lg flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white block mb-0.5">참가비용 관련 유의사항</span>
                        <span>
                          학생부, 피트니스 챌린지와 보디빌딩 중복 출전의 경우 정확한 참가비용은 경기도보디빌딩협회를 통해 안내 받으시기 바랍니다.
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCategorys.length > 0 &&
                        filteredCategorys.map((category) => {
                          const {
                            contestCategoryTitle: cTitle,
                            contestCategoryId: cId,
                            contestCategoryPriceType: cType,
                          } = category;
                          const matchGrades = grades.filter(
                            (grade) => grade.refCategoryId === cId
                          );

                          const selectedJoinInThisCat = invoiceInfo?.joins.find(
                            (join) => join.contestCategoryId === cId
                          );

                          const badgeText = (() => {
                            if (cType === "type1" && noticeInfo?.contestPriceType1) {
                              return `+${noticeInfo.contestPriceType1.toLocaleString()}원`;
                            }
                            if (cType === "type2" && noticeInfo?.contestPriceType2) {
                              return `+${noticeInfo.contestPriceType2.toLocaleString()}원`;
                            }
                            return null;
                          })();

                          return (
                            <div
                              key={cId}
                              className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-y-3 ${
                                selectedJoinInThisCat
                                  ? "bg-[#1E1E1E] border-white shadow-lg shadow-white/5"
                                  : "bg-[#181818] border-neutral-800 hover:border-neutral-700"
                              }`}
                            >
                              {/* Uniform Header: min-h-[36px] ensures consistent height across cards */}
                              <div className="flex items-center justify-between min-h-[36px] gap-x-2">
                                <span className="text-sm font-black text-white tracking-tight break-keep">
                                  {cTitle}
                                </span>
                                {badgeText && (
                                  <span className="shrink-0 text-[10px] font-bold text-neutral-300 bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
                                    {badgeText}
                                  </span>
                                )}
                              </div>

                              {matchGrades?.length > 0 && (
                                <select
                                  id={cId}
                                  name={cTitle}
                                  value={
                                    selectedJoinInThisCat
                                      ? `${selectedJoinInThisCat.contestGradeId},${selectedJoinInThisCat.contestGradeTitle},${cType || ""}`
                                      : ""
                                  }
                                  className="w-full px-3 py-2.5 bg-[#121212] border border-neutral-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-white cursor-pointer"
                                  onChange={(e) => handleInvoiceInfo(e)}
                                >
                                  <option value="">체급을 선택해 주세요 (미참가)</option>
                                  {matchGrades.map((grade) => {
                                    const {
                                      contestGradeTitle: gTitle,
                                      contestGradeId: gId,
                                    } = grade;

                                    return (
                                      <option
                                        key={gId}
                                        value={`${gId},${gTitle},${cType || ""}`}
                                      >
                                        {gTitle}
                                      </option>
                                    );
                                  })}
                                </select>
                              )}
                            </div>
                          );
                        })}
                    </div>

                    {/* Step 3: Terms Agreement */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 mt-4">
                      <label className="flex items-start gap-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="m2Apply"
                          value="m2Apply"
                          className="mt-1 w-4 h-4 accent-white rounded cursor-pointer"
                          onChange={handleApply}
                        />
                        <div className="flex-1">
                          <span className="text-xs font-black text-white mr-1.5">[필수]</span>
                          <span className="text-xs font-semibold text-neutral-300">
                            개인정보 수집 이용 동의 및 초상권 사용 동의서에 동의합니다.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenModal({
                              component: <Policy3 onClose={() => setModal(false)} />,
                            })
                          }
                          className="text-xs text-neutral-400 hover:text-white underline font-semibold ml-2"
                        >
                          약관보기
                        </button>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Summary & Action Card (4 Cols on PC) */}
              <div className="lg:col-span-4">
                <div className="sticky top-20 bg-[#141414] border border-neutral-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-y-6">
                  <h3 className="text-base font-black text-white border-b border-neutral-800/80 pb-3 flex items-center justify-between">
                    <span>선택 종목 및 신청 요약</span>
                    <span className="text-xs font-bold text-white bg-neutral-800 px-2.5 py-0.5 rounded-full border border-neutral-700">
                      {invoiceInfo.joins.length}개 선택됨
                    </span>
                  </h3>

                  {/* Selected Joins List */}
                  <div className="flex flex-col gap-y-2.5 min-h-[100px]">
                    {invoiceInfo.joins.length > 0 ? (
                      invoiceInfo.joins.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-[#1A1A1A] border border-neutral-800 rounded-xl p-3 text-xs"
                        >
                          <span className="font-bold text-white">{item.contestCategoryTitle}</span>
                          <span className="font-bold text-black bg-white px-2 py-0.5 rounded-full">
                            {item.contestGradeTitle}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center text-xs text-neutral-500 font-medium">
                        선택된 참가 종목이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* Payment Account Notice */}
                  {noticeInfo.contestAccountOwner && (
                    <div className="bg-[#1A1A1A] border border-neutral-800 rounded-2xl p-4 text-xs flex flex-col gap-y-1.5 text-neutral-300">
                      <span className="font-black text-white">입금 계좌 안내</span>
                      <p>
                        {noticeInfo.contestBankName || ""} {noticeInfo.contestAccountNumber}
                      </p>
                      <p className="text-neutral-500">(예금주: {noticeInfo.contestAccountOwner})</p>
                    </div>
                  )}

                  {/* Final Action Button */}
                  {invoiceInfo.joins.length > 0 && isApply.value && isValidate ? (
                    <button
                      className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-xl transition cursor-pointer text-center tracking-tight"
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
                      참가신청서 확인 및 제출
                    </button>
                  ) : (
                    <button
                      className="w-full py-4 bg-neutral-900 border border-neutral-800 text-neutral-600 font-bold text-xs rounded-full cursor-not-allowed text-center"
                      disabled
                    >
                      {!isValidate
                        ? "1단계 선수정보 확인을 진행해 주세요"
                        : invoiceInfo.joins.length === 0
                        ? "2단계 참가 종목을 선택해 주세요"
                        : "약관 동의가 필요합니다"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default ContestJoin;
