import { useState, useEffect, useRef, useCallback } from "react";
import { handleToast } from "../components/HandleToast";
import {
  formatBirthDate,
  formatPhoneNumber,
  calculateAge,
  validatePhoneNumber,
  validateDate,
} from "../utils/formatUtils";

const computeFieldErrors = (targetInfo = {}) => ({
  playerName: !targetInfo.playerName || targetInfo.playerName.trim() === "",
  playerTel: !validatePhoneNumber(targetInfo.playerTel),
  playerBirth: !validateDate(targetInfo.playerBirth),
  playerGender: !targetInfo.playerGender,
  playerGym: !targetInfo.playerGym || targetInfo.playerGym.trim() === "",
});

export const useContestForm = ({ initialIsValidate = false } = {}) => {
  const [invoiceInfo, setInvoiceInfo] = useState({ joins: [] });
  const [categorys, setCategorys] = useState([]);
  const [filteredCategorys, setFilteredCategorys] = useState([]);
  const [grades, setGrades] = useState([]);
  const [chkAllItem, setChkAllItem] = useState(true);
  const [playerAge, setPlayerAge] = useState(0);
  const [isValidate, setIsValidate] = useState(initialIsValidate);
  const [isConfirmedInfo, setIsConfirmedInfo] = useState(initialIsValidate);
  const [hasAttemptedValidate, setHasAttemptedValidate] = useState(false);
  const [playerValidate, setPlayerValidate] = useState({
    playerName: false,
    playerTel: false,
    playerBirth: false,
    playerGym: false,
    playerGender: false,
  });

  const pNameRef = useRef(null);
  const pTelRef = useRef(null);
  const pGenderRef = useRef(null);
  const pEmailRef = useRef(null);
  const pBirthRef = useRef(null);
  const pGymRef = useRef(null);
  const pTextRef = useRef(null);

  const setCategoriesAndGrades = useCallback(
    (nextCategories = [], nextGrades = []) => {
      setCategorys([...nextCategories]);
      setFilteredCategorys([...nextCategories]);
      setGrades([...nextGrades]);
    },
    []
  );

  useEffect(() => {
    const gender = invoiceInfo.playerGender === "m" ? "남" : "여";
    const age = invoiceInfo.playerBirth
      ? calculateAge(invoiceInfo.playerBirth)
      : 0;
    setPlayerAge(age);

    if (chkAllItem) {
      setFilteredCategorys([...categorys]);
    } else {
      const genderFiltered = categorys.filter(
        (category) =>
          category.contestCategoryGender === gender ||
          category.contestCategoryGender === "무관"
      );
      setFilteredCategorys(genderFiltered);
    }
  }, [categorys, chkAllItem, invoiceInfo.playerGender, invoiceInfo.playerBirth]);

  useEffect(() => {
    const errors = computeFieldErrors(invoiceInfo);
    const hasInvalid = Object.values(errors).some((flag) => flag === true);
    setIsValidate(!hasInvalid);
    if (hasAttemptedValidate) {
      setPlayerValidate(errors);
    }
  }, [invoiceInfo, hasAttemptedValidate]);

  const handleInputs = useCallback((e) => {
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
  }, []);

  const handleInvoiceInfo = useCallback(
    (e) => {
      const { name, id, value } = e.target;

      setInvoiceInfo((prev) => {
        const currentJoins = Array.isArray(prev.joins) ? [...prev.joins] : [];

        if (!value || value === "체급선택") {
          return {
            ...prev,
            joins: currentJoins.filter(
              (category) => category.contestCategoryId !== id
            ),
          };
        }

        const matchedCategory = categorys.find(
          (cat) => cat.contestCategoryId === id
        );
        const matchedGrade =
          grades.find(
            (g) => g.contestGradeId === value && g.refCategoryId === id
          ) || grades.find((g) => g.contestGradeId === value);

        let gradeId = value;
        let gradeTitle = matchedGrade?.contestGradeTitle || "";
        let categoryPriceType =
          matchedCategory?.contestCategoryPriceType || "";

        if (!matchedGrade && value.includes(",")) {
          const parts = value.split(",");
          gradeId = parts[0];
          gradeTitle = parts[1] || "";
          categoryPriceType = parts[2] || categoryPriceType;
        }

        const newEntry = {
          contestCategoryId: id,
          contestCategoryTitle:
            matchedCategory?.contestCategoryTitle || name || "",
          contestCategoryPriceType: categoryPriceType,
          contestGradeId: gradeId,
          contestGradeTitle: gradeTitle,
        };

        const existingIdx = currentJoins.findIndex(
          (category) => category.contestCategoryId === id
        );

        if (existingIdx === -1) {
          currentJoins.push(newEntry);
        } else {
          currentJoins.splice(existingIdx, 1, newEntry);
        }

        return { ...prev, joins: currentJoins };
      });
    },
    [categorys, grades]
  );

  const handlePlayerValidateButtonClick = useCallback(() => {
    setHasAttemptedValidate(true);
    const errors = computeFieldErrors(invoiceInfo);
    setPlayerValidate(errors);

    if (errors.playerName) {
      handleToast("warn", "선수 이름을 입력해 주세요.");
      pNameRef.current?.focus();
      return;
    }
    if (errors.playerBirth) {
      handleToast(
        "warn",
        "생년월일을 올바른 형식(YYYY-MM-DD)으로 입력해 주세요."
      );
      pBirthRef.current?.focus();
      return;
    }
    if (errors.playerTel) {
      handleToast("warn", "휴대폰 번호를 올바른 형식으로 입력해 주세요.");
      pTelRef.current?.focus();
      return;
    }
    if (errors.playerGym) {
      handleToast("warn", "소속 체육관/팀명(또는 무소속)을 입력해 주세요.");
      pGymRef.current?.focus();
      return;
    }

    setIsValidate(true);
    setIsConfirmedInfo(true);
  }, [invoiceInfo]);

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
    setCategoriesAndGrades,
    handleInputs,
    handleInvoiceInfo,
    handlePlayerValidateButtonClick,
  };
};
