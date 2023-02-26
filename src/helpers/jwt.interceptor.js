import axios from 'axios';
const API = axios.create({ baseURL: process.env.REACT_APP_API_BASEURL });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('userInfo')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).access}`;
    }
    return req;
});

export default API;
