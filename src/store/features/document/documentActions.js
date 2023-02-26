import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const documentDetails = createAsyncThunk('document/details', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.get(url);
        return res.data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const documentUpdate = createAsyncThunk('document/update', async ({ url, data }, { rejectWithValue }) => {
    try {
        const res = await API.post(url, data);
        return res.data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
