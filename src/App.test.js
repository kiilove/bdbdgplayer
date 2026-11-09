import { calculateContestPrice, formatPhoneNumber } from "./utils/formatUtils";

test("핵심 유틸리티 모듈이 정상적으로 로드되고 동작한다", () => {
  expect(formatPhoneNumber("01098765432")).toBe("010-9876-5432");
  expect(
    calculateContestPrice([{ contestCategoryPriceType: "기본" }], {
      contestPriceBasic: 80000,
    })
  ).toBe(80000);
});
