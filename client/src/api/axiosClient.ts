import axios, { AxiosInstance } from 'axios';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});