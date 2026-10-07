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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { handleToast } from "../components/HandleToast";
import { db } from "../firebase";
import { ThreeDots } from "react-loader-spinner";
import dayjs from "dayjs";

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
    m1Apply: {
      value: false,
      at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:sss"),
    },
    m2Apply: {
      value: false,
      at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:sss"),
    },
    s1Apply: {
      value: false,
      at: dayjs(new Date()).format("YYYY-MM-DD HH:mm:sss"),
    },
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

  function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return "";
    const cleaned = String(phoneNumber).replace(/[^0-9]/g, "").slice(0, 11);

    if (cleaned.startsWith("02")) {
      if (cleaned.length <= 2) return cleaned;
      if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
      if (cleaned.length <= 9) return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      if (cleaned.length <= 3) return cleaned;
      if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
      if (cleaned.length <= 10) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    }
  }

  const handleInputs = () => {
    const formattedTel = formatPhoneNumber(pTelRef.current?.value || "");
    if (pTelRef.current && pTelRef.current.value !== formattedTel) {
      pTelRef.current.value = formattedTel;
    }
    setInputs((prev) => ({
      ...prev,
      pName: pNameRef.current.value.trim(),
      pEmail: pEmailRef.current.value.trim(),
      pTel: formattedTel,
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
      // error handled
    }
  };

  const addAuth = async () => {
    setIsLoading(true);
    const auth = getAuth();
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
      await addDoc(collection(db, "players_pool"), {
        ...playerInfo,
        playerUid: uid,
      });
    } catch (error) {
      // error handled
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
  }, [validates]);

  useEffect(() => {
    return () => {
      setPwdValidate(false);
    };
  }, []);

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#0B0B0B] text-white py-12 px-4 font-sans antialiased">
      <div className="flex flex-col w-full max-w-md items-center">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-3">
            <span className="text-3xl font-black text-white tracking-tighter uppercase">
              BDBDG
            </span>
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider uppercase">
            Create Account
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            회원가입
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            선수 등록 및 대회 참가를 위한 계정을 생성합니다.
          </p>
        </div>

        <div className="w-full bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">이름</label>
            <input
              type="text"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="pName"
              ref={pNameRef}
              onChange={() => handleInputs()}
              placeholder="실명 입력"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="block text-xs font-bold text-neutral-400">이메일</label>
            <div className="flex w-full gap-x-2">
              <input
                type="email"
                className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
                name="pEmail"
                ref={pEmailRef}
                onChange={() => handleInputs()}
                placeholder="name@example.com"
              />
              <button
                type="button"
                className="bg-white hover:bg-neutral-200 text-black px-4 rounded-2xl text-xs font-black whitespace-nowrap cursor-pointer transition"
                onClick={() => handleChkEmail()}
              >
                중복확인
              </button>
            </div>
            {alertMessage.email.code === "exist" && (
              <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl mt-1">
                {alertMessage.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">연락처</label>
            <input
              type="text"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="pTel"
              ref={pTelRef}
              onChange={() => handleInputs()}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">비밀번호</label>
            <input
              type="password"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="pPWD"
              ref={pwdRef}
              onChange={() => validatePwd()}
              placeholder="6자리 이상 비밀번호"
            />
            {alertMessage.pwd.code === "short" && (
              <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl mt-1 block">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">비밀번호 확인</label>
            <input
              type="password"
              className={`w-full h-12 rounded-2xl bg-[#1A1A1A] border px-4 text-sm focus:outline-none transition ${
                pwdValidate
                  ? "border-rose-500 text-white"
                  : "border-neutral-800 text-white placeholder-neutral-600 focus:border-white"
              }`}
              name="pwdVal"
              ref={rePwdRef}
              onChange={() => validatePwd()}
              placeholder="비밀번호 다시 입력"
            />
            {alertMessage.pwd.code === "wrong" && (
              <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl mt-1 block">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">성별</label>
            <select
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 px-4 text-white text-sm focus:border-white focus:outline-none cursor-pointer"
              name="pGender"
              onChange={(e) => setGender((prev) => (prev = e.target.value))}
            >
              <option disabled selected>
                성별 선택
              </option>
              <option value="m" selected={playerInfo.pGender === "m"}>
                남자
              </option>
              <option value="f" selected={playerInfo.pGender === "f"}>
                여자
              </option>
            </select>
          </div>

          {/* Terms Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-y-3 mt-2 text-xs">
            <div className="flex flex-col border-b border-neutral-800 pb-3">
              <label className="flex items-center gap-x-2 font-black text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="allApply"
                  value="allApply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  onClick={() => setLicenseAll(!licenseAll)}
                  onChange={() => handleLicenseAll()}
                  checked={licenseAll}
                />
                전체 동의
              </label>
              <span className="text-neutral-500 text-[11px] ml-6 mt-0.5">
                필수동의 항목 및 이벤트 정보 수신에 전체 동의합니다.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="m1Apply"
                  value="m1Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={license.m1Apply.value}
                  onClick={(e) =>
                    setLicense({
                      ...license,
                      m1Apply: { value: e.target.checked, at: new Date() },
                    })
                  }
                />
                <span className="font-bold text-white">[필수]</span> 이용약관 동의
              </label>
              <FontAwesomeIcon icon={faArrowRight} className="text-neutral-600 text-xs" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="m2Apply"
                  value="m2Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={license.m2Apply.value}
                  onClick={(e) =>
                    setLicense({
                      ...license,
                      m2Apply: { value: e.target.checked, at: new Date() },
                    })
                  }
                />
                <span className="font-bold text-white">[필수]</span> 개인정보 수집 및 이용 동의
              </label>
              <FontAwesomeIcon icon={faArrowRight} className="text-neutral-600 text-xs" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="s1Apply"
                  value="s1Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
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
                <span className="font-bold text-neutral-400">[선택]</span> 신규 콘텐츠/이벤트 알림받기
              </label>
              <FontAwesomeIcon icon={faArrowRight} className="text-neutral-600 text-xs" />
            </div>
          </div>

          {/* Action Button */}
          {isValidates ? (
            isLoading ? (
              <button className="w-full py-4 bg-white text-black font-black text-sm rounded-full flex justify-center items-center opacity-90 cursor-not-allowed mt-2">
                <ThreeDots
                  height="20"
                  width="40"
                  radius="9"
                  color="#000"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </button>
            ) : (
              <button
                className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-xl transition cursor-pointer text-center tracking-tight mt-2"
                onClick={() => addAuth()}
              >
                회원가입 완료
              </button>
            )
          ) : (
            <button className="w-full py-4 bg-neutral-900 border border-neutral-800 text-neutral-600 font-bold text-xs rounded-full cursor-not-allowed text-center mt-2">
              {chkEmail ? "필수 항목을 모두 입력해 주세요" : "이메일 중복확인이 필요합니다"}
            </button>
          )}
        </div>

        <div className="flex justify-center items-center mt-8 text-center">
          <p className="text-xs text-neutral-400 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-white font-bold ml-2 underline underline-offset-4 hover:text-neutral-300">
                로그인하기
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithEmail;
