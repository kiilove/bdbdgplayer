import React from "react";
import { toast } from "react-toastify";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const ToastBadgeIcon = ({ type }) => {
  switch (type) {
    case "success":
      return (
        <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <FiCheckCircle className="text-sm" />
        </span>
      );
    case "warn":
      return (
        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <FiAlertTriangle className="text-sm" />
        </span>
      );
    case "error":
      return (
        <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
          <FiAlertCircle className="text-sm" />
        </span>
      );
    default:
      return (
        <span className="w-6 h-6 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0">
          <FiInfo className="text-sm" />
        </span>
      );
  }
};

export const handleToast = (typeOrObj, msgArg) => {
  const type =
    typeof typeOrObj === "object" && typeOrObj !== null
      ? typeOrObj.type
      : typeOrObj;
  const msg =
    typeof typeOrObj === "object" && typeOrObj !== null
      ? typeOrObj.msg
      : msgArg;

  if (!msg) return;

  toast.dismiss();

  toast(
    <div className="flex items-center gap-x-2.5 text-left">
      <ToastBadgeIcon type={type} />
      <span className="text-[13px] sm:text-sm font-bold text-white leading-snug break-keep">
        {msg}
      </span>
    </div>,
    {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2400,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      icon: false,
      className: "bdbdg-toast-capsule",
      bodyClassName: "bdbdg-toast-body",
    }
  );
};
