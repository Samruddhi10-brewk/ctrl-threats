import axios from 'axios';
import { refreshAccessToken } from '../api/auth'
import { accessTokenExists, clearLocalStorage, getAccessToken, removeAccessToken } from '../utils/LocalStorage';
import toast from 'react-hot-toast';
import { store } from '../store';
import { logoutUser } from '../store/features/auth/authSlice';

const apiUrl = import.meta.env.VITE_API_URL || "/api"
const axiosInstance = axios.create({
    baseURL: apiUrl
});


axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = getAccessToken()
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status == 401 && !originalRequest._retry && accessTokenExists()) {
            originalRequest._retry = true;
            removeAccessToken();
            try {
                await refreshAccessToken();
                if (getAccessToken()) {
                    axiosInstance.defaults.headers.common.Authorization = `Bearer ${getAccessToken()}`;
                    return axiosInstance(originalRequest);
                }
            } catch (e) {
                clearLocalStorage();
                store.dispatch(logoutUser());
                toast.error("Session Expired")
            }

        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

