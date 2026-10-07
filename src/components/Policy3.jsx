import React from "react";
import { RiShieldCheckLine, RiCloseLine, RiCheckboxCircleLine } from "react-icons/ri";

const Policy3 = ({ onClose }) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-[#141414] rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-800 my-6 max-h-[85vh] flex flex-col text-neutral-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
        <div className="flex items-center gap-x-3">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-black text-xl">
            <RiShieldCheckLine />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">개인정보 수집·이용 및 초상권 사용 동의</h2>
            <p className="text-xs text-neutral-400 font-medium">개인정보 보호법 제15조 및 제22조에 따른 안내</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <RiCloseLine className="text-xl" />
          </button>
        )}
      </div>

      {/* Content Area with scroll */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-y-5 text-xs text-neutral-300 leading-relaxed scrollbar-thin scrollbar-thumb-neutral-800">
        {/* Section 1 */}
        <div className="bg-[#1A1A1A] border border-neutral-800/80 rounded-2xl p-5 flex flex-col gap-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-x-2 border-b border-neutral-800 pb-2.5">
            <RiCheckboxCircleLine className="text-white text-base" />
            1. 개인정보 수집 및 이용 동의 (필수)
          </h3>
          
          <div className="flex flex-col gap-y-2.5">
            <div>
              <span className="font-bold text-neutral-200 block mb-1">(1) 개인정보 수집·이용 목적</span>
              <p className="text-neutral-400 pl-2">
                - 보디빌딩 및 피트니스 대회 참가신청 접수, 본인 식별 및 선수 등록<br />
                - 대회 경기 운영, 대진표 및 계체량 측정 관리, 대회 결과 발표<br />
                - 참가비 결제 확인, 대회 공지사항 전달 및 비상 연락망 구축
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-200 block mb-1">(2) 수집하는 개인정보 항목</span>
              <p className="text-neutral-400 pl-2">
                - 필수항목: 성명, 생년월일, 성별, 연락처(전화번호), 소속(체육관/팀명), 이메일 계정 정보
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-200 block mb-1">(3) 개인정보의 보유 및 이용 기간</span>
              <p className="text-neutral-400 pl-2">
                - 수집된 개인정보는 <strong className="text-white font-bold">대회 종료 후 1년 간</strong> 기록 보관 후 재생 불가능한 기술적 방법으로 즉시 파기합니다.<br />
                - 단, 관계 법령에 의해 보존할 필요가 있는 경우 해당 법정 보존 기간 동안 보관합니다.
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-200 block mb-1">(4) 동의 거부 권리 및 불이익 안내</span>
              <p className="text-neutral-400 pl-2">
                - 귀하는 개인정보 수집·이용 동의를 거부할 권리가 있습니다. 단, 필수 항목 동의 거부 시 대회 참가신청 접수 및 선수 등록이 불가능합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-[#1A1A1A] border border-neutral-800/80 rounded-2xl p-5 flex flex-col gap-y-3">
          <h3 className="text-sm font-black text-white flex items-center gap-x-2 border-b border-neutral-800 pb-2.5">
            <RiCheckboxCircleLine className="text-white text-base" />
            2. 대회 초상권 및 미디어 촬영·활용 동의
          </h3>
          
          <div className="flex flex-col gap-y-2.5">
            <div>
              <span className="font-bold text-neutral-200 block mb-1">(1) 사용 항목</span>
              <p className="text-neutral-400 pl-2">
                - 대회 전 과정(계체, 경기, 시상 등) 중 촬영된 선수의 사진, 경기 중계 영상 및 음성
              </p>
            </div>

            <div>
              <span className="font-bold text-neutral-200 block mb-1">(2) 사용 목적 및 범위</span>
              <p className="text-neutral-400 pl-2">
                - 공식 대회 보도자료, 홍보 영상 제작, 협회 홈페이지 및 SNS 중계 게시<br />
                - 대회 기록 보존, VOD 영상 서비스 및 아카이빙 목적 활용
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Close Button */}
      {onClose && (
        <div className="pt-4 border-t border-neutral-800 mt-4">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full transition active:scale-[0.99] cursor-pointer shadow-lg tracking-tight uppercase"
          >
            확인 및 닫기
          </button>
        </div>
      )}
    </div>
  );
};

export default Policy3;
