import { useState, useEffect, useRef } from "react";
import { useFirestoreGetDocument } from "./useFirestores";
import {
  formatBirthDate,
  formatPhoneNumber,
  calculateAge,
  validatePhoneNumber,
  validateDate,
} from "../utils/formatUtils";

export const useContestForm = ({ initialIsValidate = false } = {}) => {
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
  const [categorys, setCategorys] = useState([]);
  const [filteredCategorys, setFilteredCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [chkAllItem, setChkAllItem] = useState(true);
  const [playerAge, setPlayerAge] = useState();
  const [isValidate, setIsValidate] = useState(initialIsValidate);
  const [isConfirmedInfo, setIsConfirmedInfo] = useState(false);
  const [playerValidate, setPlayerValidate] = useState({
    playerName: false,
    playerTel: false,
    playerBirth: false,
    playerGym: false,
    playerGender: false,
  });

  const pNameRef = useRef();
  const pTelRef = useRef();
  const pGenderRef = useRef();
  const pEmailRef = useRef();
  const pBirthRef = useRef();
  const pGymRef = useRef();
  const pTextRef = useRef();

  const getCategorys = useFirestoreGetDocument("contest_categorys_list");
  const getGrades = useFirestoreGetDocument("contest_grades_list");

  const fetchCategorysAndGrades = async (categoryListId, gradeListId, onError) => {
    if (!categoryListId || !gradeListId) return;
    try {
      const categoryData = await getCategorys.getDocument(categoryListId);
      const gradeData = await getGrades.getDocument(gradeListId);
      if (categoryData?.id && gradeData?.id) {
        const filteredCategories = (categoryData.categorys || []).filter(
          (category) => category.contestCategorySection !== "그랑프리"
        );
        setCategorys([...filteredCategories]);
        setFilteredCategorys([...filteredCategories]);
        setGrades([...(gradeData.grades || [])]);
      }
    } catch (err) {
      if (onError) onError(err);
    }
  };

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
  }, [categorys, chkAllItem, invoiceInfo.playerGender, invoiceInfo.playerBirth]);

  const handlePlayerValidate = (targetInfo = invoiceInfo) => {
    const updatedPlayerValidate = {
      playerName:
        !targetInfo.playerName || targetInfo.playerName.trim() === "",
      playerTel: !validatePhoneNumber(targetInfo.playerTel),
      playerBirth: !validateDate(targetInfo.playerBirth),
      playerGender: !targetInfo.playerGender,
      playerGym: !targetInfo.playerGym || targetInfo.playerGym.trim() === "",
    };

    setPlayerValidate(updatedPlayerValidate);
    const hasInvalid = Object.values(updatedPlayerValidate).some(
      (u) => u === true
    );
    setIsValidate(!hasInvalid);
    return !hasInvalid;
  };

  useEffect(() => {
    handlePlayerValidate(invoiceInfo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceInfo]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "playerBirth") {
      formattedValue = formatBirthDate(value);
    } else if (name === "playerTel") {
      formattedValue = formatPhoneNumber(value);
    }

    setInvoiceInfo((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
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
    const dummy = [...(invoiceInfo.joins || [])];
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

  const handlePlayerValidateButtonClick = () => {
    if (!invoiceInfo.playerName || invoiceInfo.playerName.trim() === "") {
      alert("선수 이름을 입력해 주세요.");
      pNameRef.current?.focus();
      return;
    }
    if (!validateDate(invoiceInfo.playerBirth)) {
      alert(
        "생년월일을 올바른 형식(YYYY-MM-DD)으로 입력해 주세요. (예: 1995-05-20)"
      );
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

    const isValid = handlePlayerValidate(invoiceInfo);
    if (isValid) {
      setIsConfirmedInfo(true);
    }
  };

  return {
    invoiceInfo,
    setInvoiceInfo,
    categorys,
    filteredCategorys,
    grades,
    chkAllItem,
    setChkAllItem,
    playerAge,
    isValidate,
    playerValidate,
    isConfirmedInfo,
    setIsConfirmedInfo,
    refs: {
      pNameRef,
      pTelRef,
      pGenderRef,
      pEmailRef,
      pBirthRef,
      pGymRef,
      pTextRef,
    },
    fetchCategorysAndGrades,
    handleInputs,
    handleInvoiceInfo,
    handlePlayerValidateButtonClick,
  };
};

