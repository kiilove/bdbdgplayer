import dayjs from "dayjs";
import { where } from "firebase/firestore";
import {
  getDocumentById,
  queryDocuments,
  createDocument,
  updateDocumentById,
  deleteDocumentById,
} from "./firestoreService";
import {
  formatBirthDate,
  formatPhoneNumber,
  calculateContestPrice,
} from "../utils/formatUtils";

const CONTEST_CACHE_TTL_MS = 60 * 1000; // 60초 메모리 캐시
const INVOICE_MAP_CACHE_TTL_MS = 30 * 1000; // 30초 메모리 캐시

let activeContestsCache = {
  data: null,
  timestamp: 0,
  promise: null,
};

let userInvoiceMapCache = {
  uid: null,
  data: null,
  timestamp: 0,
  promise: null,
};

let archivePostersCache = {
  data: null,
  timestamp: 0,
  promise: null,
};

const ARCHIVE_POSTERS_TTL_MS = 10 * 60 * 1000; // 10분 메모리 캐시

/**
 * 동기적으로 유효한 역대 대회 포스터 캐시 조회
 */
export const getCachedArchivePosters = () => {
  if (
    archivePostersCache.data &&
    Date.now() - archivePostersCache.timestamp < ARCHIVE_POSTERS_TTL_MS
  ) {
    return archivePostersCache.data;
  }
  return null;
};

/**
 * 역대 모든 대회 공고(contest_notice)에서 유효한 포스터 URL 목록 조회 (배경 타일용)
 */
export const fetchArchiveContestPosters = async () => {
  const cached = getCachedArchivePosters();
  if (cached) return cached;
  if (archivePostersCache.promise) return archivePostersCache.promise;

  const requestPromise = queryDocuments("contest_notice")
    .then((list) => {
      const normalized = Array.isArray(list) ? list : [];
      // 최신 대회순 정렬 후 유효한 이미지 URL만 중복 없이 추출
      const sorted = [...normalized].sort((a, b) =>
        String(b.contestDate || "").localeCompare(String(a.contestDate || ""))
      );
      const seen = new Set();
      const posters = [];
      sorted.forEach((item) => {
        const url = item?.contestPoster?.trim();
        if (url && url.startsWith("http") && !seen.has(url)) {
          seen.add(url);
          posters.push({
            id: item.id,
            url,
            title: item.contestTitle || "대회 포스터",
          });
        }
      });

      archivePostersCache = {
        data: posters,
        timestamp: Date.now(),
        promise: null,
      };
      return posters;
    })
    .catch(() => {
      archivePostersCache.promise = null;
      return [];
    });

  archivePostersCache.promise = requestPromise;
  return requestPromise;
};

/**
 * 신청서 신규 제출 또는 수정 시 메모리 캐시 즉시 무효화
 */
export const invalidateContestCache = () => {
  activeContestsCache = { data: null, timestamp: 0, promise: null };
  userInvoiceMapCache = { uid: null, data: null, timestamp: 0, promise: null };
};

/**
 * 동기적으로 유효한 접수중 대회 캐시 조회 (탭 전환 시 스피너 없이 즉시 렌더링용)
 */
export const getCachedActiveContests = () => {
  if (
    activeContestsCache.data &&
    Date.now() - activeContestsCache.timestamp < CONTEST_CACHE_TTL_MS
  ) {
    return activeContestsCache.data;
  }
  return null;
};

/**
 * 동기적으로 유효한 선수 신청내역 맵 캐시 조회
 */
export const getCachedUserInvoiceMap = (playerUid) => {
  if (
    playerUid &&
    userInvoiceMapCache.uid === playerUid &&
    userInvoiceMapCache.data &&
    Date.now() - userInvoiceMapCache.timestamp < INVOICE_MAP_CACHE_TTL_MS
  ) {
    return userInvoiceMapCache.data;
  }
  return null;
};

/**
 * 현재 접수중인 대회 공고 목록 조회 (contestDate 오름차순, 중복 요청 방지 및 메모리 캐싱 지원)
 */
export const fetchActiveContests = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cached = getCachedActiveContests();
    if (cached) return cached;
    if (activeContestsCache.promise) return activeContestsCache.promise;
  }

  const conditions = [where("contestStatus", "==", "접수중")];
  const requestPromise = queryDocuments(
    "contest_notice",
    conditions,
    "contestDate",
    "asc"
  )
    .then((list) => {
      const normalized = Array.isArray(list) ? list : [];
      activeContestsCache = {
        data: normalized,
        timestamp: Date.now(),
        promise: null,
      };
      return normalized;
    })
    .catch((err) => {
      activeContestsCache.promise = null;
      throw err;
    });

  activeContestsCache.promise = requestPromise;
  return requestPromise;
};

/**
 * 특정 선수의 유효한 참가신청서(취소되지 않은 내역) 맵 조회
 * 반환 형태: { [contestId]: invoiceId }
 */
export const fetchUserActiveInvoiceMap = async (
  playerUid,
  { forceRefresh = false } = {}
) => {
  if (!playerUid) return {};

  if (!forceRefresh) {
    const cached = getCachedUserInvoiceMap(playerUid);
    if (cached) return cached;
    if (
      userInvoiceMapCache.uid === playerUid &&
      userInvoiceMapCache.promise
    ) {
      return userInvoiceMapCache.promise;
    }
  }

  const requestPromise = queryDocuments("invoices_pool", [
    where("playerUid", "==", playerUid),
  ])
    .then((list) => {
      const map = {};
      list.forEach((inv) => {
        if (!inv.isCanceled && inv.contestId) {
          map[inv.contestId] = inv.id;
        }
      });
      userInvoiceMapCache = {
        uid: playerUid,
        data: map,
        timestamp: Date.now(),
        promise: null,
      };
      return map;
    })
    .catch((err) => {
      userInvoiceMapCache.promise = null;
      throw err;
    });

  userInvoiceMapCache = {
    ...userInvoiceMapCache,
    uid: playerUid,
    promise: requestPromise,
  };
  return requestPromise;
};

/**
 * 경기도보디빌딩협회 직접 주관/주최 대회 여부 판별 헬퍼
 */
export const isGbbfContest = (item) =>
  Boolean(
    item?.contestPromoter?.includes("경기도") ||
      item?.contestAssociate?.includes("경기도")
  );

/**
 * 특정 선수의 전체 참가신청 내역 목록 조회 (마이페이지용, 최신 신청순 정렬)
 */
export const fetchUserInvoices = async (playerUid) => {
  if (!playerUid) return [];
  const list = await queryDocuments("invoices_pool", [
    where("playerUid", "==", playerUid),
  ]);
  return [...list].sort((a, b) => {
    const dateA = a.invoiceCreateAt || a.contestDate || "";
    const dateB = b.invoiceCreateAt || b.contestDate || "";
    return String(dateB).localeCompare(String(dateA));
  });
};

/**
 * 종목 및 체급 목록 병렬 조회 ('그랑프리' 섹션 제외)
 */
export const fetchContestCategoriesAndGrades = async (
  categoryListId,
  gradeListId
) => {
  if (!categoryListId || !gradeListId) {
    return { categories: [], grades: [] };
  }

  const [categoryDoc, gradeDoc] = await Promise.all([
    getDocumentById("contest_categorys_list", categoryListId),
    getDocumentById("contest_grades_list", gradeListId),
  ]);

  const categories = (categoryDoc?.categorys || []).filter(
    (category) => category.contestCategorySection !== "그랑프리"
  );
  const grades = gradeDoc?.grades || [];

  return { categories, grades };
};

/**
 * 신규 참가신청 화면(ContestJoin)에 필요한 모든 데이터를 한 번에 병렬 로드
 */
export const fetchContestEntryBundle = async (noticeId) => {
  const notice = await getDocumentById("contest_notice", noticeId);
  if (!notice?.refContestId) {
    throw new Error("유효하지 않은 대회 공고입니다.");
  }

  const contest = await getDocumentById("contests", notice.refContestId);
  if (!contest?.contestNoticeId) {
    throw new Error("대회 상세 정보를 찾을 수 없습니다.");
  }

  const { categories, grades } = await fetchContestCategoriesAndGrades(
    contest.contestCategorysListId,
    contest.contestGradesListId
  );

  return {
    notice,
    contest,
    categories,
    grades,
  };
};

/**
 * 참가신청 수정 화면(ContestJoinEdit)에 필요한 모든 데이터를 한 번에 병렬 로드
 */
export const fetchInvoiceEditBundle = async (invoiceId) => {
  const invoice = await getDocumentById("invoices_pool", invoiceId);
  if (!invoice?.id) {
    throw new Error("존재하지 않는 신청 내역입니다.");
  }

  const formattedInvoice = {
    ...invoice,
    playerTel: formatPhoneNumber(invoice.playerTel || ""),
    playerBirth: formatBirthDate(invoice.playerBirth || ""),
  };

  const contest = invoice.contestId
    ? await getDocumentById("contests", invoice.contestId)
    : null;

  if (!contest?.contestNoticeId) {
    return {
      invoice: formattedInvoice,
      contest: contest || {},
      notice: {},
      categories: [],
      grades: [],
    };
  }

  const [notice, { categories, grades }] = await Promise.all([
    getDocumentById("contest_notice", contest.contestNoticeId),
    fetchContestCategoriesAndGrades(
      contest.contestCategorysListId,
      contest.contestGradesListId
    ),
  ]);

  return {
    invoice: formattedInvoice,
    contest,
    notice: notice || {},
    categories,
    grades,
  };
};

/**
 * 접수증 출력 모달(InvoicePrintModal)에서 누락된 공고 정보를 보충 조회
 */
export const fetchFallbackNoticeForPrint = async ({
  invoiceInfo,
  contestInfo,
}) => {
  if (contestInfo?.contestNoticeId) {
    const notice = await getDocumentById(
      "contest_notice",
      contestInfo.contestNoticeId
    );
    if (notice) return notice;
  }

  if (invoiceInfo?.contestId) {
    const contest = await getDocumentById("contests", invoiceInfo.contestId);
    if (contest?.contestNoticeId) {
      const notice = await getDocumentById(
        "contest_notice",
        contest.contestNoticeId
      );
      if (notice) return notice;
    }
    const directNotice = await getDocumentById(
      "contest_notice",
      invoiceInfo.contestId
    );
    if (directNotice?.contestTitle) return directNotice;
  }

  return {};
};

/**
 * 신규 참가신청 초기 폼 데이터 생성 (Firestore 필드명 100% 보존)
 */
export const buildInitialInvoicePayload = ({
  noticeInfo = {},
  contestInfo = {},
  playerInfo = {},
  fallbackContestId = "",
}) => ({
  invoicePoolId: contestInfo.invoicesPoolId || "",
  contestId: contestInfo.id || fallbackContestId || "",
  contestTitle: noticeInfo.contestTitle || "",
  contestDate: noticeInfo.contestDate || "",
  contestLocation: noticeInfo.contestLocation || "",
  // 기존 DB 스키마 호환을 위해 오타 필드(conntestPromoter)와 정식 필드 모두 유지
  conntestPromoter: noticeInfo.contestPromoter || "",
  contestPromoter: noticeInfo.contestPromoter || "",
  contestAssociate: noticeInfo.contestAssociate || "",
  contestCollectionFileLink: noticeInfo.contestCollectionFileLink || "",
  contestPriceBasic: noticeInfo.contestPriceBasic || 0,
  contestPriceExtra: noticeInfo.contestPriceExtra || 0,
  contestPriceExtraType: noticeInfo.contestPriceExtraType || "",
  contestPriceType1: noticeInfo.contestPriceType1 || 0,
  contestPriceType2: noticeInfo.contestPriceType2 || 0,
  contestBankName: noticeInfo.contestBankName || "",
  contestAccountNumber: noticeInfo.contestAccountNumber || "",
  contestAccountOwner: noticeInfo.contestAccountOwner || "",
  playerUid: playerInfo.playerUid || "",
  playerName: playerInfo.pName || "",
  playerTel: formatPhoneNumber(playerInfo.pTel || ""),
  playerEmail: playerInfo.pEmail || "",
  playerBirth: formatBirthDate(playerInfo.pBirth || ""),
  playerGym: playerInfo.pGym || "",
  playerGender: playerInfo.pGender || "m",
  playerText: "",
  isPriceCheck: false,
  joins: [],
});

/**
 * 신규 참가신청서 제출 및 저장 (invoices_pool)
 */
export const submitNewInvoice = async (invoiceInfo, invoicePrice) => {
  const randomString = Math.random().toString(36).substring(2, 6);
  const docuId = (
    randomString +
    "-" +
    Date.now().toString().substr(-6)
  ).toUpperCase();

  const rawData = {
    ...invoiceInfo,
    docuId,
    isCanceled: false,
    invoiceCreateAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
    contestPriceSum: parseInt(invoicePrice || 0, 10),
    createBy: "web",
  };

  const sanitizedData = {};
  Object.keys(rawData).forEach((key) => {
    sanitizedData[key] = rawData[key] !== undefined ? rawData[key] : "";
  });

  const created = await createDocument("invoices_pool", sanitizedData);
  invalidateContestCache();
  return created;
};

/**
 * 참가신청서 수정 저장 및 기존 출전명단 초기화
 * - 주의: 신청서 수정 시 입금확인(isPriceCheck: false) 초기화는 의도된 핵심 비즈니스 로직이므로 반드시 유지
 */
export const submitUpdatedInvoice = async (invoiceInfo, priceInfo) => {
  if (invoiceInfo.playerUid) {
    const existingEntries = await queryDocuments("contest_entrys_list", [
      where("playerUid", "==", invoiceInfo.playerUid),
    ]);

    if (existingEntries?.length > 0) {
      await Promise.all(
        existingEntries.map(async (entry) => {
          try {
            await deleteDocumentById("contest_entrys_list", entry.id);
          } catch {
            // 개별 삭제 실패 시 무시
          }
        })
      );
    }
  }

  const computedSum =
    parseInt(calculateContestPrice(invoiceInfo.joins, priceInfo), 10) || 0;

  const updatedPayload = {
    ...invoiceInfo,
    invoiceEdited: true,
    isPriceCheck: false, // 사용자 명확한 의도: 수정 시 입금확인 상태 무조건 초기화
    invoiceEditAt: dayjs(new Date()).format("YYYY-MM-DD HH:mm"),
    contestPriceSum: computedSum,
    createBy: "web",
  };

  const updated = await updateDocumentById(
    "invoices_pool",
    invoiceInfo.id,
    updatedPayload
  );
  invalidateContestCache();
  return updated;
};
