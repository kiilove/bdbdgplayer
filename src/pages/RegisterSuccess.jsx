import React from "react";
import StatusResultCard from "../components/common/StatusResultCard";

const RegisterSuccess = () => {
  return (
    <StatusResultCard
      badgeText="회원가입 완료"
      title="회원가입이 완료되었습니다"
      noticeTitle="선수 상세 프로필 설정 안내"
      noticeBody="대회 참가신청을 위해선 프로필에 선수 상세 정보가 필요합니다. 방금 가입하신 계정으로 로그인 후 마이페이지에서 기본 정보를 설정하시면 모든 대회를 간편하게 신청하실 수 있습니다."
      primaryButtonText="로그인하러 가기"
      primaryButtonTo="/login"
      secondaryButtonText=""
      secondaryButtonTo=""
    />
  );
};

export default RegisterSuccess;
