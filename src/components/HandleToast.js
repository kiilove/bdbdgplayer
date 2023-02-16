import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const handleToast = ({ type, msg }) => {
  switch (type) {
    case "success":
      toast.success(msg, {
        position: toast.POSITION.BOTTOM_LEFT,
        delay: 1000,
        autoClose: 2000,
      });
      break;
    case "info":
      toast.info(msg, {
        position: toast.POSITION.BOTTOM_LEFT,
        delay: 1000,
        autoClose: 2000,
      });
      break;
    case "warn":
      toast.warn(msg, {
        position: toast.POSITION.BOTTOM_LEFT,
        delay: 1000,
        autoClose: 2000,
      });
      break;
    case "error":
      toast.error(msg, {
        position: toast.POSITION.BOTTOM_LEFT,
        delay: 1000,
        autoClose: 2000,
      });
      break;

    default:
      break;
  }
};
