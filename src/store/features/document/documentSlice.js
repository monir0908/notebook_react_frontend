import { createSlice, createAction } from '@reduxjs/toolkit';
import {
    documentDetails,
    documentCreate,
    documentUpdate,
    documentList,
    sharedDocumentList,
    documentFileDelete,
    documentUpdateOnEditorLeave
} from './documentActions';

export const resetState = createAction('Reset_all');

export const initMetaData = {
    count: null,
    page_size: null,
    next: null,
    previous: null
};

const initialState = {
    data: null,
    error: null,
    loading: false,
    documentList: [],
    meta_data: initMetaData
};

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(documentDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(documentDetails.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload.data;
                state.error = null;
            }),
            builder.addCase(documentDetails.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(documentCreate.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentCreate.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload;
                state.error = null;
            }),
            builder.addCase(documentCreate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(documentUpdateOnEditorLeave.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentUpdateOnEditorLeave.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
            }),
            builder.addCase(documentUpdateOnEditorLeave.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(documentUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentUpdate.fulfilled, (state, { payload }) => {
                console.log('payload', payload);
                state.loading = false;
                state.error = null;
            }),
            builder.addCase(documentUpdate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(documentList.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.documentList = payload.data;
                state.meta_data = payload.meta_data;
                state.error = null;
            }),
            builder.addCase(documentList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(sharedDocumentList.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(sharedDocumentList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.documentList = payload.data;
                state.error = null;
            }),
            builder.addCase(sharedDocumentList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(documentFileDelete.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentFileDelete.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
            }),
            builder.addCase(documentFileDelete.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
            builder.addCase(resetState, () => initialState);
    }
});
export default documentSlice.reducer;
