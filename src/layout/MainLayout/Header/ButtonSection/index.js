import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// material-ui
import { useTheme, styled } from '@mui/material/styles';
import {
    TextField,
    Box,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography,
    useMediaQuery,
    AppBar,
    CssBaseline,
    Toolbar
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate, documentDetails } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';
import API from 'helpers/jwt.interceptor';
import { SET_LOADER } from 'store/actions';
// ==============================|| Buttons ||============================== //
import {
    updateDoc,
    updateDocId,
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    updateUploadButton,
    resetStateHeader
} from 'store/features/header/headerSlice';

const ButtonSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const { doc_id, doc, upload_show, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);
    const navigate = useNavigate();
    const [value, setValue] = useState('');

    const [publishShow, setPublishShow] = useState(false);
    const [unpublishShow, setUnpublishShow] = useState(false);
    const [sharelink, setShareLnk] = useState('');
    const [deleteShow, setDeleteShow] = useState(true);

    // const getDocumentDetails = async () => {
    //     const res = await API.get(`document/${doc_id}`);

    //     let doc = res.data.data;
    //     dispatch(doc);

    //     // if (doc.doc_status == 1) {
    //     //     setPublishShow(true);
    //     //     setUnpublishShow(false);
    //     // }
    //     // if (doc.doc_status == 2) {
    //     //     setPublishShow(false);
    //     //     setUnpublishShow(true);
    //     // }
    //     // if (doc.doc_status == 3 || doc.doc_status == 4) {
    //     //     setDeleteShow(false);
    //     //     setPublishShow(false);
    //     //     setUnpublishShow(false);
    //     // } else {
    //     //     setDeleteShow(true);
    //     // }
    // };

    //////////////////////////////// share dialog ///////////////////
    const [openShareDialog, setOpenShareDialog] = useState(false);

    const handleClickOpenShareDialog = () => {
        const clientURL = process.env.REACT_APP_PUBLICSITE_BASEURL;
        setOpenShareDialog(true);
        setShareLnk(clientURL + 'document/' + doc_id);
    };

    const handleCloseShareDialog = () => {
        setOpenShareDialog(false);
    };

    //////////////////////////////// delete confirmation /////////
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleClickOpenConfirmation = () => {
        setOpenConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };
    const handleConfirmationDialogOk = () => {
        dispatch(
            documentUpdate({
                url: 'document/update-status/' + doc_id,
                navigate,
                dispatch,
                data: {
                    doc_status: 3
                },
                extraData: {
                    status: 'delete',
                    doc_url: '/document/' + doc_id
                }
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
        setOpenConfirmation(false);
    };

    const handleDocPublish = (status) => {
        switch (status) {
            case 1:
                dispatch(updatePublishButton({ isPublishShow: true }));
                dispatch(updateUnpublishButton({ isUnpublishShow: false }));
                dispatch(updateShareButton({ isShareShow: false }));
                break;
            case 2:
                dispatch(updatePublishButton({ isPublishShow: false }));
                dispatch(updateUnpublishButton({ isUnpublishShow: true }));
                dispatch(updateShareButton({ isShareShow: true }));
                break;
        }
        dispatch(
            documentUpdate({
                url: 'document/update-status/' + doc_id,
                navigate,
                dispatch,
                data: {
                    doc_status: status
                },
                extraData: {
                    status: 'publish',
                    doc_url: '/document/' + doc_id
                }
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    useEffect(() => {
        // getDocumentDetails();

        // if (doc.doc_status == 1) {
        //     dispatch(updatePublishButton({ isPublishShow: true }));
        //     dispatch(updateUnpublishButton({ isUnpublishShow: false }));
        //     dispatch(updateDeleteButton({ isDeleteShow: true }));
        //     dispatch(updateShareButton({ isShareShow: false }));
        // } else if (doc.doc_status == 2) {
        //     dispatch(updatePublishButton({ isPublishShow: false }));
        //     dispatch(updateUnpublishButton({ isUnpublishShow: true }));
        //     dispatch(updateShareButton({ isShareShow: true }));
        //     dispatch(updateDeleteButton({ isDeleteShow: true }));
        // }

        if (userInfo.id == doc.doc_creator_id) {
            if (doc.doc_status == 1) {
                dispatch(updatePublishButton({ isPublishShow: true }));
                dispatch(updateUnpublishButton({ isUnpublishShow: false }));
                dispatch(updateDeleteButton({ isDeleteShow: true }));
                dispatch(updateShareButton({ isShareShow: false }));
                dispatch(updateUploadButton({ isUploadShow: true }));
            } else if (doc.doc_status == 2) {
                dispatch(updatePublishButton({ isPublishShow: false }));
                dispatch(updateUnpublishButton({ isUnpublishShow: true }));
                dispatch(updateShareButton({ isShareShow: true }));
                dispatch(updateDeleteButton({ isDeleteShow: true }));
                dispatch(updateUploadButton({ isUploadShow: true }));
            }
        } else {
            dispatch(updatePublishButton({ isPublishShow: false }));
            dispatch(updateShareButton({ isShareShow: false }));
            dispatch(updateUnpublishButton({ isDeleteShow: false }));
            dispatch(updateDeleteButton({ isDeleteShow: false }));
            dispatch(updateUploadButton({ isUploadShow: false }));
        }

        return () => {
            //dispatch(resetStateHeader());
        };
        // }, [doc, publish_show, unpublish_show, delete_show]);
    }, [doc, navigate]);

    const handleFileChange = async (e) => {
        const documents = e.target.files;
        const formData = new FormData();

        for (let document of documents) {
            formData.append('files', document);
        }

        dispatch({ type: SET_LOADER, loader: true });
        const res = await API.post('document/upload-attachment/' + doc.id, formData);
        if (res.data.state == 'success') {
            dispatch({ type: SET_LOADER, loader: false });
            toast.success(res.data.message, { autoClose: 3000 });
            const url = 'document/' + doc.doc_key;
            dispatch(documentDetails({ url }));
            // navigate('/document/' + doc.doc_key);
        } else {
            dispatch({ type: SET_LOADER, loader: false });
            toast.warn(res.data.message, { autoClose: 3000 });
        }
        // if (images) {
        //   dispatch(uploadProductImage(formData));
        // }
    };

    return (
        <>
            {/* <Box sx={{ display: { xs: 'block', md: 'none' } }}></Box> */}

            <Box sx={{ display: { xs: 'block', md: 'block' } }}>
                <Stack direction="row" spacing={1} sx={{ mr: 4 }}>
                    {upload_show && (
                        <Tooltip title="Upload File">
                            <IconButton color="primary" aria-label="upload document" component="label">
                                <input onChange={handleFileChange} hidden accept=".pdf,.doc,.docx,.xls,.xlsx" multiple type="file" />
                                <UploadFileIcon fontSize="inherit" />
                            </IconButton>

                            {/* <IconButton color="primary" size="large" aria-label="delete">
                                <UploadFileIcon fontSize="inherit" />
                                <input hidden accept="image/*" multiple type="file" />
                            </IconButton> */}
                        </Tooltip>
                    )}
                    {share_show && (
                        <Button onClick={handleClickOpenShareDialog} variant="outlined" size="small">
                            Share
                        </Button>
                    )}

                    {publish_show && (
                        <Button onClick={() => handleDocPublish(2)} variant="outlined" size="small">
                            Publish
                        </Button>
                    )}
                    {unpublish_show && (
                        <Button onClick={() => handleDocPublish(1)} variant="outlined" size="small">
                            Unpublish
                        </Button>
                    )}
                    {delete_show && (
                        <Button
                            onClick={handleClickOpenConfirmation}
                            variant="outlined"
                            size="small"
                            color="error"
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                        </Button>
                    )}
                </Stack>
            </Box>

            <ConfirmationDialog
                title="Delete Decument"
                description="If you delete this document,it will be moved to trash . Do you agree with that?"
                open={openConfirmation}
                handleClose={handleCloseConfirmation}
                handleOk={handleConfirmationDialogOk}
            />
            <ShareDialog link={sharelink} open={openShareDialog} handleClose={handleCloseShareDialog} />
        </>
    );
};

export default ButtonSection;
