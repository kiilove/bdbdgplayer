import React from "react";
import StatusResultCard from "../components/common/StatusResultCard";

const EditSuccessPage = () => {
  return (
    <StatusResultCard
      badgeText="접수 수정 완료"
      title={"수정이 정상적으로\n접수되었습니다!"}
      noticeTitle="참가비 변동 및 유의사항"
      noticeBody="종목 추가 또는 변경 시 참가비 차액이나 입금 계좌 정보에 변동이 생길 수 있으니 최종 정보를 확인해 주시기 바랍니다."
      primaryButtonText="홈으로 돌아가기"
      primaryButtonTo="/"
      secondaryButtonText="내 신청내역 확인"
      secondaryButtonTo="/myprofile"
    />
  );
};

export default EditSuccessPage;
