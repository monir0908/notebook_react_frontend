import axios from 'axios';
import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
const baseURL = process.env.REACT_APP_API_BASEURL;
import { toast } from 'react-toastify';

export const userLogin = createAsyncThunk('user/login', async ({ email, password }, { rejectWithValue }) => {
    try {
        // configure header's Content-Type as JSON
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post(`${baseURL}user/login`, { email, password }, config);

        // store user's token in local storage
        localStorage.setItem('userInfo', JSON.stringify(data.data));
        localStorage.setItem('userToken', data.data.access);
        localStorage.setItem('profile_pic', data.data.profile_pic);

        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const registerUser = createAsyncThunk(
    'user/signup',
    async ({ first_name, last_name, email, password, navigate }, { rejectWithValue }) => {
        //const navigate = useNavigate();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const { data } = await axios.post(`${baseURL}user/signup`, { first_name, last_name, email, password }, config);
            if (data.state == 'success') navigate('/login');
            return data;
        } catch (error) {
            if (error.response.data.details) {
                return rejectWithValue(error.response.data.details);
            } else if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const changePassword = createAsyncThunk('auth/changePassword', async ({ old_password, new_password }, { rejectWithValue }) => {
    try {
        const res = await API.put(`${baseURL}user/change-password`, { old_password, new_password });

        if (res.data.state == 'success') {
            toast.success(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        if (error.response && error.response.data.message) {
            if (error.response.data.state == 'warning') {
                toast.warn(error.response.data.message, { autoClose: 3000 });
            } else if (error.response.data.state == 'error') {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
            return rejectWithValue(error.response.data.message);
        } else {
            toast.error(error.message, { autoClose: 3000 });
            return rejectWithValue(error.message);
        }
    }
});
