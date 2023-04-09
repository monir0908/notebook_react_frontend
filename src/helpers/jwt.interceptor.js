import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL });
// eslint-disable-next-line react-hooks/rules-of-hooks

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}`;
    }
    return req;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 403) {
            // redirect to 403 page
            window.location = '/403';
        }
        if (error.response.status === 401) {
            localStorage.removeItem('userToken');
            window.location = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
