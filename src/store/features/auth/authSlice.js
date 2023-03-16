import { createSlice } from '@reduxjs/toolkit';
import { registerUser, userLogin } from './authActions';
import { toast } from 'react-toastify';

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken') ? localStorage.getItem('userToken') : null;
const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;
const profile_pic = localStorage.getItem('profile_pic') ? localStorage.getItem('profile_pic') : null;

const initialState = {
    loading: false,
    userInfo,
    userToken,
    profile_pic,
    error: null,
    success: false
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
                state.success = true; // registration successful
                toast.success("You've successfully registered, Now you can login.", { autoClose: true });
            }),
            builder.addCase(registerUser.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload.email[0] ? payload.email[0] : payload;
                toast.warn(state.error, { autoClose: true });
            });
    }
});

export const { logout, setCredentials, setProfilePic } = authSlice.actions;

export default authSlice.reducer;
