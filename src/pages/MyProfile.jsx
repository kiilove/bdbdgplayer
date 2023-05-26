import React from "react";
import BottomMenu from "../components/BottomMenu";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { DEFAULT_AVATAR } from "../consts";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useMemo } from "react";
import { doc, setDoc } from "firebase/firestore";
import { PlayerEditContext } from "../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCallback } from "react";
import { ColorRing, RotatingLines } from "react-loader-spinner";
import { UserContext } from "../context/UserContext";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const MyProfile = () => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const { userInfo } = useContext(AuthContext);
  const { editDispatch } = useContext(PlayerEditContext);
  const [playerInfo, setPlayerInfo] = useState({ ...pInfo });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadURLs, setDownloadURLs] = useState([
    { link: "", filename: "" },
  ]);
  const navigate = useNavigate();

  const uploadFiles = async (files, path) => {
    let dummy = [];
    setIsLoading(true);

    const promises = await files.map((file) => {
      const filename = makeFileName(file.name, "P");
      const storageRef = ref(storage, `${path}/${filename}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.error(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              dummy.push({ link: downloadURL, filename });
              return dummy;
            })
            .then((dummy) => {
              setDownloadURLs(() => [...dummy]);
            });
        }
      );

      return uploadTask;
    });

    Promise.all(promises);
  };

  const handleFileSelect = async (e) => {
    e.preventDefault();
    const path = `images/player/${pInfo.pUid}`;
    setFiles((prev) => (prev = Array.prototype.slice.call(e.target.files)));

    await uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updatePlayerPic = async (data) => {
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    ).then(() => {
      console.log("업데이트 완료");
    });
  };

  const updatePlayer = useCallback(
    async (data) => {
      await setDoc(
        doc(db, "players_pool", pInfo.id),
        { ...data },
        { merge: true }
      )
        .then(() => setIsLoading(false))
        .then(() => {
          console.log("업데이트 완료");
        });
    },
    [playerInfo.pPic]
  );

  useMemo(() => {
    if (downloadURLs[0].link !== (undefined || null || "")) {
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
    }
  }, [downloadURLs]);
  useMemo(() => {
    console.log(playerInfo);
    if (playerInfo.pPic !== ("" || undefined || null)) {
      updatePlayer(playerInfo);
      setCurrentUserInfo({ ...pInfo, ...playerInfo });
    }
  }, [playerInfo.pPic]);

  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
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
        <Header title="내 프로필" />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
          <div className="flex flex-col w-full mt-5 mb-5">
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
              <label htmlFor="playerPic">
                <div className="flex h-full w-full justify-center items-center cursor-pointer">
                  <img
                    src={
                      (pInfo.pPic !== null || undefined || "") &&
                      (pInfo.pPic || DEFAULT_AVATAR)
                    }
                    className="rounded-3xl w-32 h-32"
                  />
                </div>
                <div className="flex w-7 h-7 rounded-xl relative -top-6 left-56 bg-white shadow-md border justify-center items-center">
                  <BsFillCameraFill className="text-gray-600" />
                </div>
                <input
                  name="playerPic"
                  id="playerPic"
                  type="file"
                  files={files}
                  className="hidden"
                  onChange={(e) => handleFileSelect(e)}
                />
              </label>
            </div>
            <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b">
              <span className="text-sm">실명(변경불가)</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pName || "실명 확인이 필요합니다."}
              </span>
            </div>
            <button
              disabled
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              // onClick={() =>
              //   navigate("/editprofile", { state: { editType: "pEmail" } })
              // }
            >
              <span className="text-sm">이메일(변경불가)</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pEmail || "이메일 확인이 필요합니다."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pTel" } })
              }
            >
              <span className="text-sm">전화번호</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pTel || "전화번호 입력이 필요합니다."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGym" } })
              }
            >
              <span className="text-sm">소속</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pGym || "소속클럽을 설정할 수 있습니다."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pNick" } })
              }
            >
              <span className="text-sm">닉네임</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pNick || "닉네임을 설정할 수 있습니다."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pBirth" } })
              }
            >
              <span className="text-sm">생년월일</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pBirth || "연령에 따라 참가가능 종목을 추천해드립니다."}
              </span>
            </button>
            <button
              className="flex w-full h-full flex-col bg-white p-4 gap-y-1 border-b"
              onClick={() =>
                navigate("/editprofile", { state: { editType: "pGender" } })
              }
            >
              <span className="text-sm">성별</span>
              <span className="text-sm font-light text-gray-400">
                {pInfo.pGender
                  ? pInfo.pGender === "m"
                    ? "남자"
                    : "여자"
                  : "성별에 따라 참가가능 종목을 추천해드립니다."}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
