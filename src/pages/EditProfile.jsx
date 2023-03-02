import React, { useContext } from "react";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
import { DEFAULT_AVATAR } from "../consts";
import { AuthContext } from "../context/AuthContext";
import { RxPencil1 } from "react-icons/rx";
import { BsPenFill, BsFillCameraFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import EditPic from "../components/EditPic";

const EditProfile = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  let initInfo = { headerTitle: "" };
  switch (location.state.editType) {
    case "pPic":
      initInfo = {
        ...initInfo,
        headerTitle: "대표사진",
        component: <EditPic />,
      };
      break;
    case "pTel":
      initInfo = { ...initInfo, headerTitle: "전화번호" };
      break;
    case "pNick":
      initInfo = { ...initInfo, headerTitle: "닉네임" };
      break;
    default:
  }
  return (
    <div className="flex justify-center items-start align-top bg-white">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col mb-32"
        style={{ maxWidth: "420px" }}
      >
        <Header title={initInfo.headerTitle} />
        {initInfo.component}
      </div>
    </div>
  );
};

export default EditProfile;
