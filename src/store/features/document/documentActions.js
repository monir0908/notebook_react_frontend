import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

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

export const documentUpdate = createAsyncThunk('document/update', async ({ url, navigate, data, extraData }, { rejectWithValue }) => {
    try {
        const res = await API.patch(url, data);
        if (res.data.success) {
            if (extraData.status == 'delete') {
                //navigate('/collection/'+extraData.col_key);
                navigate('/home');
            } else if (extraData.status == 'publish') {
                navigate(extraData.doc_url);
            }
            toast.success(res.data.message, { autoClose: 3000 });
        } else {
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        toast.error(res.data.message, { autoClose: 3000 });
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const documentCreate = createAsyncThunk('document/create', async ({ url, navigate, data }, { rejectWithValue }) => {
    try {
        const res = await API.post(url, data);
        if (res.data.success) {
            navigate('/document/' + res.data.data.doc_key);
            toast.success(res.data.message, { autoClose: 3000 });
        } else {
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        return res.data;
    } catch (error) {
        toast.error(res.data.message, { autoClose: 3000 });
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
