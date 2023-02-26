import { createSlice } from '@reduxjs/toolkit';
import { documentDetails } from './documentActions';

const initialState = {
    data: null,
    error: null,
    loading: false
};

const documentSlice = createSlice({
    name: 'userDocument',
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
            });
    }
});
export default documentSlice.reducer;
