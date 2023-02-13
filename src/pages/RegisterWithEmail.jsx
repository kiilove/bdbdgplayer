import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

const RegisterWithEmail = () => {
  const [playerInfo, setPlayerInfo] = useState({});
  const [playerInfoValidate, setPlayerInfoValidate] = useState({});
  const [validateChk, setValidateChk] = useState(false);
  const [pwdRetype, setPwdRetype] = useState();
  const [licenseAll, setLicenseAll] = useState(false);
  const [license, setLicense] = useState({
    m1Apply: false,
    m2Apply: false,
    s1Apply: false,
    allApply: false,
  });
  const [pwdValidate, setPwdValidate] = useState(true);
  const pwd = useRef();
  const pwd2 = useRef();

  const handleInputs = (e) => {
    if (e.target.name !== "pwdVal") {
      setPlayerInfo((prev) => ({
        ...prev,
        [e.target.name]: e.target.value.trim(),
      }));
    }
    validateInputs();
  };
  // 회원가입 빨간줄 처리해야함
  const validateInputs = () => {
    setPlayerInfoValidate((prev) => ({
      pName: playerInfo.pName !== undefined,
      pEmail: playerInfo.pEmail !== undefined,
      pPwd: playerInfo.pPwd !== undefined,
      pwd2: validatePwd(),
      pGender: playerInfo.pGender !== undefined,
      m1Apply: license.m1Apply,
      m2Apply: license.m2Apply,
    }));
  };
  const validatePwd = () => {
    const valResult =
      pwd.current.value.trim() === pwd2.current.value.trim() ? true : false;

    return valResult;
  };

  useEffect(() => {
    !licenseAll
      ? setLicense({
          allApply: false,
          m1Apply: false,
          m2Apply: false,
          s1Apply: false,
        })
      : setLicense({
          allApply: true,
          m1Apply: true,
          m2Apply: true,
          s1Apply: true,
        });

    return () => {
      setLicense(() => ({ ...license }));
    };
  }, [licenseAll]);

  useEffect(() => {
    console.log(playerInfoValidate);
  }, [playerInfoValidate]);

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
              name="pName"
              value={playerInfo.pName}
              onChange={(e) => {
                e.preventDefault();
                handleInputs(e);
              }}
              placeholder="실명(별명은 마이페이지에서)"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pEmail"
              value={playerInfo.pEmail}
              onChange={(e) => {
                e.preventDefault();
                handleInputs(e);
              }}
              placeholder="이메일"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pPWD"
              value={playerInfo.pPWD}
              onClick={(e) => {
                e.preventDefault();
                setPwdValidate(validatePwd());
              }}
              onChange={(e) => {
                e.preventDefault();
                handleInputs(e);
                setPwdValidate(validatePwd());
              }}
              ref={pwd}
              placeholder="비밀번호"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className={
                pwdValidate
                  ? "w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
                  : "w-full h-12 rounded-md focus:ring-0 focus:outline-red-600 border-red-600 border-2 px-5 font-light"
              }
              name="pwdVal"
              value={pwdRetype}
              onClick={(e) => {
                e.preventDefault();
                setPwdValidate(validatePwd());
              }}
              onChange={(e) => {
                e.preventDefault();
                setPwdRetype(() => e.target.value);
                setPwdValidate(validatePwd());
              }}
              ref={pwd2}
              placeholder="비밀번호확인"
            />
          </div>
          {!pwdValidate && (
            <div className="flex justify-start">
              <span className="text-xs ml-2 bg-yellow-200 p-2">
                비밀번호가 일치하지 않습니다.
              </span>
            </div>
          )}

          <div className="flex justify-start">
            <select
              className="w-24 h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light bg-white"
              name="pGender"
              onChange={(e) => {
                e.preventDefault();
                handleInputs(e);
              }}
            >
              <option disabled selected>
                성별
              </option>
              <option value="m" selected={playerInfo.pGender === "m"}>
                남자
              </option>
              <option value="f" selected={playerInfo.pGender === "f"}>
                여자
              </option>
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
                <input
                  type="checkbox"
                  value="allApply"
                  className="mr-2"
                  onClick={() => setLicenseAll(!licenseAll)}
                  checked={
                    license.allApply ||
                    (license.m1Apply && license.m2Apply && license.s1Apply)
                  }
                />
                전체동의
              </label>
              <span className="text-gray-500 text-xs font-light ml-5">
                필수동의 항목 및 콘텐츠/이벤트 정보 수신(선택)에 전체
                동의합니다.
              </span>
            </div>
            <div className="flex w-full justify-between">
              <label className="flex justify-start items-center align-middle">
                <input
                  type="checkbox"
                  value="m1Apply"
                  className="mr-2"
                  checked={license.m1Apply || license.allApply}
                  onClick={() =>
                    setLicense({ ...license, m1Apply: !license.m1Apply })
                  }
                />
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
                <input
                  type="checkbox"
                  value="m2Apply"
                  className="mr-2"
                  checked={license.m2Apply || license.allApply}
                  onClick={() =>
                    setLicense({ ...license, m2Apply: !license.m2Apply })
                  }
                />
                <span className="text-gray-500 mr-1">[필수]</span>
                개인정보 수집 및 이용 동의
              </label>
              <button>
                <span className="font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
            <div className="flex w-full justify-between">
              <label className="flex justify-start items-center align-middle">
                <input
                  type="checkbox"
                  value="s1Apply"
                  className="mr-2"
                  checked={license.s1Apply || license.allApply}
                  onClick={() =>
                    setLicense({ ...license, s1Apply: !license.s1Apply })
                  }
                />
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
