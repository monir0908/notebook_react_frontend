import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
const baseURL = process.env.REACT_APP_API_BASEURL;

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

export const registerUser = createAsyncThunk('user/signup', async ({ first_name, last_name, email, password }, { rejectWithValue }) => {
    //const navigate = useNavigate();
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const { data } = await axios.post(`${baseURL}user/signup`, { first_name, last_name, email, password }, config);
        console.log(data);
        if (data.success) {
            // navigate('/login');
        }
    } catch (error) {
        if (error.response.data.details) {
            return rejectWithValue(error.response.data.details);
        } else if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
