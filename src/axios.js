import axios from "axios";
import { getToken } from "@/composables/utils/cookie";
import toast from "@/composables/utils/toast";

// Create an axios instance
const instance = axios.create({
    baseURL: "/api",
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    },
    retry: 3,
    retryDelay: 1000,
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken();
    
    // 如果 token 存在，就添加到请求头中
    if (token) {
        config.headers.Authorization = 'Bearer ' + token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
});

// 添加响应拦截器
instance.interceptors.response.use(undefined, async (err) => {
    const config = err.config;
    
    if (config && config.retry && (err.code === 'ECONNABORTED' || err.message.includes('timeout') || err.message.includes('Network Error') || err.message.includes('ERR_INCOMPLETE_CHUNKED_ENCODING'))) {
        config.retryCount = config.retryCount || 0;
        
        if (config.retryCount >= config.retry) {
            return Promise.reject(err);
        }
        
        config.retryCount += 1;
        
        const backoff = new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, config.retryDelay || 1000);
        });
        
        await backoff;
        return instance(config);
    }
    return Promise.reject(err);
});

// 添加响应拦截器处理数据格式
instance.interceptors.response.use(
    response => {
        if (response && response.data) {
            return response.data;
        }
        return {
            success: false,
            errorMessage: '响应数据格式错误'
        };
    },
    error => {
        console.error('Request failed:', error);
        return Promise.reject(error);
    }
);

// 暴露出去
export default instance;