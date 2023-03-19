// material-ui
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails, documentFileDelete } from 'store/features/document/documentActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import API from 'helpers/jwt.interceptor';

//import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import { Quill } from 'react-quill';
import * as Y from 'yjs';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { colors } from 'ui-component/colors';
import Fab from '@mui/material/Fab';
// assets
import { IconDeviceFloppy } from '@tabler/icons';

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
import { styled, useTheme } from '@mui/material/styles';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { IconTrash } from '@tabler/icons';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate, documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import {
    updateDoc,
    updateDocId,
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    resetStateHeader
} from 'store/features/header/headerSlice';
import { SET_LOADER } from 'store/actions';
import ContextMenuDocumentFile from 'layout/components/contextMenuDocumentFile';
// ==============================|| PAGE ||============================== //

const Document = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { loading, userInfo, error, userToken } = useSelector((state) => state.auth);
    const docData = useSelector((state) => state.document.data);
    const navigate = useNavigate();
    const { documentKey } = useParams();
    const [docObj, setDocObj] = useState(null);
    const [docTitle, setDocTitle] = useState('');
    const [docBody, setDocBody] = useState('');
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    let bodyText = '';

    const getDocumentDetails = async () => {
        const res = await API.get(`document/${documentKey}`);
        if (res) {
            let doc = res.data.data;
            setDocObj(doc);
            dispatch(updateDocId({ doc_id: doc.doc_key }));
            dispatch(updateDoc({ doc: doc }));

            setDocTitle(doc.doc_title);
            setDocBody(doc.doc_body);
            bodyText = doc.doc_body;
        }
    };

    const onTitleChange = (e) => {
        setDocTitle(e.target.value);
        dispatch(updateDocumentTitle({ document_key: documentKey, doc_title: e.target.value }));
    };

    const onTitleBlur = (e) => {
        dispatch(
            documentUpdate({
                url: 'document/update-doc/' + docObj.doc_key,
                navigate,
                data: {
                    doc_title: e.target.value
                },
                extraData: {}
            })
        );
    };

    const onBodyChange = (value) => {
        setDocBody(value);
        bodyText = value;
    };

    let quillRef = null;
    let reactQuillRef = null;
    let isQuillText = false;

    const getRamndomColors = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const attachQuillRefs = () => {
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
        quillRef.getModule();
        let tooltip = quillRef.theme.tooltip;
        let input = tooltip.root.querySelector('input[data-link]');
        input.dataset.link = 'https://yourdomain.com';
    };

    const handleMouseLeave = (ev) => {
        if (ev) {
            dispatch(
                documentUpdateOnEditorLeave({
                    url: 'document/update-doc/' + docObj.doc_key,
                    navigate,
                    data: {
                        doc_body: docBody
                    },
                    extraData: {}
                })
            );
        }
    };

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        }

        attachQuillRefs();
        getDocumentDetails();

        dispatch(documentDetails({ url: `document/${documentKey}` }));
        const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
        dispatch(collectionList({ url }));

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(process.env.REACT_APP_WEB_SOCKET_URL, documentKey, ydoc);
        const ytext = ydoc.getText('quill');

        dispatch({ type: SET_LOADER, loader: true });
        setTimeout(() => {
            if (ytext.toJSON().length > 0) {
                isQuillText = true;
            } else {
                isQuillText = false;
            }
            new QuillBinding(ytext, quillRef, provider.awareness);

            dispatch({ type: SET_LOADER, loader: false });
        }, 1000);

        provider.awareness.on('change', ({ added, removed, updated }) => {
            const users = [];
            for (const [clientId, state] of provider.awareness.getStates()) {
                const user = state.user;
                users.push(user);
            }
        });

        provider.awareness.setLocalStateField('user', {
            name: userInfo.first_name,
            color: getRamndomColors()
        });

        return () => {
            // Clean up Yjs document
            provider.disconnect();
            ydoc.destroy();
        };
    }, [navigate, userToken, documentKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (docBody || docTitle) handleSubmit();
        }, 60 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, [docBody, docTitle]);

    useEffect(() => {}, [docData]);

    const handleSubmit = async () => {
        try {
            const res = await API.patch(`document/update-doc/${documentKey}`, {
                doc_title: docTitle,
                doc_body: docBody ?? bodyText
            });
            if (res.data.state == 'success') {
                setProgress(100);
            }
        } catch (error) {
            throw error;
        }
    };

    const fabStyle = {
        position: 'fixed',
        bottom: 25,
        right: 16
    };

    //////////////////////////// context menu //////////////////////////////
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
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleClickOpenConfirmation = () => {
        setOpenConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };
    const handleConfirmationDialogOk = (values) => {
        dispatch(
            documentFileDelete({
                url: 'document/delete-attachment/' + values.id
            })
        );
        setTimeout(() => {
            dispatch(documentDetails({ url: `document/${documentKey}` }));
        }, 500);
        setOpenConfirmation(false);
    };

    return (
        <>
            <MainCard title="" onMouseLeave={(ev) => handleMouseLeave(ev)}>
                {docData != null && (
                    <Box sx={{ m: 1 }} style={{ float: 'right' }}>
                        <Stack direction="row" spacing={1}>
                            {docData.attachments != null &&
                                docData.attachments.length > 0 &&
                                docData.attachments.map((item, index) => (
                                    <IconButton
                                        onClick={(event) => handleContextMenuClick(event, item)}
                                        key={item.id}
                                        color="primary"
                                        aria-label="upload document"
                                        component="label"
                                    >
                                        <DescriptionIcon fontSize="inherit" />
                                    </IconButton>
                                ))}
                        </Stack>
                    </Box>
                )}
                <form>
                    <TextField
                        inputProps={{ style: { fontSize: 40, fontWeight: 600 } }}
                        fullWidth
                        id="standard-basic"
                        className="title-text"
                        value={docTitle}
                        onChange={onTitleChange}
                        onBlur={onTitleBlur}
                        name="docTitle"
                        label=""
                        variant="standard"
                    />

                    <div className="editor-container">
                        <EditorToolbar toolbarId={'t1'} />

                        {isQuillText == true ? (
                            <ReactQuill
                                ref={(el) => {
                                    reactQuillRef = el;
                                }}
                                bounds=".editor-container"
                                theme="bubble"
                                onChange={onBodyChange}
                                placeholder={'Write something here...'}
                                formats={formats}
                                modules={modules('t1')}
                                preserveWhitespace
                            />
                        ) : (
                            <ReactQuill
                                ref={(el) => {
                                    reactQuillRef = el;
                                }}
                                bounds=".editor-container"
                                theme="bubble"
                                value={docBody}
                                onChange={onBodyChange}
                                placeholder={'Write something here...'}
                                formats={formats}
                                modules={modules('t1')}
                                preserveWhitespace
                            />
                        )}
                        <Fab sx={fabStyle} onClick={handleSubmit} aria-label="Save" color="primary">
                            <IconDeviceFloppy />
                        </Fab>
                    </div>
                </form>
            </MainCard>

            <ContextMenuDocumentFile
                anchorEl={anchorEl}
                open={openContextMenu}
                data={selectedFile}
                handleClose={handleContextMenuFileClose}
                handleOpenFileClick={(values) => handleOpenFileClick(values)}
                handleDeleteClick={handleClickOpenConfirmation}
            />

            <ConfirmationDialog
                title="Delete File"
                description="Are you sure? File will be deleted."
                open={openConfirmation}
                data={selectedFile}
                handleClose={handleCloseConfirmation}
                handleOk={(values) => handleConfirmationDialogOk(values)}
                okButtonText="Delete"
                closeButtonText="Close"
            />

            <LoadingBar color="#8800ff" progress={progress} onLoaderFinished={() => setProgress(0)} />
        </>
    );
};

export default Document;
