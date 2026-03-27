import { AxiosResponse } from 'axios';

export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
      field?: string;
    };
  };
}