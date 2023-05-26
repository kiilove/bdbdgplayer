import React, { useEffect } from "react";
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
import { UserContext } from "../context/UserContext";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const EditPic = ({}) => {
  const { currentUserInfo: pInfo, setCurrentUserInfo } =
    useContext(UserContext);
  const [playerInfo, setPlayerInfo] = useState({ ...pInfo });
  const [files, setFiles] = useState([]);
  const [downloadURLs, setDownloadURLs] = useState([
    { link: "", filename: "" },
  ]);

  const uploadFiles = async (files, path) => {
    let dummy = [];

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
    const path = `images/player/${pInfo.playerUid}`;
    setFiles((prev) => (prev = Array.prototype.slice.call(e.target.files)));

    await uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updatePlayerPic = async (data) => {
    console.log(data);
    await setDoc(
      doc(db, "players_pool", pInfo.id),
      { ...data },
      { merge: true }
    ).then(() => {
      console.log("업데이트 완료");
    });
  };

  useMemo(() => {
    if (downloadURLs[0].link !== (undefined || null || "")) {
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
    }
  }, [downloadURLs]);
  useMemo(() => {
    console.log(playerInfo);
    if (playerInfo.pPic !== ("" || undefined || null)) {
      updatePlayerPic(playerInfo);
      setCurrentUserInfo({ ...playerInfo });
    }
  }, [playerInfo.pPic]);

  return (
    <div
      className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
      style={{ maxWidth: "420px" }}
    >
      <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-2 bg-white px-2">
        <div className="flex flex-col w-full mt-5 mb-5">
          <div className="flex w-full h-full flex-col bg-white p-4 gap-y-1">
            <label htmlFor="playerPic">
              <div className="flex h-full w-full justify-center items-center">
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
        </div>
      </div>
    </div>
  );
};

export default EditPic;
