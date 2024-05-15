
import axios, { AxiosError } from 'axios';
import router from "../router/index";
import cookieUtils from "./cookie/cookie";

// 创建一个 Axios 实例
const instance = axios.create({
    baseURL: '/api',
});

// 请求拦截器，统一添加 Token
instance.interceptors.request.use(
    (config) => {
        const token = cookieUtils.get("Authorization");
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器，处理 401 错误跳转登录页
instance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if(router.currentRoute.value.name == 'login'){
            return Promise.reject(error);
        }
        if (error.response?.status === 401) {
            // 401 错误，跳转登录页
            router.push('/login');
        }
        return Promise.reject(error);
    }
);

export default instance;