// import { ElLoading } from 'element-plus'
// const elLoading = ElLoading.service({
//     lock: true,
//     text: 'Loading',
//     background: 'rgba(0, 0, 0, 0.7)',
// })
// elLoading.close()
// ElLoading.service().close();


import axios from "axios";
import { ElLoading } from 'element-plus'

const API_URL = 'http://jsonplaceholder.typicode.com'
const pendingRequests = new Map()


const request = ({ url, method, data, loading = false, customError = false, ...rest }) => {
    const requestKey = `${method}_${url}`;



    const axiosInstance = axios.create({
        baseURL: API_URL,
        timeout: 5000
    });

    if (pendingRequests.has(requestKey)) {
        return Promise.reject(new Error("重复调用"));
    }

    const axiosRequest = axiosInstance({
        url,
        method,
        data,
        headers: {
            ...rest
        }
    });


    pendingRequests.set(requestKey, axiosRequest);


    axiosInstance.interceptors.request.use(
        config => {
            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );


    axiosInstance.interceptors.response.use(
        response => {
            return response.data;
        },
        error => {
            return Promise.reject(error);
        }
    );

    return axiosRequest.finally(() => {
        pendingRequests.delete(requestKey);
        console.log(pendingRequests, 'pendingRequests');
    });
}

export default request;


