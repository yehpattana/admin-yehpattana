import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const unAuthorizedStatus = [401];
const nonValidatedRoutes = ['/', '/login', '/auth/sign-in'];

const validateRouteCheck = (route: string): boolean => {
  let validationToggle = false;
  const routeCheck = nonValidatedRoutes.find((_route: string) => _route === route);
  if (routeCheck) validationToggle = true;
  return validationToggle;
};

const Axios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!validateRouteCheck(window.location.pathname)) {
      if (unAuthorizedStatus?.includes(401)) {
        toast.error(`${error?.code} `);
      }
    }
    return Promise.reject(error);
  }
);

const setRefreshToken = (token: string) => {
  localStorage?.setItem('refreshToken', token);
};

const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

const purgeRefreshToken = () => {
  localStorage.remove('refreshToken', { path: '/' });
};

const setAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

const purgeAccessToken = () => {
  localStorage.remove('accessToken', { path: '/' });
};

const getHeaders = () => {
  return {
    Authorization: `${getAccessToken()}`,
  };
};

const getWithoutBase = (url: string, config = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'get',
    url,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const get = (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'get',
    url,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const post = (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'post',
    url,
    data,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const put = (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'put',
    url,
    data,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const patch = (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'patch',
    url,
    data,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const _delete = (url: string, data?: any, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'delete',
    url,
    data: data,
    headers: getAccessToken() ? getHeaders() : {},
    ...config,
  });
};

const mediaUpload = (url: string, data = {}, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios({
    method: 'post',
    url,
    data,
    headers: getAccessToken() ? { ...getHeaders(), 'Content-Type': 'multipart/form-data' } : {},
    ...config,
  });
};

const request = (config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  return Axios(config);
};

export const apiService = {
  setRefreshToken,
  getRefreshToken,
  purgeRefreshToken,
  setAccessToken,
  getAccessToken,
  purgeAccessToken,
  getHeaders,
  getWithoutBase,
  get,
  post,
  put,
  patch,
  _delete,
  mediaUpload,
  request,
};
