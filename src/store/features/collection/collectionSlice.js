import { createSlice } from '@reduxjs/toolkit';
import { collectionList, collectionCreate } from './collectionActions';
import { toast } from 'react-toastify';

const initialState = {
    data: [],
    error: null,
    loading: false,
    success: false
};

const collectionSlice = createSlice({
    name: 'userCollection',
    initialState,
    reducers: {
        updateDocumentTitle(state, action) {
            const { document_key, doc_title } = action.payload;

            const updatedCollections = state.data.map((collection) => {
                const updatedDocuments = collection.documents.map((document) => {
                    if (document.doc_key === document_key) {
                        return { ...document, doc_title: doc_title };
                    }
                    return document;
                });
                return { ...collection, documents: updatedDocuments };
            });

            state.data = updatedCollections;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(collectionList.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(collectionList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.error = null;
                state.success = true;
            }),
            builder.addCase(collectionList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            });
        builder.addCase(collectionCreate.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(collectionCreate.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            }),
            builder.addCase(collectionCreate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            });
        // builder.addCase(revertAll, () => initialState);
    }
});
export const { updateDocumentTitle } = collectionSlice.actions;
export default collectionSlice.reducer;
