import axios from 'axios';
import { baseUrl as url } from '../consts';

const authRequest = axios.create({
  baseURL: url,
});

authRequest.interceptors.request.use(
  (config) => {
    // add authorization token to api requests
    const auth = JSON.parse(localStorage.getItem('auth'));
    const token = auth?.access;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authRequest;
