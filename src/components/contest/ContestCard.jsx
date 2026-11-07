import React from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  MdOutlineCalendarToday,
  MdOutlineLocationOn,
  MdCreditCard,
  MdFileDownload,
  MdArrowForward,
  MdStar,
} from "react-icons/md";

import { DEFAULT_POSTER } from "../../consts";

const ContestCard = ({
  contest,
  userInvoiceId,
  isLoggedIn,
  onRequireLogin,
  variant = "horizontal",
  posterBadgeText,
}) => {
  const navigate = useNavigate();
  const posterUrl = contest.contestPoster || DEFAULT_POSTER;
  const contestId = contest.id;
  const associateLabel =
    contest.contestAssociate || contest.contestPromoter || "주관 협회";

  const handleJoinClick = () => {
    if (userInvoiceId) {
      navigate(`/contestjoinedit/${userInvoiceId}`);
    } else if (isLoggedIn) {
      navigate(`/contestjoin/${contestId}`);
    } else if (onRequireLogin) {
      onRequireLogin();
    }
  };

  if (variant === "grid") {
    return (
      <div className="bg-[#141414] border border-neutral-800 hover:border-neutral-600 rounded-3xl overflow-hidden shadow-2xl transition flex flex-col justify-between group">
        {/* Poster Section */}
        <div className="w-full bg-[#0a0a0a] overflow-hidden relative border-b border-neutral-800 flex items-center justify-center">
          <img
            src={posterUrl}
            alt={contest.contestTitle}
            className="w-full h-auto block object-contain group-hover:scale-[1.01] transition duration-500"
          />
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-neutral-700 text-white text-[11px] font-black tracking-wider px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-md z-10">
            <MdStar className="text-white text-sm" />
            <span>{posterBadgeText || contest.contestStatus || "접수중"}</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col gap-y-5 flex-grow justify-between">
          <div className="flex flex-col gap-y-2.5">
            <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block w-fit">
              {associateLabel}
            </span>
            <h3 className="text-xl font-black text-white leading-snug line-clamp-2 break-keep">
              {contest.contestTitle}
            </h3>
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-y-2 mt-2 text-xs text-neutral-300">
              <p className="flex items-center gap-2">
                <MdOutlineCalendarToday className="text-white text-sm flex-shrink-0" />
                <strong className="font-semibold text-white">대회 일자:</strong>{" "}
                {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
              </p>
              {contest.contestLocation && (
                <p className="flex items-center gap-2">
                  <MdOutlineLocationOn className="text-white text-sm flex-shrink-0" />
                  <strong className="font-semibold text-white">개최 장소:</strong>{" "}
                  <span className="break-keep">{contest.contestLocation}</span>
                </p>
              )}
              {contest.contestAccountOwner && contest.contestAccountNumber && (
                <p className="flex items-center gap-2">
                  <MdCreditCard className="text-white text-sm flex-shrink-0" />
                  <strong className="font-semibold text-white">참가비 계좌:</strong>{" "}
                  <span className="text-neutral-200">
                    {contest.contestBankName || ""}{" "}
                    {contest.contestAccountNumber} ({contest.contestAccountOwner}
                    )
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleJoinClick}
              className={`flex-1 w-full font-black text-xs py-3.5 px-4 rounded-full transition cursor-pointer text-center flex items-center justify-center gap-1.5 active:scale-98 ${
                userInvoiceId
                  ? "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                  : "bg-white hover:bg-neutral-200 text-black shadow-lg"
              }`}
            >
              <span>
                {userInvoiceId ? "신청정보 확인 및 변경" : "참가신청 하기"}
              </span>
              <MdArrowForward className="text-base" />
            </button>

            {contest.contestCollectionFileLink && (
              <a
                href={contest.contestCollectionFileLink}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs py-3.5 px-4 rounded-full border border-neutral-700 transition cursor-pointer text-center whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-98"
              >
                <MdFileDownload className="text-base text-white" />
                <span>요강 다운로드</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: Horizontal 12-col layout (Home & Gbbf)
  return (
    <div className="bg-[#141414] border border-neutral-800 hover:border-neutral-600 rounded-3xl p-6 md:p-8 shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
      {/* Poster Left */}
      <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[500px] bg-neutral-950 border border-neutral-800 shadow-md flex items-center justify-center">
        <img
          src={posterUrl}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-110 pointer-events-none"
        />
        <img
          src={posterUrl}
          alt={contest.contestTitle}
          className="relative z-10 w-full h-full object-contain group-hover:scale-[1.02] transition duration-500"
        />
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-neutral-700 text-white text-[11px] font-black tracking-wider px-3.5 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-md z-20">
          <MdStar className="text-white text-sm" />
          <span>
            {posterBadgeText || contest.contestStatus || "OFFICIAL ENTRY"}
          </span>
        </div>
      </div>

      {/* Details Right */}
      <div className="lg:col-span-7 flex flex-col gap-y-6">
        <div>
          <span className="text-[11px] font-black tracking-widest text-neutral-400 uppercase bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full inline-block">
            {associateLabel}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-3 leading-snug break-keep">
            {contest.contestTitle}
          </h2>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-y-3.5 text-sm">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
            <span className="text-neutral-400 font-medium flex items-center gap-2">
              <MdOutlineCalendarToday className="text-white text-base" />
              대회 일자
            </span>
            <span className="font-bold text-white tracking-wide">
              {dayjs(contest.contestDate).format("YYYY년 MM월 DD일")}
            </span>
          </div>

          {contest.contestLocation && (
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2.5">
              <span className="text-neutral-400 font-medium flex items-center gap-2">
                <MdOutlineLocationOn className="text-white text-base" />
                개최 장소
              </span>
              <span className="font-bold text-white break-keep text-right">
                {contest.contestLocation}
              </span>
            </div>
          )}

          {contest.contestAccountOwner && contest.contestAccountNumber && (
            <div className="flex justify-between items-center">
              <span className="text-neutral-400 font-medium flex items-center gap-2">
                <MdCreditCard className="text-white text-base" />
                참가비 계좌
              </span>
              <span className="font-bold text-neutral-200 text-right text-xs sm:text-sm">
                {contest.contestBankName || ""} {contest.contestAccountNumber} (
                {contest.contestAccountOwner})
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleJoinClick}
            className={`flex-1 py-4 px-6 font-black text-sm tracking-wider uppercase rounded-full transition cursor-pointer text-center flex items-center justify-center gap-2 active:scale-98 ${
              userInvoiceId
                ? "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                : "bg-white hover:bg-neutral-200 text-black shadow-lg"
            }`}
          >
            <span>
              {userInvoiceId ? "신청정보 확인 및 변경" : "참가신청 하기"}
            </span>
            <MdArrowForward className={userInvoiceId ? "text-base" : "text-lg"} />
          </button>

          {contest.contestCollectionFileLink && (
            <a
              href={contest.contestCollectionFileLink}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-bold text-xs sm:text-sm rounded-full transition text-center whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MdFileDownload className="text-base text-white" />
              <span>공식 요강 다운로드</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestCard;

