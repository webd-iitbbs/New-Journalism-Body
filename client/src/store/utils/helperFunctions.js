import { toast } from "react-toastify";
import { API, baseBackendUrl } from "./API";
import CryptoJS from "crypto-js";

const encryptData = (data) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    "your-secret-key#oracle2024"
  ).toString();
};

const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, "your-secret-key#oracle2024");
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

const formatDate = (dateString, formatType) => {
  // Parse the date string into a Date object
  const dateObj = new Date(dateString);

  // Check if the date object is valid
  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date value");
  }

  // Helper function to pad numbers with leading zeroes
  const pad = (number) => (number < 10 ? `0${number}` : number);

  let formattedDate;

  if (formatType === 1) {
    // Format: August 10, 2024
    const options = { year: "numeric", month: "long", day: "2-digit" };
    formattedDate = new Intl.DateTimeFormat("en-US", options).format(dateObj);
  } else if (formatType === 2) {
    // Format: 10 August 2024
    const day = pad(dateObj.getDate());
    const month = dateObj.toLocaleString("en-US", { month: "long" });
    const year = dateObj.getFullYear();
    formattedDate = `${day} ${month} ${year}`;
  } else if (formatType === 3) {
    // Format: 10/08/2024
    const day = pad(dateObj.getDate());
    const month = pad(dateObj.getMonth() + 1); // Months are zero-indexed
    const year = dateObj.getFullYear();
    formattedDate = `${day}/${month}/${year}`;
  } else {
    throw new Error("Invalid format type");
  }
  return formattedDate;

  // Return the formatted date string
  // formatType 1: August 10, 2024
  // formatType 2: 10 August 2024
  // formatType 3: 10/08/2024
};

const uploadHandlerServer = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await API.post(`/api/v1/file/upload-file`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log(res.data);
    const id = res.data.data.id;
    const url = `${baseBackendUrl}/api/v1/file/${id}`;
    console.log(url);
    return url;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const getLocalDataAndDecrypt = (key) => {
  const data = localStorage.getItem(key);
  // console.log(data);
  if (data) {
    return decryptData(data);
  }
  return null;
};

const setLocalDataAndEncrypt = (key, data) => {
  localStorage.setItem(key, encryptData(data));
  return true;
};

const notify = (message, style) => toast(message, { theme: "light", ...style });

export {
  formatDate,
  notify,
  uploadHandlerServer,
  getLocalDataAndDecrypt,
  setLocalDataAndEncrypt,
};
