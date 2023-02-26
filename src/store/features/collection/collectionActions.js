import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
export const collectionList = createAsyncThunk('collection/list', async ({ url }, { rejectWithValue }) => {
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
