import React, { createContext, useState, useContext, useEffect } from "react";
import CryptoJS from "crypto-js";
import { API } from "../utils/API";

const AuthContext = createContext({
  isLoggedIn: false,
  isAdmin: false,
  userId: null,
  name: "",
  email: "",
  imageUrl: "",
  AccessToken: "",
  RefreshToken: "",
  setAccessToken: () => {},
  setRefreshToken: () => {},
  setIsLoggedIn: () => {},
  setName: () => {},
  setUserId: () => {},
  setEmail: () => {},
  setImageUrl: () => {},
  clearAuth: () => {},
});

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

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [AccessToken, setAccessToken] = useState("");
  const [RefreshToken, setRefreshToken] = useState("");

  useEffect(() => {
    const loadAuthData = () => {
      const storedData = localStorage.getItem("authData");
      if (storedData) {
        const decryptedData = decryptData(storedData);
        if (decryptedData.email !== "") setIsLoggedIn(true);
        setName(decryptedData.name || "");
        setUserId(decryptedData.userId || null);
        setEmail(decryptedData.email || "");
        setImageUrl(decryptedData.imageUrl || "");
        setAccessToken(decryptedData.AccessToken || "");
        setRefreshToken(decryptedData.RefreshToken || "");
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    const saveAuthData = () => {
      const authData = {
        name,
        email,
        userId,
        imageUrl,
        AccessToken,
        RefreshToken,
      };
      localStorage.setItem("authData", encryptData(authData));
    };

    saveAuthData();
  }, [name, email, userId, imageUrl, AccessToken, RefreshToken]);

  useEffect(() => {
    if (isLoggedIn && AccessToken !== "") {
      const verifyEmail = async () => {
        try {
          const response = await API.get("/api/v1/admin", {
            headers: {
              Authorization: `Bearer ${AccessToken}`,
            },
          });
          // console.log(response.data);
          setIsAdmin(response.data.admin);
        } catch (error) {
          console.error("Error verifying email", error);
          setIsAdmin(false);
        }
      };
      verifyEmail();
    }
  }, [isLoggedIn, userId, email, AccessToken]);

  const clearAuth = () => {
    setName("");
    setEmail("");
    setImageUrl("");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUserId(null);
    setAccessToken("");
    setRefreshToken("");
    localStorage.removeItem("authData");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        userId,
        name,
        email,
        imageUrl,
        AccessToken,
        RefreshToken,
        setAccessToken,
        setRefreshToken,
        setIsLoggedIn,
        setUserId,
        setName,
        setEmail,
        setImageUrl,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);
