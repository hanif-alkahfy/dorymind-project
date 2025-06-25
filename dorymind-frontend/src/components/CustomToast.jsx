import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showSuccessToast = (message) => {
  toast.success(`${message}`, {
    position: "top-right",
    style: {
      backgroundColor: "#B3E5FC",
      color: "#01579B",
      border: "1px solid #B3E5FC",
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(`${message}`, {
    position: "top-left",
    style: {
      backgroundColor: "#F0F9FF",
      color: "#D32F2F",
      border: "1px solid #01579B",
    },
  });
};

export const showWarningToast = (message) => {
  toast.warning(`${message}`, {
    position: "bottom-center",
    style: {
      backgroundColor: "#29B6F6",
      color: "#F0F9FF",
    },
  });
};
