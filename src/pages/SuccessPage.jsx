import React from "react";
import StatusResultCard from "../components/common/StatusResultCard";

const SuccessPage = () => {
  return (
    <StatusResultCard
      badgeText="대회 참가신청 완료"
      title={"정상적으로 접수가\n완료되었습니다!"}
      noticeTitle="감사의 말씀 및 안내"
      noticeBody="대회에 참여해 주셔서 대단히 감사드립니다. 지정된 계좌로 입금을 진행해 주시면 최종 승인 처리가 완료됩니다."
      primaryButtonText="홈으로 돌아가기"
      primaryButtonTo="/"
      secondaryButtonText="내 참가신청 내역 확인"
      secondaryButtonTo="/myprofile"
    />
  );
};

export default SuccessPage;
