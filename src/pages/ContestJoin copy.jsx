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

const ContestJoin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [noticeInfo, setNoticeInfo] = useState({});
  const [contests, setContests] = useState({});
  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalComponent, setModalComponent] = useState("");
  const [chkAllItem, setChkAllItem] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
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
  // const handleJoinGrade = (e) => {
  //   const { name, id, value } = e.target;
  //   const dummy = [...joinCategorys];

  //   const findCategory = dummy.some(
  //     (category) => category.contestCategoryId === id
  //   );
  //   const findIndex = dummy.findIndex(
  //     (category) => category.contestCategoryId === id
  //   );
  //   console.log(findCategory);

  //   if (!findCategory) {
  //     dummy.push({
  //       contestCategoryId: id,
  //       contestCategoryTitle: name,
  //       contestGradeId: value,
  //       invoicePoolId: contests.invoicesPoolId,
  //       contestId: contests.id,
  //       contests: { ...contests },
  //       pUid: userInfo.pUid,
  //       playerInfo: { ...pInfo },
  //       noticeInfo: { ...noticeInfo },
  //     });
  //   } else {
  //     dummy.splice(findIndex, 1, {
  //       contestCategoryId: id,
  //       contestCategoryTitle: name,
  //       contestGradeId: value,
  //       invoicePoolId: contests.invoicesPoolId,
  //       contestId: contests.id,
  //       contests: { ...contests },
  //       pUid: userInfo.pUid,
  //       playerInfo: { ...pInfo },
  //       noticeInfo: { ...noticeInfo },
  //     });
  //   }

  //   setJoinCategorys(dummy);
  //   console.log(joinCategorys);
  // };
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
        setGrades([...gradeData.grades]);
      } else {
        return;
      }
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  useEffect(() => {
    fetchCategorysAndGrades(
      contests.contestCategorysListId,
      contests.contestGradesListId
    );
    console.log("contests", contests);
  }, [contests]);

  useEffect(() => {
    if (
      !noticeInfo.contestTitle ||
      !contests.contestNoticeId ||
      !pInfo.pName ||
      !userInfo.pUid
    ) {
      console.log("??", noticeInfo.contestTitle);
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
      playerUid: userInfo.pUid,
      playerName: pInfo.pName,
      playerTel: pInfo.pTel,
      playerEmail: pInfo.pEmail,
      playerBirth: pInfo.pBirth,
      playerGym: pInfo.pGym || "무소속",
      playerGender: pInfo.pGender,
      joins: [],
    };
    setInvoiceInfo({ ...initInvocieInfo });
  }, [noticeInfo, contests, pInfo, userInfo]);

  const fileSave = (fileUrl) => {
    const fileURL = fileUrl;

    saveAs(fileURL, "filename.hwp");
  };

  useEffect(() => {
    console.log(invoiceInfo);
  }, [invoiceInfo]);

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
      {error && console.log(error)}
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
                  <div className="flex flex-col w-full p-4 border h-auto gap-y-1">
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
                      {pInfo.pName && pInfo.pName}
                    </span>
                    <div className="flex w-full text-purple-700">
                      <div className="flex w-1/4 justify-start">
                        <div className="flex justify-start items-center">
                          <BsGenderAmbiguous />
                        </div>
                        <div className="flex">
                          <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                            {pInfo.pGender && pInfo.pGender === "m"
                              ? "남자"
                              : "여자"}
                          </span>
                        </div>
                      </div>
                      <div className="flex w-3/4">
                        <div className="flex justify-start items-center ml-5">
                          <RiCalendarLine />
                        </div>
                        <div className="flex">
                          <span className="ml-1 text-sm font-semi-bold justify-start items-center">
                            {pInfo.pBirth && pInfo.pBirth}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full text-gray-700 flex-col gap-y-1">
                      <div className="flex w-full">
                        <div className="flex justify-start items-center">
                          <MdOutlineAlternateEmail />
                        </div>
                        <div className="flex">
                          <span className="ml-1 text-sm font-light justify-start items-center">
                            {pInfo.pEmail && pInfo.pEmail}
                          </span>
                        </div>
                      </div>
                      <div className="flex w-full">
                        <div className="flex justify-start items-center">
                          <GoDeviceMobile />
                        </div>
                        <div className="flex">
                          <span className="ml-1 text-sm font-light justify-start items-center">
                            {pInfo.pTel && pInfo.pTel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                    {/* <div className="flex w-full justify-around mt-2">
                      <button
                        className="bg-white border-orange-500 border rounded-md px-2 py-1 flex justify-center items-center mt-2  text-sm w-36 font-light"
                        onClick={() => setChkAllItem(!chkAllItem)}
                      >
                        {chkAllItem === true ? "최적종목표시" : "전체종목표시"}
                      </button>
                      <button className="bg-white border-orange-500 border rounded-md px-2 py-1 flex justify-center items-center mt-2  text-sm w-36 font-light">
                        선택초기화
                      </button>
                    </div> */}
                  </div>
                  <div className="flex w-full items-start justify-between mt-4 flex-wrap gap-2">
                    {categorys?.length > 0 &&
                      categorys.map((category, cIdex) => {
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
                          <div className="flex w-full h-14 border px-2 items-center justify-center">
                            <div className="flex h-10 justify-start items-center w-2/3">
                              <span className="text-sm">{cTitle}</span>
                            </div>
                            <div className="flex h-10 justify-start items-center w-1/3">
                              {matchGrades?.length > 0 && (
                                <select
                                  id={cId}
                                  name={cTitle}
                                  className="text-sm"
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
                                        value={gId + "," + gTitle + "," + cType}
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
                    {invoiceInfo.joins.length > 0 && isApply.value ? (
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
                        <span className="font-bold text-white text-lg">
                          종목선택과 개인정보 수집동의가 필요합니다.
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
