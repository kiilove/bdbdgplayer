import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createUserWithEmailAndPassword,
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

const RegisterWithEmail = () => {
  const [playerInfo, setPlayerInfo] = useState({});
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
  const [isValidates, setIsValidates] = useState(false);
  const [inputsValidate, setInputsValidate] = useState(false);
  const [pwdValidate, setPwdValidate] = useState(false);
  const [genderValidate, setGenderValidate] = useState(false);
  const [licenseValidate, setLicenseValidate] = useState(false);

  const pNameRef = useRef();
  const pEmailRef = useRef();
  const pwdRef = useRef();
  const rePwdRef = useRef();

  const navigate = useNavigate();

  const handleInputs = () => {
    setInputs((prev) => ({
      ...prev,
      pName: pNameRef.current.value,
      pEmail: pEmailRef.current.value,
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

  const addAuth = async () => {
    const auth = getAuth();
    console.log(pEmailRef.current.value, pwdRef.current.value);
    await createUserWithEmailAndPassword(
      auth,
      pEmailRef.current.value,
      pwdRef.current.value
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
      await addDoc(collection(db, "player"), { ...playerInfo, playerUid: uid });
    } catch (error) {
      console.log(error.message);
    } finally {
    }
  };
  // ???????????? ????????? ???????????????
  const validateInputs = () => {
    const inputsChk = Object.values(inputs).some(
      (item) => item === undefined || item === ""
    );
    setInputsValidate(inputsChk);
    return !inputsChk;
  };

  const validatePwd = () => {
    const pwdChk =
      rePwdRef.current !== undefined
        ? pwdRef.current.value === rePwdRef.current.value
          ? true
          : false
        : false;

    setPwdValidate(pwdChk);
    return pwdChk;
  };

  const validateGender = () => {
    const genderChk = gender ? true : false;
    setGenderValidate(genderChk);
    return genderChk;
  };

  useMemo(() => {
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
            <p className="text-gray-800">????????? ????????? ????????????.</p>
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pName"
              ref={pNameRef}
              onChange={() => handleInputs()}
              placeholder="??????(????????? ?????????????????????)"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="text"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pEmail"
              ref={pEmailRef}
              onChange={() => handleInputs()}
              placeholder="?????????"
            />
          </div>
          <div className="flex justify-center">
            <input
              type="password"
              className="w-full h-12 rounded-md focus:ring-0 focus:outline-orange-400 border border-gray-300 px-5 font-light"
              name="pPWD"
              ref={pwdRef}
              onChange={() => validatePwd()}
              placeholder="????????????"
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
              ref={rePwdRef}
              onChange={() => validatePwd()}
              placeholder="??????????????????"
            />
          </div>
          {!pwdValidate && (
            <div className="flex justify-start">
              <span className="text-xs ml-2 bg-yellow-200 p-2">
                ??????????????? ???????????? ????????????.
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
                ??????
              </option>
              <option value="m" selected={playerInfo.pGender === "m"}>
                ??????
              </option>
              <option value="f" selected={playerInfo.pGender === "f"}>
                ??????
              </option>
            </select>
          </div>
        </div>
        <div
          className="flex justify-center mt-10 flex-col gap-y-5 px-4 w-full"
          style={{ maxWidth: "400px" }}
        >
          <span>????????????</span>
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
                ????????????
              </label>
              <span className="text-gray-500 text-xs font-light ml-5">
                ???????????? ?????? ??? ?????????/????????? ?????? ??????(??????)??? ??????
                ???????????????.
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
                <span className="text-gray-500 mr-1">[??????]</span>????????????
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
                <span className="text-gray-500 mr-1">[??????]</span>
                ???????????? ?????? ??? ?????? ??????
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
                <span className="text-gray-500 mr-1">[??????]</span>??????
                ?????????/????????? ????????????
              </label>
              <button>
                <span className="font-bold">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
          {isValidates ? (
            <button
              className="w-full h-12 bg-orange-400 rounded-md border-gray-300 border mt-5"
              onClick={() => addAuth()}
            >
              <span className=" text-base font-medium text-white">
                ????????????
              </span>
            </button>
          ) : (
            <button className="w-full h-12 bg-gray-400 rounded-md border-gray-300 border mt-5 disabled">
              <span className=" text-base font-medium text-white">
                ????????????
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterWithEmail;
