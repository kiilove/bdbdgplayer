import React, { useEffect, useMemo, useState } from "react";
import {
  fetchArchiveContestPosters,
  getCachedArchivePosters,
} from "../../services/contestService";

const COLUMN_COUNT = 7;
const ITEMS_PER_COLUMN = 7;
const COLUMN_DURATIONS = [
  "44s",
  "52s",
  "40s",
  "48s",
  "46s",
  "54s",
  "42s",
];

const PosterWallBackground = () => {
  const [posters, setPosters] = useState(
    () => getCachedArchivePosters() || []
  );
  const [brokenUrls, setBrokenUrls] = useState({});

  useEffect(() => {
    let isMounted = true;
    fetchArchiveContestPosters().then((list) => {
      if (isMounted && Array.isArray(list) && list.length > 0) {
        setPosters(list);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const validPosters = useMemo(
    () => posters.filter((p) => p?.url && !brokenUrls[p.url]),
    [posters, brokenUrls]
  );

  // 컬럼별로 포스터 순서를 분산하여 무한 루프용 배열 생성
  const columns = useMemo(() => {
    if (validPosters.length === 0) return [];
    return Array.from({ length: COLUMN_COUNT }, (_, colIdx) => {
      const baseItems = [];
      for (let rowIdx = 0; rowIdx < ITEMS_PER_COLUMN; rowIdx += 1) {
        const posterIdx =
          (colIdx * 3 + rowIdx * 2) % validPosters.length;
        const item = validPosters[posterIdx];
        baseItems.push({
          id: `${item.id || "poster"}-c${colIdx}-r${rowIdx}`,
          url: item.url,
          title: item.title,
        });
      }
      // 끊김 없는 무한 마키(-50% 루프)를 위해 동일 배열을 2회 연결
      return [...baseItems, ...baseItems];
    });
  }, [validPosters]);

  if (columns.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#E6E9F2]"
    >
      {/* 모서리 빈틈이 생기지 않도록 넉넉한 오버캔버스 + 교차 무빙 포스터 월 */}
      <div
        className="absolute -rotate-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3.5 sm:gap-4"
        style={{
          top: "-30vh",
          bottom: "-30vh",
          left: "-20vw",
          right: "-20vw",
        }}
      >
        {columns.map((colItems, colIdx) => {
          const isReverse = colIdx % 2 === 1;
          const visibilityClass =
            colIdx >= 6
              ? "hidden lg:flex"
              : colIdx >= 5
              ? "hidden md:flex"
              : colIdx >= 3
              ? "hidden sm:flex"
              : "flex";

          return (
            <div
              key={`poster-col-${colIdx}`}
              className={`${visibilityClass} flex-col gap-3.5 sm:gap-4 ${
                isReverse ? "poster-marquee-down" : "poster-marquee-up"
              }`}
              style={{
                "--marquee-duration":
                  COLUMN_DURATIONS[colIdx % COLUMN_DURATIONS.length],
              }}
            >
              {colItems.map((tile, itemIdx) => (
                <div
                  key={`${tile.id}-${itemIdx}`}
                  className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-white border border-white/90 shadow-[0_8px_24px_rgba(15,23,42,0.12)] shrink-0"
                >
                  <img
                    src={tile.url}
                    alt=""
                    loading="lazy"
                    onError={() =>
                      setBrokenUrls((prev) => ({ ...prev, [tile.url]: true }))
                    }
                    className="w-full h-full object-cover opacity-[0.62] sm:opacity-[0.68] saturate-[1.08] contrast-[1.03]"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 좌우 날개 영역의 포스터 선명도는 유지하면서 은은한 공간감을 주는 베일 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F5FA]/15 via-[#F4F5FA]/25 to-[#F4F5FA]/40" />
    </div>
  );
};

export default React.memo(PosterWallBackground);
