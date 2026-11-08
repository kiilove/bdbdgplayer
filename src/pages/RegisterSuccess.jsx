import React from "react";
import StatusResultCard from "../components/common/StatusResultCard";

const RegisterSuccess = () => {
  return (
    <StatusResultCard
      badgeText="회원가입 완료"
      title="회원가입이 완료되었습니다"
      noticeTitle="선수 상세 프로필 설정 안내"
      noticeBody="방금 가입하신 계정으로 자동 로그인되었습니다. 마이페이지에서 생년월일과 소속 체육관 등 기본 정보를 미리 등록해 두시면 모든 대회를 더욱 빠르게 신청하실 수 있습니다."
      primaryButtonText="내 프로필 설정하러 가기"
      primaryButtonTo="/myprofile"
      secondaryButtonText="대회 일정 보러 가기"
      secondaryButtonTo="/"
    />
  );
};

export default RegisterSuccess;
