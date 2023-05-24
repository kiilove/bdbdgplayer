import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { handleToast } from "../components/HandleToast";
import { db } from "../firebase";
import { ThreeDots } from "react-loader-spinner";

const RegisterWithEmail = () => {
  const [playerInfo, setPlayerInfo] = useState({});
  const [existEmail, setExistEmail] = useState(false);
  const [chkEmail, setChkEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputs, setInputs] = useState({
    pName: undefined,
    pEmail: undefined,
  });
  const [gender, setGender] = useState(undefined);
  const [license, setLicense] = useState({
    m1Apply: { value: false, at: new Date() },
    m2Apply: { value: false, at: new Date() },
    s1Apply: { value: false, at: new Date() },
  });
  const [licenseAll, setLicenseAll] = useState(false);

  const [validates, setValidates] = useState({
    inputs: false,
    pwd: false,
    gender: false,
    license: false,
  });

  const [alertMessage, setAlertMessage] = useState({
    email: { code: "", message: "" },
    pwd: { code: "", message: "" },
  });
  const [isValidates, setIsValidates] = useState(false);
  const [inputsValidate, setInputsValidate] = useState(false);
  const [pwdValidate, setPwdValidate] = useState(false);
  const [genderValidate, setGenderValidate] = useState(false);
  const [licenseValidate, setLicenseValidate] = useState(false);

  const pNameRef = useRef();
  const pEmailRef = useRef();
  const pwdRef = useRef();
  const rePwdRef = useRef();
  const pTelRef = useRef();
  const pGymRef = useRef();

  const navigate = useNavigate();

  const handleInputs = () => {
    setInputs((prev) => ({
      ...prev,
      pName: pNameRef.current.value.trim(),
      pEmail: pEmailRef.current.value.trim(),
      pTel: pTelRef.current.value.trim(),
      //pGym: pGymRef.current.value.trim(),
    }));
  };

  const handleLicenseAll = () => {
    licenseAll
      ? setLicense((prev) => ({
          ...prev,
          m1Apply: { value: false, at: new Date() },
          m2Apply: { value: false, at: new Date() },
          s1Apply: { value: false, at: new Date() },
        }))
      : setLicense((prev) => ({
          ...prev,
          m1Apply: { value: true, at: new Date() },
          m2Apply: { value: true, at: new Date() },
          s1Apply: { value: true, at: new Date() },
        }));
  };

  useMemo(() => {
    const chkLicense = Object.values(license).some(
      (item) => item.value === false
    );
    setLicenseAll(!chkLicense);
  }, [license]);

  const validateLicense = () => {
    const licenseChk =
      license.m1Apply.value === true && license.m2Apply.value === true
        ? true
        : false;

    setLicenseValidate(licenseChk);
    return licenseChk;
  };

  async function checkEmailExists(email) {
    try {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);

      if (signInMethods.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error fetching sign-in methods:", error);
      throw error;
    }
  }

  const handleChkEmail = async () => {
    try {
      const result = await checkEmailExists(pEmailRef.current.value.trim());
      if (result === true) {
        setAlertMessage({
          ...alertMessage,
          email: { code: "exist", message: "이미 사용중인 이메일입니다." },
        });
      } else {
        setAlertMessage({ ...alertMessage, email: { code: "", message: "" } });
        setChkEmail(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addAuth = async () => {
    setIsLoading(true);
    const auth = getAuth();
    //console.log(pEmailRef.current.value, pwdRef.current.value);
    await createUserWithEmailAndPassword(
      auth,
      pEmailRef.current.value.trim(),
      pwdRef.current.value.trim()
    )
      .then((user) => {
        const userInfo = user;

        return userInfo.user.uid;
      })
      .then((uid) => addPlayer(uid))
      .then(() => navigate("/regsuccess"));
  };
  const addPlayer = async (uid) => {
    try {
      console.log(playerInfo);
      await addDoc(collection(db, "players_pool"), {
        ...playerInfo,
        playerUid: uid,
      });
    } catch (error) {
      console.log(error);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  // 회원가입 빨간줄 처리해야함
  const validateInputs = () => {
    const inputsChk = Object.values(inputs).some(
      (item) => item === undefined || item === ""
    );
    setInputsValidate(inputsChk);
    return !inputsChk;
  };

  const validatePwd = () => {
    // const pwdChk =
    //   rePwdRef.current !== undefined
    //     ? pwdRef.current.value === rePwdRef.current.value
    //       ? true
    //       : false
    //     : false;
    if (pwdRef.current.value.length < 6) {
      setPwdValidate(true);
      setAlertMessage({
        ...alertMessage,
        pwd: { code: "short", message: "6자리이상 입력해주세요." },
      });
      return;
    }
    if (pwdRef.current.value !== rePwdRef.current.value) {
      setPwdValidate(true);
      setAlertMessage({
        ...alertMessage,
        pwd: { code: "wrong", message: "비밀번호가 일치하지 않습니다." },
      });
      return;
    }
    if (pwdRef.current.value === rePwdRef.current.value) {
      setPwdValidate(false);
      setAlertMessage({ ...alertMessage, pwd: { code: "", message: "" } });
      return;
    }

    return pwdValidate;
  };

  const validateGender = () => {
    const genderChk = gender ? true : false;
    setGenderValidate(genderChk);
    return genderChk;
  };

  useEffect(() => {
    setValidates((prev) => ({
      ...prev,
      inputs: validateInputs(),
      pwd: validatePwd(),
      gender: validateGender(),
      license: validateLicense(),
    }));
    //console.log(validates);
  }, [inputs, gender, license, pwdValidate]);

  useMemo(() => {
    const validatesChk = Object.values(validates).some(
      (item) => item === false
    );
    !validatesChk && setPlayerInfo(() => ({ ...inputs, gender, license }));
    setIsValidates(!validatesChk);
    console.log(playerInfo);
  }, [validates]);

  useEffect(() => {
    return () => {
      setPwdValidate(false);
    };
  }, []);

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
              ref={pNameRef}
              onChange={() => handleInputs()}
              placeholder="실명(별명은 마이페이지에서)"
            />
          </div>
          <div className="flex justify-center w-full gap-x-2 flex-col">
            <div className="flex justify-center w-full gap-x-2 ">
              <div className="flex w-3/4">
                <input
                  type="text"
                  className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
                  name="pEmail"
                  ref={pEmailRef}
                  onChange={() => handleInputs()}
                  placeholder="이메일"
                />
              </div>
              <div className="flex w-1/4 py-1">
                <button
                  className="bg-orange-500 w-24 rounded-md text-gray-100"
                  onClick={() => handleChkEmail()}
                >
                  중복확인
                </button>
              </div>
            </div>
            {alertMessage.email.code === "exist" && (
              <div className="flex justify-start mt-3">
                <span className="text-xs ml-2 bg-yellow-200 p-2">
                  {alertMessage.email.message}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pTel"
              ref={pTelRef}
              onChange={() => handleInputs()}
              placeholder="연락처"
            />
          </div>

          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pPWD"
              ref={pwdRef}
              onChange={() => validatePwd()}
              placeholder="비밀번호"
            />
          </div>
          {alertMessage.pwd.code === "short" && (
            <div className="flex justify-start">
              <span className="text-xs ml-2 bg-yellow-200 p-2">
                {alertMessage.pwd.message}
              </span>
            </div>
          )}

          <div className="flex justify-center">
            <input
              type="password"
              className={
                !pwdValidate
                  ? "w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
                  : "w-full h-12 rounded-md focus:ring-0 focus:outline-red-600 border-red-600 border-2 px-5 font-light"
              }
              name="pwdVal"
              ref={rePwdRef}
              onChange={() => validatePwd()}
              placeholder="비밀번호확인"
            />
          </div>
          {alertMessage.pwd.code === "wrong" && (
            <div className="flex justify-start">
              <span className="text-xs ml-2 bg-yellow-200 p-2">
                {alertMessage.pwd.message}
              </span>
            </div>
          )}

          <div className="flex justify-start">
            <select
              className="w-24 h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light bg-white"
              name="pGender"
              onChange={(e) => setGender((prev) => (prev = e.target.value))}
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
          {/* <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pGym"
              ref={pGymRef}
              onChange={() => handleInputs()}
              placeholder="소속클럽(체육관)"
            />
          </div> */}
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
                  name="allApply"
                  value="allApply"
                  className="mr-2"
                  onClick={() => setLicenseAll(!licenseAll)}
                  onChange={() => handleLicenseAll()}
                  checked={licenseAll}
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
                  name="m1Apply"
                  value="m1Apply"
                  className="mr-2"
                  checked={license.m1Apply.value}
                  onClick={(e) =>
                    setLicense({
                      ...license,
                      m1Apply: { value: e.target.checked, at: new Date() },
                    })
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
                  name="m2Apply"
                  value="m2Apply"
                  className="mr-2"
                  checked={license.m2Apply.value}
                  onClick={(e) =>
                    setLicense({
                      ...license,
                      m2Apply: { value: e.target.checked, at: new Date() },
                    })
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
                  name="s1Apply"
                  value="s1Apply"
                  className="mr-2"
                  checked={license.s1Apply.value}
                  onClick={(e) =>
                    setLicense({
                      ...license,
                      s1Apply: {
                        value: !license.s1Apply.value,
                        at: new Date(),
                      },
                    })
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
          {isValidates ? (
            isLoading ? (
              <button className="w-full h-12 bg-orange-400 rounded-md border-gray-300 border mt-5">
                <span className="flex w-full h-full text-white text-base justify-center items-center">
                  <ThreeDots
                    height="40"
                    width="40"
                    radius="9"
                    color="#fff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                </span>
              </button>
            ) : (
              <button
                className="w-full h-12 bg-orange-400 rounded-md border-gray-300 border mt-5"
                onClick={() => addAuth()}
              >
                <span className=" text-base font-medium text-white">
                  회원가입
                </span>
              </button>
            )
          ) : (
            <button className="w-full h-12 bg-gray-400 rounded-md border-gray-300 border mt-5 disabled cursor-not-allowed">
              {chkEmail ? (
                <span className=" text-base font-medium text-white">
                  회원가입
                </span>
              ) : (
                <span className=" text-base font-medium text-white">
                  이메일중복확인필요
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWithEmail;
