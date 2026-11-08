import React, { useEffect, useMemo, useState } from "react";
import {
  fetchArchiveContestPosters,
  getCachedArchivePosters,
} from "../../services/contestService";

const TARGET_TILE_COUNT = 28;

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

  // 포스터 개수가 적어도 화면 전체 타일을 빈틈없이 채우도록 반복 배열 생성
  const tiledItems = useMemo(() => {
    if (validPosters.length === 0) return [];
    const result = [];
    for (let i = 0; i < TARGET_TILE_COUNT; i += 1) {
      const item = validPosters[i % validPosters.length];
      result.push({
        key: `${item.id || "poster"}-${i}`,
        url: item.url,
        title: item.title,
      });
    }
    return result;
  }, [validPosters]);

  if (tiledItems.length === 0) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
    >
      {/* 대각선으로 살짝 기울어진 스태거드 포스터 타일 그리드 */}
      <div className="absolute -inset-20 sm:-inset-28 -rotate-6 scale-105 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3.5 sm:gap-5 content-start">
        {tiledItems.map((tile, idx) => (
          <div
            key={tile.key}
            className={`aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200/40 border border-white/60 shadow-sm transition-opacity duration-700 ${
              idx % 2 === 1 ? "translate-y-6 sm:translate-y-10" : ""
            }`}
          >
            <img
              src={tile.url}
              alt=""
              loading="lazy"
              onError={() =>
                setBrokenUrls((prev) => ({ ...prev, [tile.url]: true }))
              }
              className="w-full h-full object-cover opacity-[0.14] sm:opacity-[0.15] grayscale-[20%] saturate-[0.8] contrast-[0.95]"
            />
          </div>
        ))}
      </div>

      {/* 포스터가 튀지 않고 은은한 배경 질감으로만 느껴지도록 감싸는 라이트 베일 & 무대 조명 오로라 글로우 */}
      <div className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full bg-violet-500/12 blur-[110px]" />
      <div className="absolute top-12 -right-24 w-[420px] h-[420px] rounded-full bg-rose-500/10 blur-[110px]" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[360px] rounded-full bg-indigo-500/8 blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,245,250,0.42)_0%,rgba(244,245,250,0.82)_65%,rgba(244,245,250,0.94)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#F4F5FA]/25 via-[#F4F5FA]/70 to-[#F4F5FA]/92" />
    </div>
  );
};

export default React.memo(PosterWallBackground);
