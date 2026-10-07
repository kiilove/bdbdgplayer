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
