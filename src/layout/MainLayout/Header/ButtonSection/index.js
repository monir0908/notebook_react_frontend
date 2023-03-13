import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';

import DeleteIcon from '@mui/icons-material/Delete';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';
// ==============================|| Buttons ||============================== //
import {
    updateDoc,
    updateDocId,
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    resetStateHeader
} from 'store/features/header/headerSlice';

const ButtonSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const { doc_id, doc, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);
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
        setShareLnk(clientURL + 'document/' + doc.doc_key);
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
                url: 'document/update-status/' + doc.doc_key,
                navigate,
                dispatch,
                data: {
                    doc_status: 3
                },
                extraData: {
                    status: 'delete',
                    doc_url: '/document/' + doc.doc_key
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
                url: 'document/update-status/' + doc.doc_key,
                navigate,
                dispatch,
                data: {
                    doc_status: status
                },
                extraData: {
                    status: 'publish',
                    doc_url: '/document/' + doc.doc_key
                }
            })
        );
    };

    useEffect(() => {
        // getDocumentDetails();

        if (doc.doc_status == 1) {
            dispatch(updatePublishButton({ isPublishShow: true }));
            dispatch(updateUnpublishButton({ isUnpublishShow: false }));
            dispatch(updateDeleteButton({ isDeleteShow: true }));
            dispatch(updateShareButton({ isShareShow: true }));
        } else if (doc.doc_status == 2) {
            dispatch(updatePublishButton({ isPublishShow: false }));
            dispatch(updateUnpublishButton({ isUnpublishShow: true }));
            dispatch(updateShareButton({ isShareShow: true }));
            dispatch(updateDeleteButton({ isDeleteShow: true }));
        } else if (doc.doc_status == 3 || doc.doc_status == 4) {
            dispatch(updatePublishButton({ isPublishShow: false }));
            dispatch(updateShareButton({ isShareShow: false }));
            dispatch(updateUnpublishButton({ isDeleteShow: false }));
            dispatch(updateDeleteButton({ isDeleteShow: false }));
        }

        return () => {
            //dispatch(resetStateHeader());
        };
        // }, [doc, publish_show, unpublish_show, delete_show]);
    }, [doc]);

    return (
        <>
            {/* <Box sx={{ display: { xs: 'block', md: 'none' } }}></Box> */}
            <Box sx={{ display: { xs: 'block', md: 'block' } }}>
                <Stack direction="row" spacing={1} sx={{ mr: 4 }}>
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
