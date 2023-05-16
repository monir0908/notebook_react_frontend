import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
import { format } from 'date-fns';
// assets
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import IconPdf from 'ui-component/custom-icon/IconPdf';
import IconXls from 'ui-component/custom-icon/IconXls';
import IconDocx from 'ui-component/custom-icon/IconDocx';
import IconPptx from 'ui-component/custom-icon/IconPptx';
import IconImg from 'ui-component/custom-icon/IconImg';
import IconGif from 'ui-component/custom-icon/IconGif';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import UnpublishedIcon from '@mui/icons-material/Unpublished';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate, documentDetails, documentFileDelete, documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';
import API from 'helpers/jwt.interceptor';
import { SET_LOADER } from 'store/actions';
import ContextMenuDocumentFile from 'layout/components/contextMenuDocumentFile';
import ProfileSection from '../ProfileSection';
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
    const location = useLocation();
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const { viewers } = useSelector((state) => state.header);
    const { doc_id, doc, upload_show, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);
    const docData = useSelector((state) => state.document.data);
    const navigate = useNavigate();
    const [sharelink, setShareLnk] = useState('');
    const [docTitle, setDocTitle] = useState('');
    const [isDocPage, setIsDocPage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

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
        let currentUrl = location.pathname;
        const urlArr = currentUrl.split('/');

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

        if (urlArr[1] == 'document') {
            setDocTitle(doc.doc_title);
            setIsDocPage(true);
            dispatch(updateUploadButton({ isUploadShow: true }));
        } else {
            setIsDocPage(false);
        }

        return () => {
            //dispatch(resetStateHeader());
        };
        // }, [doc, publish_show, unpublish_show, delete_show]);
    }, [doc, docData, navigate, userToken]);

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

    const onTitleChange = (e) => {
        setDocTitle(e.target.value);
        dispatch(updateDocumentTitle({ document_key: doc.doc_key, doc_title: e.target.value }));
    };

    const onTitleBlur = (e) => {
        setDocTitle(e.target.value);
        dispatch(
            documentUpdateOnEditorLeave({
                url: 'document/update-doc/' + doc.doc_key,
                navigate,
                data: {
                    doc_title: e.target.value
                },
                extraData: {}
            })
        );
    };

    //////////////////////////// file context menu //////////////////////////////

    const [anchorEl, setAnchorEl] = useState(null);
    const openContextMenu = Boolean(anchorEl);
    const handleContextMenuClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedFile(item);
    };
    const handleContextMenuFileClose = () => {
        setAnchorEl(null);
    };

    const handleOpenFileClick = (values) => {
        window.open(values.file, '_blank', 'noreferrer');
    };

    //////////////////////////////// file delete confirmation /////////
    const [openFileConfirmation, setOpenFileConfirmation] = useState(false);

    const handleClickOpenFileConfirmation = () => {
        setOpenFileConfirmation(true);
    };

    const handleCloseFileConfirmation = () => {
        setOpenFileConfirmation(false);
    };
    const handleFileConfirmationDialogOk = (values) => {
        dispatch(
            documentFileDelete({
                url: 'document/delete-attachment/' + values.id
            })
        );
        setTimeout(() => {
            dispatch(documentDetails({ url: `document/${doc.doc_key}` }));
        }, 500);
        setOpenFileConfirmation(false);
    };

    return (
        <>
            {/* <Box sx={{ display: { xs: 'block', md: 'none' } }}></Box> */}

            <Grid sx={{ mt: 1, ml: 3 }} container direction="row" justifyContent="space-between" alignItems="flex-start">
                {isDocPage ? (
                    <>
                        <Grid item xs={12} md={7} mt={0.5}>
                            <form style={{ marginTop: '3px' }}>
                                <TextField
                                    margin="none"
                                    InputProps={{
                                        disableUnderline: true,
                                        style: { fontSize: 32, fontWeight: 600, border: 'none', padding: '0px 0px' }
                                    }}
                                    fullWidth
                                    id="doc-title"
                                    className="title-text"
                                    value={docTitle}
                                    onChange={onTitleChange}
                                    onBlur={onTitleBlur}
                                    name="docTitle"
                                    label=""
                                    variant="standard"
                                />
                            </form>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{ display: { xs: 'block', md: 'block' } }}>
                                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                                    {upload_show && (
                                        <Tooltip title="Upload File">
                                            <Button
                                                variant="outlined"
                                                id="header-button-upload"
                                                startIcon={<CloudUploadIcon />}
                                                component="label"
                                            >
                                                <input
                                                    onChange={handleFileChange}
                                                    hidden
                                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                                                    multiple
                                                    type="file"
                                                />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    {share_show && (
                                        <Tooltip title="Share Link">
                                            <Button
                                                onClick={handleClickOpenShareDialog}
                                                variant="outlined"
                                                id="header-button-share"
                                                startIcon={<ShareIcon />}
                                            ></Button>
                                        </Tooltip>
                                    )}

                                    {publish_show && (
                                        <Tooltip title="Publish">
                                            <Button
                                                sx={{ mr: 3 }}
                                                onClick={() => handleDocPublish(2)}
                                                variant="outlined"
                                                id="header-button-publish"
                                                startIcon={<PublishedWithChangesIcon />}
                                            ></Button>
                                        </Tooltip>
                                    )}
                                    {unpublish_show && (
                                        <Tooltip title="Unpublish">
                                            <Button
                                                sx={{ mr: 3 }}
                                                onClick={() => handleDocPublish(1)}
                                                variant="outlined"
                                                id="header-button-unpublish"
                                                startIcon={<UnpublishedIcon />}
                                            ></Button>
                                        </Tooltip>
                                    )}
                                    {delete_show && (
                                        <Tooltip title="Delete Document">
                                            <Button
                                                sx={{ mr: 3 }}
                                                style={{ maxWidth: '30px', maxHeight: '30px' }}
                                                onClick={handleClickOpenConfirmation}
                                                variant="outlined"
                                                id="header-button-delete"
                                                color="error"
                                                startIcon={<DeleteIcon />}
                                            ></Button>
                                        </Tooltip>
                                    )}
                                    <ProfileSection />
                                </Stack>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} md={12}>
                        <ProfileSection />
                    </Grid>
                )}
            </Grid>

            <ContextMenuDocumentFile
                anchorEl={anchorEl}
                open={openContextMenu}
                data={selectedFile}
                handleClose={handleContextMenuFileClose}
                handleOpenFileClick={(values) => handleOpenFileClick(values)}
                handleDeleteClick={handleClickOpenFileConfirmation}
            />
            <ConfirmationDialog
                title="Delete File"
                description="Are you sure? File will be deleted."
                open={openFileConfirmation}
                data={selectedFile}
                handleClose={handleCloseFileConfirmation}
                handleOk={(values) => handleFileConfirmationDialogOk(values)}
                okButtonText="Delete"
                closeButtonText="Close"
            />

            <ConfirmationDialog
                title="Delete Document"
                description="Are you sure? If you delete this document, it will be moved to trash."
                open={openConfirmation}
                handleClose={handleCloseConfirmation}
                handleOk={handleConfirmationDialogOk}
                okButtonText="Delete"
                closeButtonText="Close"
            />

            <ShareDialog link={sharelink} open={openShareDialog} handleClose={handleCloseShareDialog} />
        </>
    );
};

export default ButtonSection;
