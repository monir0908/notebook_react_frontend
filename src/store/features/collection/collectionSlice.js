import { createSlice, createAction } from '@reduxjs/toolkit';
import { collectionList, collectionCreate, collectionUpdate, collectionDelete, collectionDetails } from './collectionActions';
import { toast } from 'react-toastify';

export const resetStateCollection = createAction('Reset_all_collection');
const initialState = {
    data: [],
    collection: null,
    error: null,
    loading: false,
    success: false,
    docName: ''
};

const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        updateDocumentTitle(state, action) {
            const { document_key, doc_title } = action.payload;
            const updatedCollections = state.data.map((collection) => {
                const updatedDocuments = collection.documents.map((document) => {
                    if (document.doc_key === document_key) {
                        state.docName = doc_title;
                        return { ...document, doc_title: doc_title };
                    }
                    return document;
                });
                return { ...collection, documents: updatedDocuments };
            });
            state.docName = doc_title;
            state.data = updatedCollections;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(collectionDetails.pending, (state) => {
            state.loading = true;
            state.error = null;
        }),
            builder.addCase(collectionDetails.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.collection = payload;
                state.error = null;
            }),
            builder.addCase(collectionDetails.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
            }),
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
            }),
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
            }),
            builder.addCase(collectionUpdate.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(collectionUpdate.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            }),
            builder.addCase(collectionUpdate.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            }),
            builder.addCase(collectionDelete.pending, (state) => {
                state.loading = true;
                state.error = null;
            }),
            builder.addCase(collectionDelete.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
            }),
            builder.addCase(collectionDelete.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            }),
            builder.addCase(resetStateCollection, () => initialState);
    }
});
export const { updateDocumentTitle } = collectionSlice.actions;
export default collectionSlice.reducer;
