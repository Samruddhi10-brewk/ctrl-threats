'use client'
import {AxiosError} from 'axios';
import axios from './axios';
import { APIS } from './api';
import { getRefreshToken, setAccessToken, setRefreshToken } from '../utils/LocalStorage';
import { PROFILE_TYPE, UPDATE_PROFILE_TYPE } from '../types/profiletype';
import { AUTH_APIS } from '../api/apis';
import { ApiError } from '../types/errors';

export const loginUser = async ({credentials, recaptchaToken}: {credentials: string, recaptchaToken: string}) => {
    try {
        const response = await axios.post(`${APIS.LOGIN}`, {"firebase_token": credentials, "recaptcha_token": recaptchaToken, isOAuth: false});
        setRefreshToken(response.data.refresh)
        setAccessToken(response.data.access)
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Error logging in');
        } else {
            throw new Error(`${error}`);
        }
    }
};

export const OAuthAPI = async (credentials: string) => {
    try {
        const response = await axios.post(`${APIS.LOGIN}`, {"firebase_token": credentials, isOAuth: true});
        setRefreshToken(response.data.refresh)
        setAccessToken(response.data.access)
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || 'Error logging in');
        } else {
            throw new Error(`${error}`);
        }
    }
};


export const registerUser = async (credentials: any) => {
    try {
        const response = await axios.post(`${AUTH_APIS.REGISTER}`, credentials);
        return response.data;
    } catch (error: unknown) {
        if (error instanceof AxiosError) {
            const apiError: ApiError = new Error();
            apiError.response = error.response;
            throw apiError;
        } else {
            throw new Error('Registration failed, please try again');
        }
    }
};


export const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken()
        const response = await axios.post(`${APIS.REFRESH_TOKEN}`, {"refresh": refreshToken})
        if (response.status == 200) {
            const data = response.data;
            setRefreshToken(data.refresh)
            setAccessToken(data.access)
            return data.access
        } else {
        }
    } catch (error: unknown) {
        throw new Error("Session exipred");
    }
}


export const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`${APIS.PROFILE}`)
        if (response.status == 200) {
            const data: PROFILE_TYPE | null = response.data;
            return data;
        } else {
            throw new Error("User profile couldn't be loaded")
        }
    } catch (error: unknown) {
        if (error instanceof Error)
            throw new Error(error.message);
    }
}

export const updateUserProfile = async (formData: FormData) => {
    try {
        const response = await axios.patch(
            `${APIS.UPDATE_PROFILE}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;

    } catch (error: unknown) {
        if (error instanceof Error)
            throw new Error(error.message);
    }
};


export const getHistory = async () => {
    try {
        const response = await axios.get(APIS.HISTORY);
        if (!response.data) {
            throw new Error("History data couldn't be fetched");
        } else {
            return response.data;
        }
    } catch (error: unknown) {
        if (error instanceof Error)
            throw new Error(error.message);
    }
}

//export const FetchResults = async () => {
//    try {
//        const response = await axios.post(`${MODEL_INTERACT.UPLOADVIDEO}`);
//        return response.data;
//    } catch (error: unknown) {
//        if (error instanceof AxiosError) {
//            throw new Error(error.response?.data?.message || 'Error logging in');
//        } else {
//            throw new Error(`${error}`);
//        }
//    }
//};
//
//
