import React, { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { DEFAULT_AVATAR } from "../consts";
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { useMemo } from "react";
import { async } from "@firebase/util";
import { useCallback } from "react";

const makeFileName = (filename, salt) => {
  const currentDate = new Date();
  const currentTime = currentDate.getTime();
  const prevFilename = filename.split(".");
  return String(salt).toUpperCase() + currentTime + "." + prevFilename[1];
};

const EditPic = ({}) => {
  const { currentUser, dispatch } = useContext(AuthContext);
  const [playerInfo, setPlayerInfo] = useState({ ...currentUser });
  const [files, setFiles] = useState([]);
  const [downloadURLs, setDownloadURLs] = useState([
    { link: "", filename: "" },
  ]);
  const [profileTitle, setProfileTitle] = useState({
    link: "",
    filename: "",
  });

  const uploadFiles = (files, path) => {
    let dummy = [];

    const promises = files.map((file) => {
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

  const handleFileSelect = (e) => {
    //e.preventDefault();
    const path = `images/player/${currentUser.playerUid}`;
    setFiles((prev) => (prev = Array.prototype.slice.call(e.target.files)));

    uploadFiles(Array.prototype.slice.call(e.target.files), path);
  };

  const updateStatePromise = () => {
    const promises = [
      setProfileTitle((prev) => ({
        ...prev,
        link: downloadURLs[0].link,
        filename: downloadURLs[0].filename,
      })),
      setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link })),
    ];

    Promise.all(promises);
  };

  const handleContextUpdate = () => {
    const promises = [dispatch({ type: "profileEdit", payload: playerInfo })];
    Promise.all(promises);
  };
  // const handleUpdate = async () => {
  //   // await dispatch({ type: "profileEdit", payload: playerInfo }).then(() => {
  //   //   setPlayerInfo((prev) => ({ ...prev, pPic: downloadURLs[0].link }));
  //   // });
  //   const profileUpdate =
  // };
  useMemo(() => updateStatePromise(), [downloadURLs]);
  useMemo(() => handleContextUpdate(), [playerInfo]);

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
                  src={(currentUser.pPic && currentUser.pPic) || DEFAULT_AVATAR}
                  className="rounded-3xl w-24 h-24"
                />
              </div>
              <div className="flex w-7 h-7 rounded-xl relative -top-7 left-52 bg-white shadow justify-center items-center">
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
