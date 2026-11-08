/**
 * 입력된 숫자를 바탕으로 생년월일 (YYYY-MM-DD) 자동 하이픈 포맷팅
 */
export const formatBirthDate = (value) => {
  if (!value) return "";
  const cleaned = String(value).replace(/\D/g, "").slice(0, 8);
  if (cleaned.length <= 4) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  } else {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
  }
};

/**
 * 입력된 숫자를 바탕으로 전화번호 (010-XXXX-XXXX 등) 자동 하이픈 포맷팅
 */
export const formatPhoneNumber = (value) => {
  if (!value) return "";
  const cleaned = String(value).replace(/\D/g, "").slice(0, 11);

  if (cleaned.startsWith("02")) {
    // 서울 지역번호 (02)
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
    if (cleaned.length <= 9) {
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
    }
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
  } else {
    // 휴대폰(010, 011 등) 및 일반 3자리 지역번호 (031, 032 등)
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    if (cleaned.length <= 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
  }
};

/**
 * 생년월일 (YYYY-MM-DD 또는 YYYYMMDD) 기준 만 나이 계산
 */
export const calculateAge = (birthDateStr) => {
  if (!birthDateStr) return 0;
  const cleaned = String(birthDateStr).replace(/\D/g, "");
  if (cleaned.length < 8) return 0;

  const year = parseInt(cleaned.slice(0, 4), 10);
  const month = parseInt(cleaned.slice(4, 6), 10) - 1;
  const day = parseInt(cleaned.slice(6, 8), 10);

  const birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age < 0 ? 0 : age;
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email) => {
  return Boolean(email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
};

/**
 * 전화번호 유효성 검사
 */
export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return false;
  const cleaned = String(phoneNumber).replace(/[^0-9]/g, "");
  if (cleaned.length < 9 || cleaned.length > 11) return false;
  return /^\d{2,3}-\d{3,4}-\d{4}$/.test(formatPhoneNumber(phoneNumber));
};

/**
 * 생년월일(YYYY-MM-DD) 유효성 검사
 */
export const validateDate = (date) => {
  return Boolean(date && /^\d{4}-\d{2}-\d{2}$/.test(date));
};

/**
 * 종목 가격 타입 정규화 ("타입1" / "type1" 모두 호환)
 */
export const normalizePriceType = (rawType) => {
  if (!rawType) return "basic";
  const str = String(rawType).trim().toLowerCase();
  if (str === "타입1" || str === "type1") return "type1";
  if (str === "타입2" || str === "type2") return "type2";
  return "basic";
};

/**
 * 종목 카드 우측 참가비 배지 텍스트 반환
 */
export const getCategoryPriceBadgeText = (rawType, priceSource = {}) => {
  const norm = normalizePriceType(rawType);
  if (norm === "type1" && Number(priceSource?.contestPriceType1) > 0) {
    return `${Number(priceSource.contestPriceType1).toLocaleString()}원`;
  }
  if (norm === "type2" && Number(priceSource?.contestPriceType2) > 0) {
    return `${Number(priceSource.contestPriceType2).toLocaleString()}원`;
  }
  return null;
};

/**
 * 참가 신청 종목 배열과 대회 가격 정책을 기반으로 총 참가비 계산
 */
export const calculateContestPrice = (joins = [], priceInfo = {}) => {
  const list = Array.isArray(joins) ? joins : [];
  const categoryCount = list.length;
  if (categoryCount === 0) return 0;

  const basicPrice = parseInt(priceInfo.contestPriceBasic || 0, 10) || 0;
  const type1Price = parseInt(priceInfo.contestPriceType1 || 0, 10) || 0;
  const type2Price = parseInt(priceInfo.contestPriceType2 || 0, 10) || 0;
  const extraUnit = parseInt(priceInfo.contestPriceExtra || 0, 10) || 0;
  const extraType = priceInfo.contestPriceExtraType || "";

  if (categoryCount === 1) {
    const norm = normalizePriceType(list[0].contestCategoryPriceType);
    if (norm === "type1") return type1Price || basicPrice;
    if (norm === "type2") return type2Price || basicPrice;
    return basicPrice;
  }

  let extraPrice = 0;
  if (extraType === "누적") {
    extraPrice = extraUnit * (categoryCount - 1);
  } else if (extraType === "정액") {
    extraPrice = extraUnit;
  }

  const hasType1 = list.some(
    (d) => normalizePriceType(d.contestCategoryPriceType) === "type1"
  );
  const hasType2 = list.some(
    (d) => normalizePriceType(d.contestCategoryPriceType) === "type2"
  );

  let basePrice = basicPrice;
  if (hasType1 && type1Price > 0) {
    basePrice = type1Price;
  } else if (hasType2 && type2Price > 0) {
    basePrice = type2Price;
  }

  return basePrice + extraPrice;
};

/**
 * 대회 개최일 기준 D-Day 배지 정보 반환 (Kream / Luma 스타일 긴박감 표시)
 */
export const getContestDDayBadge = (contestDateStr) => {
  if (!contestDateStr) return null;
  const parsed = new Date(contestDateStr);
  if (Number.isNaN(parsed.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  );

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return { label: "D-DAY", isUrgent: true };
  }
  if (diffDays > 0) {
    return {
      label: `D-${diffDays}`,
      isUrgent: diffDays <= 7,
    };
  }
  return null;
};
