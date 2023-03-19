import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

const handleApiError = (error) => {
    const errorMessage = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(errorMessage, { autoClose: 3000 });
    return errorMessage;
};

export const collectionDetails = createAsyncThunk('collection/details', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
    }
});

export const collectionList = createAsyncThunk('collection/list', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.get(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
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
        return rejectWithValue(handleApiError(error));
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
        return rejectWithValue(handleApiError(error));
    }
});

export const collectionDelete = createAsyncThunk('collection/delete', async ({ url, navigate }, { rejectWithValue }) => {
    try {
        const res = await API.delete(url);
        navigate('/home');
        return res.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
    }
});
