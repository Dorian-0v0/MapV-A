import axios from 'axios';
import useTokenStore from '@/store/tokenStore';
import { message } from 'antd';

// 修正 baseURL
const baseURL = 'http://localhost:8080';
const instance = axios.create({ baseURL });

// 添加响应拦截器
instance.interceptors.response.use(
    result => {
        console.log("响应数据：", result);

        if (result.data.status == 0) {
            return result.data;
        }
        message.error(result.data.message ? result.data.message : "操作失败");
        return Promise.reject(result);
    },
    err => {
        console.log("错误", err);

        if (err?.response?.status === 401) {
            message.error('请先登录');
            // 移除 useNavigate()，改用其他方式跳转
            redirectToLogin();
        } else {
            message.error('服务异常');
        }
        return Promise.reject(err);
    }
);

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        const token = useTokenStore.getState().token;
        const whiteList = ['http://api.tianditu.gov.cn/geocoder', '/api/auth/refresh-token'];

        if (!whiteList.includes(String(config.url)) && !token) {
            
            useTokenStore.getState().clearToken();
            redirectToLogin();
            return Promise.reject(new Error('No authentication token found. Request canceled.'));
        }

        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        console.log("请求错误", error);
        return Promise.reject(error);
    }
);

// 添加登录跳转函数（根据您的项目结构选择合适的方式）
const redirectToLogin = () => {
    message.error('请先登录');
    window.location.href = '/login';
};

const tiandituKey = '4267820f43926eaf808d61dc07269beb';
const tenxunkey = '5LGBZ-ODAWW-BQKRA-YWLI3-VFP4O-M5FDE';

export { tiandituKey, tenxunkey };
export default instance;