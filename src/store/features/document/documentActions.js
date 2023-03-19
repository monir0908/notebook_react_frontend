import API from 'helpers/jwt.interceptor';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { resetStateHeader } from '../header/headerSlice';

const handleApiError = (error) => {
    const errorMessage = error.response && error.response.data.message ? error.response.data.message : error.message;
    toast.error(errorMessage, { autoClose: 3000 });
    return errorMessage;
};

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

export const sharedDocumentList = createAsyncThunk('document/list-shared', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.get(url + '?page=1&page_size=100');
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

export const documentList = createAsyncThunk('document/list', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.get(url + '&page=1&page_size=100');
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

export const documentUpdateOnEditorLeave = createAsyncThunk(
    'document/update-on-editor-change',
    async ({ url, navigate, dispatch, data, extraData }, { rejectWithValue }) => {
        try {
            const res = await API.patch(url, data);
            return res.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

export const documentUpdate = createAsyncThunk(
    'document/update',
    async ({ url, navigate, dispatch, data, extraData }, { rejectWithValue }) => {
        try {
            const res = await API.patch(url, data);
            if (res.data.success) {
                if (extraData) {
                    if (extraData.status == 'delete') {
                        //navigate('/collection/'+extraData.col_key);
                        dispatch(resetStateHeader());
                        navigate('/home');
                    } else if (extraData.status == 'restore') {
                        navigate(extraData.doc_url);
                    } else if (extraData.status == 'publish') {
                        navigate(extraData.doc_url);
                    }
                }
                toast.success(res.data.message, { autoClose: 3000 });
            } else {
                toast.warn(res.data.message, { autoClose: 3000 });
            }
            return res.data;
        } catch (error) {
            return rejectWithValue(handleApiError(error));
        }
    }
);

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
        return rejectWithValue(handleApiError(error));
    }
});

export const documentDelete = createAsyncThunk('document/delete', async ({ url, navigate }, { rejectWithValue }) => {
    try {
        const res = await API.delete(url);
        navigate('/trash');
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

export const documentFileDelete = createAsyncThunk('document/file-delete', async ({ url }, { rejectWithValue }) => {
    try {
        const res = await API.delete(url);
        return res.data;
    } catch (error) {
        return rejectWithValue(handleApiError(error));
    }
});
