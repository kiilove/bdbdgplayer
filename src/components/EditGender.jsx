import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditGender = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);
  const [isLoading, setIsLoading] = useState(false);

  const [pGender, setPGender] = useState(pInfo.pGender);
  const [genderValidate, setGenderValidate] = useState(false);

  const updatePlayer = async (data) => {
    setIsLoading(true);
    await setDoc(
      doc(db, "players_pool", userInfo.id),
      { ...data },
      { merge: true }
    )
      .then(() => {
        if (pGender !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setIsLoading(false))

      .then(() => {
        console.log("업데이트 완료");
      });
  };

  const pGymReg = (e) => {
    e.preventDefault();
    setGenderValidate(true);

    setPGender((prev) => (prev = e.target.value));
  };

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
            <div className="flex w-full h-10 bg-white border-b border-gray-500 gap-x-2">
              <select
                className="w-full outline-none text-sm"
                onChange={(e) => setPGender((p) => (p = e.target.value))}
              >
                <option value="m" selected={pGender === "m"}>
                  남자
                </option>
                <option value="f" selected={pGender === "f"}>
                  여자
                </option>
              </select>
            </div>

            <div className="flex w-full py-2 px-2 mt-5">
              <button
                className={`w-full h-9 text-white font-semibold  bg-orange-500`}
                onClick={() => updatePlayer({ ...pInfo, pGender })}
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

export default EditGender;
