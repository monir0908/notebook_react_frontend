import { createSlice } from '@reduxjs/toolkit';
import { registerUser, userLogin } from './authActions';
import { toast } from 'react-toastify';

export const userInfoInit = {
    refresh: '',
    access: '',
    id: '',
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    user_code: '',
    is_active: false,
    is_staff: false,
    is_superuser: false,
    profile_pic: ''
};

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;
const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : userInfoInit;
const profile_pic = localStorage.getItem('profile_pic') ? localStorage.getItem('profile_pic') : null;

const initialState = {
    loading: false,
    userInfo,
    userToken,
    profile_pic,
    error: null,
    success: false,
    state: null
};

const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken'); // delete token from storage
            localStorage.removeItem('userInfo'); // delete token from storage
            localStorage.removeItem('profile_pic'); // delete token from storage
            state.loading = false;
            state.userInfo = null;
            state.userToken = null;
            state.profile_pic = null;
            state.error = null;
            state.success = false;
            state.collection = null;
            toast.success('You are successfully logged out', { autoClose: 3000 });
        },
        setProfilePic: (state, { payload }) => {
            state.profile_pic = payload.data;
            localStorage.setItem('profile_pic', payload.data);
        },
        setProfileData: (state, { payload }) => {
            const { first_name, last_name } = payload.data;
            state.userInfo.full_name = first_name + ' ' + last_name;
            state.userInfo.first_name = first_name;
            state.userInfo.last_name = last_name;
            localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
        },
        setCredentials: (state, { payload }) => {
            state.userInfo = payload.data;
        }
    },
    extraReducers: (builder) => {
        // login user
        builder.addCase(userLogin.pending, (state, action) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.userInfo = payload.data;
                state.userToken = payload.data.access;
                state.profile_pic = payload.data.profile_pic;
                state.success = true; // login successful
                toast.success('You are successfully logged in', { autoClose: 3000 });
            }),
            builder.addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                toast.warn(payload, { autoClose: true });
            }),
            // register user
            builder.addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(registerUser.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.success = true;
                state.state = payload.state; // registration successful
                toast.success(payload.message, { autoClose: true });
            }),
            builder.addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload ? (payload.email[0] ? payload.email[0] : payload) : null;
                toast.warn(state.error, { autoClose: true });
            });
    }
});

export const { logout, setCredentials, setProfilePic, setProfileData } = authSlice.actions;

export default authSlice.reducer;
