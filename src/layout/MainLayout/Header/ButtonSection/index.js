import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, IconButton, Stack, Typography, Button } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
// assets
import ConfirmationDialog from 'layout/components/confirmationDialog';
import AttachmentListDialog from 'layout/components/AttachmentListDialog';
import { documentUpdate, documentDetails, documentFileDelete, documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';
import API from 'helpers/jwt.interceptor';
import { SET_LOADER } from 'store/actions';
import ContextMenuDocumentFile from 'layout/components/contextMenuDocumentFile';
import ProfileSection from '../ProfileSection';
import showDocIcon from 'assets/icons/svg/show-doc-icon.svg';
import publishIcon from 'assets/icons/svg/publish-icon.svg';
import deleteIcon from 'assets/icons/svg/delete-icon.svg';
import ReactTimeAgo from 'react-time-ago';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// ==============================|| Buttons ||============================== //
import {
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    updateUploadButton
} from 'store/features/header/headerSlice';
import SvgIconStyle from 'ui-component/SvgIconStyle';
import PublishSettingDialog from 'layout/components/publishSettingDialog';

const ButtonSection = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const location = useLocation();
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const { viewers } = useSelector((state) => state.header);
    const { doc_id, doc, upload_show, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);
    const docData = useSelector((state) => state.document.data);
    const docName = useSelector((state) => state.collection.docName);
    let currentUrl = location.pathname;
    let urlArr = currentUrl.split('/');

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
    }, [doc, docData, navigate, userToken]);

    useEffect(() => {
        if (urlArr[1] == 'document') {
            setDocTitle(doc.doc_title);
            setIsDocPage(true);
        } else {
            setIsDocPage(false);
        }
    }, [doc, urlArr[1]]);

    useEffect(() => {
        if (docName != '') {
            setDocTitle(docName);
        }
    }, [docName, doc]);

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

    //////////////////////////////// open attachment list dialog /////////
    const [openAttachmentListDialog, setOpenAttachmentListDialog] = useState(false);
    const handleOpenAttachmentListDialog = () => {
        setOpenAttachmentListDialog(true);
    };

    const handleCloseAttachmentListDialog = () => {
        setOpenAttachmentListDialog(false);
    };

    //////////////////////////////// Publish modal /////////
    const [openPublishDialog, setOpenPublishDialog] = useState(false);

    const handleClickPublishDialog = () => {
        setOpenPublishDialog(true);
    };

    const handlePublishClose = () => {
        setOpenPublishDialog(false);
    };

    return (
        <>
            <Grid
                sx={{ height: { xs: 75, sm: 45, md: 45, lg: 45, xl: 45 }, maxHeight: 'auto' }}
                container
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                {isDocPage ? (
                    <>
                        <Grid item xs={12} sm={5} md={5} lg={5} xl={5} mt={{ xs: 1 }}>
                            <Typography marginLeft={0.65} sx={{ fontSize: '15px', lineHeight: '21.45px', fontWeight: 400 }}>
                                {docTitle}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={7} md={7} lg={7} xl={7}>
                            <Box sx={{}}>
                                <Stack
                                    marginLeft={{ xs: 0.65 }}
                                    direction="row"
                                    justifyContent={{
                                        xs: 'flex-start',
                                        sm: 'flex-end',
                                        md: 'flex-end',
                                        lg: 'flex-end',
                                        xl: 'flex-end'
                                    }}
                                >
                                    {/* upload functionality below
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
                                    )} */}
                                    <Tooltip
                                        sx={{
                                            padding: '6px 8px !important',
                                            backgroundColor: '#092625 !important'
                                        }}
                                        title={
                                            <Typography
                                                sx={{
                                                    width: '217px !important',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    color: '#fff',
                                                    fontStyle: 'normal',
                                                    fontSize: '12px',
                                                    lineHeight: '143%',
                                                    fontWeight: 300
                                                }}
                                            >
                                                Last updated at{' '}
                                                {docData != null &&
                                                    docData.updated_at != null &&
                                                    format(Date.parse(docData.updated_at), 'dd/LL/yyyy hh:mm a')}
                                                &nbsp;&nbsp;&nbsp; Created by{' '}
                                                {userInfo && userInfo.full_name == docData && docData.doc_creator_full_name
                                                    ? 'me'
                                                    : docData && docData.doc_creator_full_name}
                                            </Typography>
                                        }
                                    >
                                        <Typography
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                color: '#849392',
                                                fontSize: '13px',
                                                lineHeight: '15.51px',
                                                fontWeight: 400
                                            }}
                                        >
                                            {docData ? (
                                                <>
                                                    <span style={{ marginRight: '4px' }}>
                                                        {'Edited'} {'  '}
                                                    </span>
                                                    {docData.updated_at != null && (
                                                        <ReactTimeAgo date={Date.parse(docData.updated_at)} locale="en-US" />
                                                    )}
                                                </>
                                            ) : (
                                                ''
                                            )}
                                        </Typography>
                                    </Tooltip>
                                    <Tooltip title="Attachment file">
                                        <IconButton
                                            onClick={handleOpenAttachmentListDialog}
                                            sx={{
                                                ml: 3.25,
                                                '&:hover': {
                                                    backgroundColor: 'unset !important'
                                                },
                                                padding: '0 !important'
                                            }}
                                            disableRipple
                                            disableElevation
                                        >
                                            <SvgIconStyle src={showDocIcon} sx={{ color: '#092625', width: 16.67, height: 16.67 }} />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Publish setting">
                                        <IconButton
                                            onClick={handleClickPublishDialog}
                                            sx={{
                                                ml: 1.5,
                                                '&:hover': {
                                                    backgroundColor: 'unset !important'
                                                },
                                                padding: '0 !important'
                                            }}
                                            disableRipple
                                            disableElevation
                                        >
                                            <SvgIconStyle src={publishIcon} sx={{ color: '#092625', width: 16, height: 16 }} />
                                        </IconButton>
                                    </Tooltip>
                                    {delete_show && (
                                        <Tooltip title="Delete Document">
                                            <IconButton
                                                onClick={handleClickOpenConfirmation}
                                                sx={{
                                                    ml: 1.5,
                                                    '&:hover': {
                                                        backgroundColor: 'unset !important'
                                                    },
                                                    padding: '0 !important'
                                                }}
                                                disableRipple
                                                disableElevation
                                            >
                                                <SvgIconStyle src={deleteIcon} sx={{ color: '#092625', width: 13.33, height: 15 }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <ProfileSection />
                                </Stack>
                            </Box>
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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

            <AttachmentListDialog
                title="Attachment title"
                open={openAttachmentListDialog}
                data={selectedFile}
                handleClose={handleCloseAttachmentListDialog}
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

            <PublishSettingDialog
                open={openPublishDialog}
                handleClose={handlePublishClose}
                handleOk={handleDocPublish}
                okButtonText="Publish"
            />

            <ShareDialog link={sharelink} open={openShareDialog} handleClose={handleCloseShareDialog} />
        </>
    );
};

export default ButtonSection;
