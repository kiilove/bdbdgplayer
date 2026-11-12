import {
  formatBirthDate,
  formatPhoneNumber,
  calculateAge,
  validateEmail,
  validatePhoneNumber,
  validateDate,
  normalizePriceType,
  getCategoryPriceBadgeText,
  calculateContestPrice,
  getContestDDayBadge,
} from "./formatUtils";

describe("formatUtils - 생년월일 및 전화번호 포맷팅", () => {
  test("formatBirthDate: 숫자 8자리를 YYYY-MM-DD 형식으로 자동 포맷팅한다", () => {
    expect(formatBirthDate("")).toBe("");
    expect(formatBirthDate("1995")).toBe("1995");
    expect(formatBirthDate("199505")).toBe("1995-05");
    expect(formatBirthDate("19950520")).toBe("1995-05-20");
    expect(formatBirthDate("1995-05-2099")).toBe("1995-05-20");
  });

  test("formatPhoneNumber: 휴대폰(010) 및 서울(02)·지역번호를 올바르게 포맷팅한다", () => {
    expect(formatPhoneNumber("")).toBe("");
    expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
    expect(formatPhoneNumber("0101234567")).toBe("010-123-4567");
    expect(formatPhoneNumber("0212345678")).toBe("02-1234-5678");
    expect(formatPhoneNumber("021234567")).toBe("02-123-4567");
    expect(formatPhoneNumber("0311234567")).toBe("031-123-4567");
  });
});

describe("formatUtils - 입력값 유효성 검증 및 만나이 계산", () => {
  test("validateEmail: 이메일 형식을 정확히 검증한다", () => {
    expect(validateEmail("player@bdbdg.kr")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });

  test("validatePhoneNumber: 유효한 전화번호만 통과시킨다", () => {
    expect(validatePhoneNumber("010-1234-5678")).toBe(true);
    expect(validatePhoneNumber("02-123-4567")).toBe(true);
    expect(validatePhoneNumber("010-12")).toBe(false);
    expect(validatePhoneNumber("")).toBe(false);
  });

  test("validateDate: YYYY-MM-DD 형식 및 실제 달력 날짜 유효성을 검증한다", () => {
    expect(validateDate("1995-05-20")).toBe(true);
    expect(validateDate("2024-02-29")).toBe(true); // 윤년 허용
    expect(validateDate("2023-02-29")).toBe(false); // 평년 2월 29일 차단
    expect(validateDate("1995-99-99")).toBe(false); // 존재하지 않는 월/일 차단
    expect(validateDate("2099-01-01")).toBe(false); // 미래 생년월일 차단
    expect(validateDate("1850-01-01")).toBe(false); // 비정상 과거 연도 차단
    expect(validateDate("19950520")).toBe(false);
    expect(validateDate("")).toBe(false);
  });

  test("calculateAge: 생년월일 기준 만 나이를 0 이상 정수로 반환하며 잘못된 날짜는 0을 반환한다", () => {
    expect(calculateAge("")).toBe(0);
    expect(calculateAge("1995")).toBe(0);
    expect(calculateAge("1995-99-99")).toBe(0);
    const age = calculateAge("1990-01-01");
    expect(age).toBeGreaterThanOrEqual(30);
  });
});

describe("formatUtils - 대회 참가비 계산 비즈니스 로직 (calculateContestPrice)", () => {
  const samplePricePolicy = {
    contestPriceBasic: 100000,
    contestPriceType1: 120000,
    contestPriceType2: 150000,
    contestPriceExtra: 50000,
    contestPriceExtraType: "누적",
  };

  test("종목 선택이 없을 때 참가비는 0원이다", () => {
    expect(calculateContestPrice([], samplePricePolicy)).toBe(0);
    expect(calculateContestPrice(null, samplePricePolicy)).toBe(0);
  });

  test("단일 종목 신청 시 각 종목 가격 타입(basic / 타입1 / 타입2)에 맞는 참가비를 반환한다", () => {
    expect(
      calculateContestPrice(
        [{ contestCategoryPriceType: "기본" }],
        samplePricePolicy
      )
    ).toBe(100000);

    expect(
      calculateContestPrice(
        [{ contestCategoryPriceType: "타입1" }],
        samplePricePolicy
      )
    ).toBe(120000);

    expect(
      calculateContestPrice(
        [{ contestCategoryPriceType: "type2" }],
        samplePricePolicy
      )
    ).toBe(150000);
  });

  test("다중 종목 신청 + '누적' 정책일 때 추가 종목당 참가비가 누적 가산된다", () => {
    const joins = [
      { contestCategoryPriceType: "기본" },
      { contestCategoryPriceType: "기본" },
      { contestCategoryPriceType: "기본" },
    ];
    // 기본 100,000 + 추가 2종목 * 50,000 = 200,000
    expect(calculateContestPrice(joins, samplePricePolicy)).toBe(200000);
  });

  test("다중 종목 신청 + '정액' 정책일 때 추가 종목 수와 무관하게 정액 추가비만 1회 가산된다", () => {
    const flatPolicy = {
      ...samplePricePolicy,
      contestPriceExtraType: "정액",
    };
    const joins = [
      { contestCategoryPriceType: "기본" },
      { contestCategoryPriceType: "기본" },
      { contestCategoryPriceType: "기본" },
    ];
    // 기본 100,000 + 정액 50,000 = 150,000
    expect(calculateContestPrice(joins, flatPolicy)).toBe(150000);
  });

  test("다중 종목에 타입1 종목이 포함되면 타입1 기본가를 기준으로 중복 참가비를 계산한다", () => {
    const joins = [
      { contestCategoryPriceType: "기본" },
      { contestCategoryPriceType: "타입1" },
    ];
    // 타입1 기본가 120,000 + 누적 1종목 50,000 = 170,000
    expect(calculateContestPrice(joins, samplePricePolicy)).toBe(170000);
  });

  test("normalizePriceType & getCategoryPriceBadgeText: 한글/영문 가격 타입을 모두 호환한다", () => {
    expect(normalizePriceType("타입1")).toBe("type1");
    expect(normalizePriceType("TYPE2")).toBe("type2");
    expect(normalizePriceType("일반")).toBe("basic");
    expect(getCategoryPriceBadgeText("타입1", samplePricePolicy)).toBe(
      "120,000원"
    );
    expect(getCategoryPriceBadgeText("기본", samplePricePolicy)).toBeNull();
  });
});

describe("formatUtils - D-Day 배지 계산 (getContestDDayBadge)", () => {
  test("오늘 날짜는 D-DAY 및 긴박 상태(isUrgent: true)를 반환한다", () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    expect(getContestDDayBadge(`${yyyy}-${mm}-${dd}`)).toEqual({
      label: "D-DAY",
      isUrgent: true,
    });
  });

  test("이미 지난 날짜나 잘못된 날짜는 null을 반환한다", () => {
    expect(getContestDDayBadge("2000-01-01")).toBeNull();
    expect(getContestDDayBadge("invalid-date")).toBeNull();
    expect(getContestDDayBadge("")).toBeNull();
  });
});

