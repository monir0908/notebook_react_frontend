import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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

export const collectionCreate = createAsyncThunk('collection/create', async ({ url, data }, { rejectWithValue }) => {
    try {
        const res = await API.post(url, data);
        if (res.data.success) {
            toast.success(res.data.message, { autoClose: 3000 });
        } else {
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message, { autoClose: 3000 });
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const collectionUpdate = createAsyncThunk('collection/update', async ({ url, data }, { rejectWithValue }) => {
    try {
        const res = await API.patch(url, data);
        if (res.data.success) {
            toast.success(res.data.message, { autoClose: 3000 });
        } else {
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message, { autoClose: 3000 });
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const collectionDelete = createAsyncThunk('collection/delete', async ({ url, navigate }, { rejectWithValue }) => {
    try {
        const res = await API.delete(url);
        navigate('/home');
        if (res.data.success) {
            toast.success(res.data.message, { autoClose: 3000 });
        } else {
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        toast.error(error.response.data.message, { autoClose: 3000 });
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
