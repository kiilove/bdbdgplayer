import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const RegisterWithEmail = () => {
  return (
    <div className="flex w-full h-screen justify-center items-start align-top bg-slate-100">
      <div className="flex flex-col w-full justify-center items-center">
        <div className="flex w-full flex-col items-center align-top mt-10">
          <span className="text-3xl text-orange-500 font-extrabold align-middle">
            BDBDg
          </span>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-3 px-4 w-full"
          style={{ maxWidth: "400px" }}
        >
          <div className="flex justify-start">
            <p className="text-gray-800">약간의 정보가 필요해요.</p>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              placeholder="이름"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              placeholder="이메일"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              placeholder="비밀번호"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              placeholder="비밀번호확인"
            />
          </div>
          <div className="flex justify-start">
            <select
              className="w-24 h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light bg-white"
              placeholder="비밀번호확인"
            >
              <option disabled selected>
                성별
              </option>
              <option value="m">남자</option>
              <option value="f">여자</option>
            </select>
          </div>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-5 px-4 w-full"
          style={{ maxWidth: "400px" }}
        >
          <span>약관동의</span>
          <div className="flex w-full flex-col gap-y-3">
            <div className="flex flex-col w-full">
              <label className="flex justify-start items-center align-middle text-base">
                <input type="checkbox" value="allApply" className="mr-2" />
                전체동의
              </label>
              <span className="text-gray-500 text-xs font-light ml-5">
                필수동의 항목 및 콘텐츠/이벤트 정보 수신(선택)에 전체
                동의합니다.
              </span>
            </div>
            <div className="flex w-full justify-between">
              <label className="flex justify-start items-center align-middle">
                <input type="checkbox" value="allApply" className="mr-2" />
                <span className="text-gray-500 mr-1">[필수]</span>이용약관
              </label>
              <button>
                <span className="font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
            <div className="flex w-full justify-between">
              <label className="flex justify-start items-center align-middle">
                <input type="checkbox" value="allApply" className="mr-2" />
                <span className="text-gray-500 mr-1">[필수]</span>개인정보 수집
                및 이용 동의
              </label>
              <button>
                <span className="font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
            <div className="flex w-full justify-between">
              <label className="flex justify-start items-center align-middle">
                <input type="checkbox" value="allApply" className="mr-2" />
                <span className="text-gray-500 mr-1">[선택]</span>신규
                콘텐츠/이벤트 알림받기
              </label>
              <button>
                <span className="font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          <button className="w-full h-12 bg-gray-400 rounded-md border-gray-300 border mt-5">
            <span className=" text-base font-medium text-white">회원가입</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithEmail;
