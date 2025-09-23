import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { getUserByIdAPI } from "../services/userService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  isOpen: false,
});

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [modalType, setModalType] = useState("");

  const initialRegisterForm = {
    password: "",
    confirmPassword: "",
    email: "",
    username: "",
    firstname: "",
    lastname: "",
    dob: "",
    gender: "",
    photoUrls: [],
    interestIds: [],
  };
  const [submitRegisterForm, setSubmitRegisterForm] =
    useState(initialRegisterForm);

  // get userid in storage
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
        }
      } catch (error) {
        console.log("Error loading userId:", error);
      }
    };

    loadUserId();
  }, []);

  const handleGetUserById = async (id) => {
    try {
      const res = await getUserByIdAPI(id);
      setUserInfo(res.data);
    } catch (error) {
      console.log("get user by id err", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        setUserId,
        userInfo,
        setUserInfo,
        modalType,
        setModalType,
        initialRegisterForm,
        submitRegisterForm,
        setSubmitRegisterForm,
        initialRegisterForm,
        handleGetUserById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
