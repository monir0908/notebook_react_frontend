import { createSlice } from '@reduxjs/toolkit';
import { collectionList } from './collectionActions';

const initialState = {
    data: null,
    error: null,
    loading: false
};

const collectionSlice = createSlice({
    name: 'userCollection',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(collectionList.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(collectionList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.data = payload;
                state.error = null;
            }),
            builder.addCase(collectionList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            });
    }
});
export default collectionSlice.reducer;
