import React from "react";
import BottomMenu from "./BottomMenu";
import Header from "./Header";

const Policy3 = () => {
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title="개인정보수집및 이용동의" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white">
          <div className="flex justify-center items-center w-full">
            <h1 className="font-semibold">
              개인정보 수집 이용 동의 및 초상권 사용동의서
            </h1>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h2 className="text-base">1. 개인정보 수집 이용에 대한 동의</h2>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-sm">(1) 수집하는 개인정보 항목</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">
              소속, 성명(국문), 생년월일, 연락처, 이메일, 주소
            </h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-sm">(2) 개인정보 수집 및 이용목적</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">
              제공하신 정보는 (제6회 용인특례시 보디빌딩협회장배 Mr&Ms 보디빌딩
              및 피트니스 대회) 참가신청을 위해서 사용합니다.
            </h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">
              단, 이용자의 기본적 인권 침해의 우려가 있는 민감함 개인정보(인종
              및 민족, 사상 및 신조, 정치적 성향 및 범죄기록등)은 수집하지
              않습니다.
            </h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-sm">(3) 개인정보 보유및 이용기간</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">
              수집된 개인정보의 보유기간은 개인정보 제출후 5년 또는 개인정보
              삭제 신청시까지 입니다. 또한 삭제 요청시 본 협회는 개인의 정보를
              재생이 불가능한 방법으로 즉시 파기합니다.
            </h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h2 className="text-base">2. 초상권 사용 동의</h2>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-sm">(1) 사용항목</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">대회출전 사진 및 영상</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-sm">(2) 사용목적</h3>
          </div>
          <div className="flex justify-start items-center w-full px-2">
            <h3 className="text-xs ml-5">
              카렌다 제작 및 VOD영상중계 및 각종매체, 젠바디 홍보용(상업적사용)
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Policy3;
