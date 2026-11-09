import React, { useEffect, useMemo, useState } from "react";
import {
  fetchArchiveContestPosters,
  getCachedArchivePosters,
} from "../../services/contestService";

const COLUMN_COUNT = 7;
const ITEMS_PER_COLUMN = 7;
const COLUMN_DURATIONS = [
  "52s",
  "64s",
  "48s",
  "58s",
  "54s",
  "62s",
  "50s",
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
      return [...baseItems, ...baseItems];
    });
  }, [validPosters]);

  if (columns.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#F6F7F9]"
    >
      {/* 중앙 본문 영역(max-w-5xl)은 완벽하게 비워두고 좌우 외곽 날개에서만 은은하게 흐르는 에디토리얼 마스크 */}
      <div
        className="absolute inset-0"
        style={{
          WebkitMaskImage:
            "radial-gradient(ellipse 54% 92% at 50% 50%, transparent 52%, rgba(0,0,0,0.45) 76%, rgba(0,0,0,1) 100%)",
          maskImage:
            "radial-gradient(ellipse 54% 92% at 50% 50%, transparent 52%, rgba(0,0,0,0.45) 76%, rgba(0,0,0,1) 100%)",
        }}
      >
        <div
          className="absolute -rotate-6 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4"
          style={{
            top: "-30vh",
            bottom: "-30vh",
            left: "-18vw",
            right: "-18vw",
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
                className={`${visibilityClass} flex-col gap-4 ${
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
                    className="aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-200/50 border border-black/[0.04] shrink-0"
                  >
                    <img
                      src={tile.url}
                      alt=""
                      loading="lazy"
                      onError={() =>
                        setBrokenUrls((prev) => ({ ...prev, [tile.url]: true }))
                      }
                      className="w-full h-full object-cover opacity-[0.22] sm:opacity-[0.25] grayscale-[25%] contrast-[0.98]"
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(PosterWallBackground);
