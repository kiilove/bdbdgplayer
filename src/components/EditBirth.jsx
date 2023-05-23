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

const EditBirth = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);
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
      doc(db, "players_pool", userInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pBirth !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setIsLoading(false))
      .then(() => setBirthValidate(false))
      .then(() => {
        console.log("업데이트 완료");
      });
  };

  const handleAge = (birth, today) => {
    const birthDate = dayjs(birth).format("YYYY-MM-DD");
    const todayDate = dayjs(today).format("YYYY-MM-DD");
    console.log(todayDate);

    console.log(dayjs(birthDate).year());
    console.log(dayjs(todayDate).year());
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
    //console.log(ageResult);
    setPAge(ageResult);
    console.log(pBirth);
  }, [pBirth]);

  useMemo(() => console.log(dayjs(pBirth).get("date")), []);
  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div
        className={`absolute top-0 left-1/2 w-full h-screen border-0 px-10 py-3 outline-none flex flex-col z-50 justify-center items-center ${
          !isLoading && "hidden"
        }`}
        style={{
          backgroundColor: "rgba(123, 124, 129, 0.4)",
          maxWidth: "420px",
          transform: "translate(-50%, 0%)",
        }}
      >
        <RotatingLines
          strokeColor="white"
          strokeWidth="5"
          animationDuration="0.75"
          width="96"
          visible={true}
        />
      </div>
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full h-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <div className="flex w-full h-10 bg-white gap-x-4">
              <div className="flex w-32 h-10 bg-white border-b border-gray-500">
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
                  placeholder={dayjs(pInfo.pBirth).year() || "생년(4자리)"}
                  className=" bg-transparent focus:ring-0 outline-none w-full p-3"
                />
              </div>
              <div className="flex w-20 h-10 bg-white border-b border-gray-500">
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
                  className=" bg-transparent focus:ring-0 outline-none w-full p-3"
                />
              </div>
              <div className="flex w-20 h-10 bg-white border-b border-gray-500">
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
                  className=" bg-transparent focus:ring-0 outline-none w-full p-3"
                />
              </div>
              <div className="flex w-20 h-10 justify-end items-center bg-white border-b border-gray-500">
                <span className="text-sm mr-2">
                  {pAge && pAge > 0 ? pAge : ""}
                </span>
              </div>
            </div>
            <div className="flex w-full py-2">
              <ui className="text-xs text-gray-500">
                <li className="h-6">
                  <span className="text-sm">
                    연도는 4자리 형식으로 입력해주세요
                  </span>
                </li>
              </ui>
            </div>
            <div className="flex w-full py-2 px-2 mt-5">
              <button
                className={`w-full h-9 text-white font-semibold ${
                  birthValidate ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pBirth })}
              >
                저 장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBirth;
