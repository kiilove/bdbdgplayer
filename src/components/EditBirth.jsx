import dayjs from "dayjs";
import { doc, setDoc } from "firebase/firestore";
import React, { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";
import { UserContext } from "../context/UserContext";

const EditBirth = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pAge, setPAge] = useState(0);
  const [pBirth, setPBirth] = useState(pInfo.pBirth || "");
  const [birthValidate, setBirthValidate] = useState(false);
  const pBirthYearRef = useRef();
  const pBirthMonthRef = useRef();
  const pBirthDayRef = useRef();

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pBirth !== ("" || undefined || null)) {
          setCurrentUserInfo({ ...data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setBirthValidate(false));
  };

  const handleAge = (birth, today) => {
    const birthDate = dayjs(birth).format("YYYY-MM-DD");
    const todayDate = dayjs(today).format("YYYY-MM-DD");

    let age = dayjs(todayDate).year() - dayjs(birthDate).year();
    const month = dayjs(todayDate).month() - dayjs(birthDate).month();

    if (
      month < 0 ||
      (month === 0 && dayjs(todayDate).day() < dayjs(birthDate).day())
    ) {
      age--;
    }
    //console.log(age);
    return age;
  };

  const pBirthReg = () => {
    setBirthValidate(true);
    const bYear = pBirthYearRef.current.value;

    const bMonth =
      pBirthMonthRef.current.value < 10
        ? "0" + Number(pBirthMonthRef.current.value)
        : pBirthMonthRef.current.value;
    const bDay =
      pBirthDayRef.current.value < 10
        ? "0" + Number(pBirthDayRef.current.value)
        : pBirthDayRef.current.value;
    const birth = bYear + bMonth + bDay;
    const regBirth = birth.replace(/[^0-9]/g, ""); // 숫자를 제외한 모든 문자 제거

    setPBirth((prev) => (prev = dayjs(regBirth).format("YYYY-MM-DD")));
  };

  useMemo(() => {
    const ageResult = handleAge(pBirth, new Date());

    setPAge(ageResult);
  }, [pBirth]);

  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-[#0B0B0B] text-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div
        className={`absolute top-0 left-1/2 w-full h-screen border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
          !isLoading && "hidden"
        }`}
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          maxWidth: "420px",
          transform: "translate(-50%, 0%)",
        }}
      >
        <RotatingLines
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          width="64"
          visible={true}
        />
      </div>
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-[#0B0B0B] px-4">
        <div className="flex flex-col w-full h-full mt-6 mb-5">
          <div className="flex w-full h-full flex-col bg-[#141414] border border-neutral-800 rounded-3xl p-6 gap-y-4 shadow-xl">
            <div className="flex w-full gap-x-2">
              <div className="flex-1 bg-[#1A1A1A] border border-neutral-800 rounded-2xl">
                <input
                  type="text"
                  name="pBirthYear"
                  id="pBirthYear"
                  onChange={() => pBirthReg()}
                  onBlur={() => {
                    pBirth === ""
                      ? setBirthValidate(false)
                      : setBirthValidate(true);
                  }}
                  maxLength="4"
                  ref={pBirthYearRef}
                  inputMode="numeric"
                  placeholder={dayjs(pInfo.pBirth).year() || "출생연도 (4자리)"}
                  className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600 text-center"
                />
              </div>
              <div className="w-20 bg-[#1A1A1A] border border-neutral-800 rounded-2xl">
                <input
                  type="text"
                  name="pBirthMonth"
                  id="pBirthMonth"
                  onChange={() => pBirthReg()}
                  onBlur={() => {
                    pBirth === ""
                      ? setBirthValidate(false)
                      : setBirthValidate(true);
                  }}
                  maxLength="2"
                  ref={pBirthMonthRef}
                  inputMode="numeric"
                  placeholder={dayjs(pInfo.pBirth).month() + 1 || "월"}
                  className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600 text-center"
                />
              </div>
              <div className="w-20 bg-[#1A1A1A] border border-neutral-800 rounded-2xl">
                <input
                  type="text"
                  name="pBirthDay"
                  id="pBirthDay"
                  onChange={() => pBirthReg()}
                  onBlur={() => {
                    pBirth === ""
                      ? setBirthValidate(false)
                      : setBirthValidate(true);
                  }}
                  maxLength="2"
                  ref={pBirthDayRef}
                  inputMode="numeric"
                  placeholder={dayjs(pInfo.pBirth).date() || "일"}
                  className="bg-transparent focus:outline-none w-full p-4 text-white text-sm placeholder-neutral-600 text-center"
                />
              </div>
            </div>

            {pAge && pAge > 0 && (
              <div className="flex justify-end items-center pr-2">
                <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-full">
                  현재 만 {pAge}세
                </span>
              </div>
            )}

            <div className="flex w-full py-1">
              <ul className="text-xs text-neutral-400 space-y-1">
                <li>• 연도는 4자리(예: 1995), 월/일은 2자리 숫자로 입력해주세요.</li>
              </ul>
            </div>

            <div className="flex w-full mt-4">
              <button
                className={`w-full py-3.5 rounded-full font-black text-sm transition tracking-tight ${
                  birthValidate
                    ? "bg-white hover:bg-neutral-200 text-black cursor-pointer shadow-lg"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pBirth })}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBirth;
