import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://10.0.2.2:5116/api", // Thay đổi URL thành 10.0.2.2 cho Android Emulator
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn accessToken vào mỗi request
axiosClient.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) return config;

    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log("🔐 send accessToken:", accessToken);
      }
    } catch (err) {
      console.log("❌ Error reading accessToken", err);
    }

    return config;
  },
  (error) => {
    console.log("❌ Request error", error);
    return Promise.reject(error);
  }
);

// Xử lý refresh token khi accessToken hết hạn
const rawAxios = axios.create(); // Axios không interceptor

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) return Promise.reject(error);

      try {
        const res = await rawAxios.post(
          `${axiosClient.defaults.baseURL}/user/refresh-token`,
          {
            refreshToken,
          }
        );

        const newAccessToken = res.data.accessToken;

        await AsyncStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosClient(originalRequest);
      } catch (err) {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }
    // lay chi tiet err ( test )
    if (error?.response) {
      console.log("❌ API Error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else if (error?.request) {
      console.log("❌ No Response from server:", error?.request);
    } else {
      console.log("❌ Axios Setup Error:", error?.message);
    }
    const customError = {
      // ...error,
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
    };
    return Promise.reject(customError);
    // return Promise.reject(error);
  }
);

export default axiosClient;
