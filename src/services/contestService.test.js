import {
  isGbbfContest,
  buildInitialInvoicePayload,
  submitUpdatedInvoice,
} from "./contestService";
import * as firestoreService from "./firestoreService";

jest.mock("./firestoreService", () => ({
  getDocumentById: jest.fn(),
  queryDocuments: jest.fn(),
  createDocument: jest.fn(),
  updateDocumentById: jest.fn(),
  deleteDocumentById: jest.fn(),
}));

describe("contestService - 핵심 도메인 규칙 테스트", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("isGbbfContest: 주최(contestPromoter) 또는 주관(contestAssociate)에 '경기도'가 포함되면 true를 반환한다", () => {
    expect(
      isGbbfContest({
        contestPromoter: "경기도보디빌딩협회",
        contestAssociate: "수원시보디빌딩협회",
      })
    ).toBe(true);

    expect(
      isGbbfContest({
        contestPromoter: "화성시체육회",
        contestAssociate: "화성특례시보디빌딩협회",
      })
    ).toBe(false);
  });

  test("buildInitialInvoicePayload: 어드민 호환용 필드(conntestPromoter 포함)와 초기 상태(isPriceCheck: false)를 정확히 생성한다", () => {
    const payload = buildInitialInvoicePayload({
      noticeInfo: {
        contestTitle: "제13회 Mr. 화성특례시장배",
        contestPromoter: "화성시체육회",
        contestAssociate: "화성특례시보디빌딩협회",
        contestPriceBasic: 100000,
      },
      contestInfo: {
        id: "contest_123",
        invoicesPoolId: "pool_456",
      },
      playerInfo: {
        playerUid: "uid_abc",
        pName: "홍길동",
        pTel: "01012345678",
        pBirth: "19950520",
        pEmail: "hong@bdbdg.kr",
        pGym: "BDBDG짐",
        pGender: "m",
      },
    });

    expect(payload.contestId).toBe("contest_123");
    expect(payload.invoicePoolId).toBe("pool_456");
    // 레거시 오타 필드(conntestPromoter)와 정식 필드(contestPromoter) 동시 유지 검증
    expect(payload.conntestPromoter).toBe("화성시체육회");
    expect(payload.contestPromoter).toBe("화성시체육회");
    expect(payload.playerTel).toBe("010-1234-5678");
    expect(payload.playerBirth).toBe("1995-05-20");
    expect(payload.isPriceCheck).toBe(false);
    expect(payload.joins).toEqual([]);
  });

  test("submitUpdatedInvoice: 신청서 수정 시 기존 입금확인(isPriceCheck)을 반드시 false로 초기화하고 참가비를 재계산한다", async () => {
    firestoreService.queryDocuments.mockResolvedValueOnce([
      { id: "entry_1" },
      { id: "entry_2" },
    ]);
    firestoreService.deleteDocumentById.mockResolvedValue(true);
    firestoreService.updateDocumentById.mockImplementation(
      async (_col, id, data) => ({ id, ...data })
    );

    const existingInvoice = {
      id: "inv_999",
      playerUid: "uid_abc",
      isPriceCheck: true, // 기존에 입금확인 완료였던 상태
      joins: [
        { contestCategoryTitle: "맨즈피지크", contestCategoryPriceType: "기본" },
        { contestCategoryTitle: "보디빌딩", contestCategoryPriceType: "기본" },
      ],
    };

    const pricePolicy = {
      contestPriceBasic: 100000,
      contestPriceExtra: 40000,
      contestPriceExtraType: "누적",
    };

    const result = await submitUpdatedInvoice(existingInvoice, pricePolicy);

    // 1. 기존 출전명단(contest_entrys_list) 삭제 호출 검증
    expect(firestoreService.deleteDocumentById).toHaveBeenCalledTimes(2);
    expect(firestoreService.deleteDocumentById).toHaveBeenCalledWith(
      "contest_entrys_list",
      "entry_1"
    );

    // 2. 수정 시 isPriceCheck가 반드시 false로 리셋되고 금액이 재계산(140,000원)되는지 검증
    expect(result.isPriceCheck).toBe(false);
    expect(result.invoiceEdited).toBe(true);
    expect(result.contestPriceSum).toBe(140000);
  });

  test("submitUpdatedInvoice: 선수가 2개 이상 대회에 출전 중일 때 수정 대상 대회(contestId)의 엔트리만 삭제한다", async () => {
    firestoreService.queryDocuments.mockResolvedValueOnce([
      { id: "entry_other_contest", contestId: "contest_A" },
      { id: "entry_target_contest", contestId: "contest_B" },
    ]);
    firestoreService.deleteDocumentById.mockResolvedValue(true);
    firestoreService.updateDocumentById.mockImplementation(
      async (_col, id, data) => ({ id, ...data })
    );

    await submitUpdatedInvoice(
      {
        id: "inv_1000",
        contestId: "contest_B",
        playerUid: "uid_abc",
        joins: [{ contestCategoryTitle: "보디빌딩", contestCategoryPriceType: "기본" }],
      },
      { contestPriceBasic: 100000 }
    );

    expect(firestoreService.deleteDocumentById).toHaveBeenCalledTimes(1);
    expect(firestoreService.deleteDocumentById).toHaveBeenCalledWith(
      "contest_entrys_list",
      "entry_target_contest"
    );
  });
});

