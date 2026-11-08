import React, { useEffect, useMemo, useState } from "react";
import {
  fetchArchiveContestPosters,
  getCachedArchivePosters,
} from "../../services/contestService";

const COLUMN_COUNT = 6;
const ITEMS_PER_COLUMN = 6;
const COLUMN_DURATIONS = ["42s", "50s", "46s", "54s", "40s", "48s"];

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

  // 컬럼별로 교차 스크롤되는 무한 루프용 포스터 배열 생성
  const columns = useMemo(() => {
    if (validPosters.length === 0) return [];
    return Array.from({ length: COLUMN_COUNT }, (_, colIdx) => {
      const baseItems = [];
      for (let rowIdx = 0; rowIdx < ITEMS_PER_COLUMN; rowIdx += 1) {
        const posterIdx =
          (colIdx * ITEMS_PER_COLUMN + rowIdx) % validPosters.length;
        const item = validPosters[posterIdx];
        baseItems.push({
          id: `${item.id || "poster"}-c${colIdx}-r${rowIdx}`,
          url: item.url,
          title: item.title,
        });
      }
      // 끊김 없는 무한 마키(-50% 루프)를 위해 동일 배열을 2회 이어붙임
      return [...baseItems, ...baseItems];
    });
  }, [validPosters]);

  if (columns.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* 대각선 각도로 교차 이동하는 키네틱 포스터 월 */}
      <div className="absolute -inset-24 sm:-inset-32 -rotate-6 scale-105 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3.5 sm:gap-5">
        {columns.map((colItems, colIdx) => {
          const isReverse = colIdx % 2 === 1;
          const visibilityClass =
            colIdx >= 5
              ? "hidden lg:flex"
              : colIdx >= 4
              ? "hidden md:flex"
              : colIdx >= 3
              ? "hidden sm:flex"
              : "flex";

          return (
            <div
              key={`poster-col-${colIdx}`}
              className={`${visibilityClass} flex-col gap-3.5 sm:gap-5 ${
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
                  className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-white/60 border border-white/80 shadow-[0_10px_28px_rgba(15,23,42,0.10)] shrink-0"
                >
                  <img
                    src={tile.url}
                    alt=""
                    loading="lazy"
                    onError={() =>
                      setBrokenUrls((prev) => ({ ...prev, [tile.url]: true }))
                    }
                    className="w-full h-full object-cover opacity-[0.46] sm:opacity-[0.50] saturate-[1.08] contrast-[1.03]"
                  />
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* 포스터의 선명함과 색감은 살리면서 전경 UI 가독성을 지켜주는 무대 조명 & 투명 베일 */}
      <div className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-violet-500/14 blur-[110px]" />
      <div className="absolute top-12 -right-24 w-[420px] h-[420px] rounded-full bg-rose-500/12 blur-[110px]" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(244,245,250,0.28)_0%,rgba(244,245,250,0.52)_70%,rgba(244,245,250,0.72)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F5FA]/15 via-[#F4F5FA]/42 to-[#F4F5FA]/68" />
    </div>
  );
};

export default React.memo(PosterWallBackground);
