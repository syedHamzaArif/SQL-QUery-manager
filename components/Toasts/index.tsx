import Error from "./Error";
import { toast } from "react-toastify";
import Success from "./Success";

export const ErrorToast = (message: string) =>
  toast.error(<Error message={message} />, {
    position: "bottom-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });

export const SuccessToast = (message: string) =>
  toast(<Success message={message} />, {
    position: "bottom-right",
    autoClose: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  });
