import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_SERVER_URL}`,
  timeout: 5000,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    const urlType = originalConfig.url.split("/")[0];
    if (urlType !== "auth" && err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          await axiosInstance.post("auth/refresh");
          return axiosInstance(originalConfig);
        } catch (error) {
          return Promise.reject(error);
        }
      }
    }
    return Promise.reject(err);
  }
);
