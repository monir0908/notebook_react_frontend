import { createSlice } from '@reduxjs/toolkit';
import { documentDetails, documentCreate, documentUpdate } from './documentActions';

const initialState = {
    data: null,
    error: null,
    loading: false
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
                state.data = payload;
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
            builder.addCase(documentUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(documentUpdate.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.error = null;
            }),
            builder.addCase(documentUpdate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});
export default documentSlice.reducer;
