import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { getUserByIdAPI } from "../services/userService";
import { getUserSubscriptionByAccountAPI } from "../services/userSubscriptionService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({
  isOpen: false,
});

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userSubscriptionInfo, setUserSubscriptionInfo] = useState(null);

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
    bio: "",
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
      console.log("get user detail", res.data);
      setUserInfo(res.data);
    } catch (error) {
      console.log("get user by id err", error);
    }
  };

  const handleGetUserSubscriptionById = async (id) => {
    console.log("start get user subscription");
    try {
      const res = await getUserSubscriptionByAccountAPI(id);
      console.log("get user subscription", res.data);
      setUserSubscriptionInfo(res.data);
    } catch (error) {
      console.log("get user subscription err", error);
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
        handleGetUserSubscriptionById,
        userSubscriptionInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
