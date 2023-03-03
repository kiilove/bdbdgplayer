import { doc, setDoc } from "firebase/firestore";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { PlayerEditContext } from "../context/PlayerContext";
import { db } from "../firebase";

const EditEmail = () => {
  const { userInfo } = useContext(AuthContext);
  const { pInfo, editDispatch } = useContext(PlayerEditContext);

  const [pEmail, setPEmail] = useState("");
  const [emailValidate, setEmailValidate] = useState(false);
  const pEmailRef = useRef();

  const updatePlayer = async (data) => {
    await setDoc(doc(db, "player", userInfo.id), { ...data }, { merge: true })
      .then(() => {
        if (pEmail !== ("" || undefined || null)) {
          editDispatch({ type: "EDIT", payload: data });
        }
      })
      .then(() => setEmailValidate(false))
      .then(() => {
        console.log("업데이트 완료");
      });
  };

  const pEmailValidation = () => {
    const email = pEmailRef.current.value;
    const regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const regexResult = regex.test(email);

    if (regexResult) {
      setPEmail((prev) => (prev = email));
      setEmailValidate(true);
    }

    // setPEmail((prev) => (prev = email));
  };
  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-white flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full h-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <div className="flex w-full h-10 bg-white border-b border-gray-500">
              <input
                type="text"
                name="pEmail"
                id="pEmail"
                // value={pEmail}
                onBlur={() => pEmailValidation()}
                ref={pEmailRef}
                placeholder={pInfo.pEmail || "이메일 주소를 입력해주세요"}
                className=" bg-transparent focus:ring-0 outline-none w-full p-3"
              />
            </div>
            <div className="flex w-full py-2">
              <ui className="text-xs text-gray-500">
                <li className="h-6">
                  <span className="text-sm">
                    이메일 주소 변경시 로그인을 다시 해야합니다.
                  </span>
                </li>
                <li className="h-6">
                  <span className="text-sm">
                    이메일 변경 도중 창을 닫으면 로그인이 안될 수 있습니다.
                  </span>
                </li>
                <li className="h-6">
                  <span className="text-sm">
                    문제가 발생했다면 sos@bdbdg.kr로 연락 주세요.
                  </span>
                </li>
              </ui>
            </div>
            <div className="flex w-full py-2 px-2 mt-5">
              <button
                className={`w-full h-9 text-white font-semibold ${
                  emailValidate ? "bg-orange-500" : "bg-gray-400"
                }`}
                onClick={() => updatePlayer({ ...pInfo, pEmail })}
                disabled={!emailValidate}
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

export default EditEmail;
