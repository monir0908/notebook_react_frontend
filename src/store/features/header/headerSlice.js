import { createSlice, createAction } from '@reduxjs/toolkit';

export const resetStateHeader = createAction('Reset_all_header');

const initialState = {
    doc_id: '',
    doc: {},
    upload_show: true,
    share_show: false,
    publish_show: false,
    unpublish_show: false,
    delete_show: false
};

const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        updateDocId(state, action) {
            const { doc_id } = action.payload;
            state.doc_id = doc_id;
        },
        updateDoc(state, action) {
            const { doc } = action.payload;
            state.doc = doc;
        },
        updateShareButton(state, action) {
            const { isShareShow } = action.payload;
            state.share_show = isShareShow;
        },
        updatePublishButton(state, action) {
            const { isPublishShow } = action.payload;
            state.publish_show = isPublishShow;
        },
        updateUnpublishButton(state, action) {
            const { isUnpublishShow } = action.payload;
            state.unpublish_show = isUnpublishShow;
        },
        updateDeleteButton(state, action) {
            const { isDeleteShow } = action.payload;
            state.delete_show = isDeleteShow;
        },
        updateUploadButton(state, action) {
            const { isUploadShow } = action.payload;
            state.upload_show = isUploadShow;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(resetStateHeader, () => initialState);
    }
});

export const {
    updateDocId,
    updateDoc,
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    updateUploadButton
} = headerSlice.actions;
export default headerSlice.reducer;
