import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const options = {
    position: toast.POSITION.BOTTOM_LEFT,
    delay: 200,
    autoClose: 2000,
  };

  switch (type) {
    case "success":
      toast.success(msg, options);
      break;
    case "info":
      toast.info(msg, options);
      break;
    case "warn":
      toast.warn(msg, options);
      break;
    case "error":
      toast.error(msg, options);
      break;
    default:
      toast(msg, options);
      break;
  }
};
