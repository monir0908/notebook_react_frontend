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
import QuillBetterTable from 'quill-better-table';
import * as QuillTableUI from 'quill-table-ui';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

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
import { IconPlus, IconTrash } from '@tabler/icons';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate, documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';
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
    const { loading, userInfo, error } = useSelector((state) => state.auth);
    const docData = useSelector((state) => state.document.data);
    const navigate = useNavigate();
    const { documentKey } = useParams();
    const [docObj, setDocObj] = useState(null);
    const [publishShow, setPublishShow] = useState(false);
    const [unpublishShow, setUnpublishShow] = useState(false);
    const [sharelink, setShareLnk] = useState('');
    const [deleteShow, setDeleteShow] = useState(true);
    // const [isQuillText, setIsQuillText] = useState(false);
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

            // switch (doc.doc_status) {
            //     case 1:
            //         dispatch(updatePublishButton({ isPublishShow: true }));
            //         dispatch(updateUnpublishButton({ isUnpublishShow: false }));
            //         dispatch(updateShareButton({ isShareShow: false }));
            //         break;
            //     case 2:
            //         dispatch(updatePublishButton({ isPublishShow: false }));
            //         dispatch(updateUnpublishButton({ isUnpublishShow: true }));
            //         dispatch(updateShareButton({ isShareShow: true }));
            //         break;
            // }

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

        // setDocTitle(e.target.value);
        //  dispatch(updateDocumentTitle({ document_key: documentKey, doc_title: e.target.value }));
    };

    // const onBodyBlur = (value) => {
    //     console.log(value);
    //     dispatch(
    //         documentUpdate({
    //             url: 'document/update-doc/' + docObj.doc_key,
    //             navigate,
    //             data: {
    //                 doc_body: value
    //             },
    //             extraData: {}
    //         })
    //     );
    // };

    const onBodyChange = (value) => {
        setDocBody(value);
        bodyText = value;
    };

    let quillRef = null;
    let reactQuillRef = null;
    let isQuillText = false;

    const colors = [
        '#F47F66',
        '#99A85A',
        '#5AA886',
        '#4BADAA',
        '#C9D5A5',
        '#656B9C',
        '#9068A7',
        '#C682B6',
        '#A24C6F',
        '#D09C8F',
        '#7AB5C8'
    ];

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

    const [MousePosition, setMousePosition] = useState({
        left: 0,
        top: 0
    });

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
        if (!userInfo) {
            navigate('/login');
        }

        attachQuillRefs();
        getDocumentDetails();

        dispatch(documentDetails({ url: `document/${documentKey}` }));
        const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
        dispatch(collectionList({ url }));

        // console.log(userInfo.first_name + ' document key is : ' + documentKey);
        // console.log('Executing useEffect...');

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(process.env.REACT_APP_WEB_SOCKET_URL, documentKey, ydoc);
        const ytext = ydoc.getText('quill');
        // ytext.insert(0, 'my string');
        dispatch({ type: SET_LOADER, loader: true });
        setTimeout(() => {
            // console.log(ytext);
            // console.log(ytext.toString());

            // let quillObj = JSON.stringify(ydoc);
            // console.log(quillObj);
            // if (JSON.parse(quillObj).quill) {
            //     quillText = JSON.parse(quillObj).quill;
            // }
            // console.log(JSON.parse(quillObj).quill);
            // console.log(ytext.toJSON().length);

            if (ytext.toJSON().length > 0) {
                isQuillText = true;
            } else {
                isQuillText = false;
            }
            new QuillBinding(ytext, quillRef, provider.awareness);

            // if (provider.wsconnected) {
            //     if (ytext.toJSON().length > 0) {
            //         setIsQuillText(true);
            //         new QuillBinding(ytext, quillRef, provider.awareness);
            //     } else {
            //         if (bodyText) {
            //             ytext.insert(0, bodyText);
            //             const state = Y.encodeStateAsUpdateV2(ytext.ydoc);
            //             Y.applyUpdate(ydoc, state);
            //         }

            //         new QuillBinding(ytext, quillRef, provider.awareness);
            //         setIsQuillText(false);
            //     }
            // } else {
            //     setIsQuillText(false);
            // }

            //new QuillBinding(ytext, quillRef, provider.awareness);
            dispatch({ type: SET_LOADER, loader: false });
        }, 1000);

        provider.awareness.on('change', ({ added, removed, updated }) => {
            // console.log('state updated:', updated);
            // console.log('awareness object', provider.awareness);
            // console.log('awareness object getStates()', provider.awareness.getStates());

            // const memberCount = provider.awareness.getStates().size;
            // console.log('Number of members:', memberCount);
            // console.log('connected users:', added);
            // console.log('disconnected users:', removed);
            // console.log('====================');
            const users = [];
            for (const [clientId, state] of provider.awareness.getStates()) {
                const user = state.user;
                users.push(user);
            }
            // console.log('Connected users:', users);
        });

        provider.awareness.setLocalStateField('user', {
            name: userInfo.first_name,
            color: getRamndomColors()
        });

        return () => {
            // Clean up Yjs document
            provider.disconnect();
            //binding.destroy();
            ydoc.destroy();
        };
    }, [navigate, userInfo, documentKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            // if (typeof reactQuillRef.getEditor !== 'function') return;
            // quillRef = reactQuillRef.getEditor();
            // quillRef.getModule();
            // quillRef.on('editor-change', function (eventName) {
            //     if (eventName === 'text-change') {
            //         console.log(docBody);
            //         console.log(docTitle);
            //         if (docBody || docTitle) handleSubmit();
            //         console.log('changed data');
            //     } else if (eventName === 'selection-change') {
            //         // args[0] will be old range
            //     }
            // });
            if (docBody || docTitle) handleSubmit();
        }, 60 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, [docBody, docTitle]);

    useEffect(() => {
        // console.log(docData);
    }, [docData]);

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

    // //////////////////////////////// share dialog ///////////////////
    // const [openShareDialog, setOpenShareDialog] = useState(false);

    // const handleClickOpenShareDialog = () => {
    //     const clientURL = process.env.REACT_APP_PUBLICSITE_BASEURL;
    //     setOpenShareDialog(true);
    //     setShareLnk(clientURL + 'document/' + docObj.doc_key);
    // };

    // const handleCloseShareDialog = () => {
    //     setOpenShareDialog(false);
    // };

    // const handleDocPublish = (status) => {
    //     dispatch(
    //         documentUpdate({
    //             url: 'document/update-status/' + docObj.doc_key,
    //             navigate,
    //             dispatch,
    //             data: {
    //                 doc_status: status
    //             },
    //             extraData: {
    //                 status: 'publish',
    //                 doc_url: '/document/' + docObj.doc_key
    //             }
    //         })
    //     );

    //     // if (status == 1) {
    //     //     setPublishShow(true);
    //     //     setUnpublishShow(false);
    //     // }
    //     // if (status == 2) {
    //     //     setPublishShow(false);
    //     //     setUnpublishShow(true);
    //     // }

    //     setTimeout(() => {
    //         const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
    //         dispatch(collectionList({ url }));
    //     }, 500);
    // };

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

    //////////////////////////////// delete confirmation /////////
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

    /////////////////// get file name/////////

    return (
        <>
            <MainCard title="" onMouseLeave={(ev) => handleMouseLeave(ev)}>
                {/* <Box sx={{ m: 1 }} style={{ float: 'right' }}>
                    <Stack direction="row" spacing={1}>
                        {deleteShow && (
                            <Button onClick={handleClickOpenShareDialog} variant="outlined" size="small">
                                Share
                            </Button>
                        )}
                        {docObj != null && (
                            <>
                                {publishShow && (
                                    <Button onClick={() => handleDocPublish(2)} variant="outlined" size="small">
                                        Publish
                                    </Button>
                                )}
                                {unpublishShow && (
                                    <Button onClick={() => handleDocPublish(1)} variant="outlined" size="small">
                                        Unpublish
                                    </Button>
                                )}
                                {deleteShow && (
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
                            </>
                        )}
                    </Stack>
                </Box> */}
                {docData != null && (
                    <Box sx={{ m: 1 }} style={{ float: 'right' }}>
                        <Stack direction="row" spacing={1}>
                            {docData.attachments.map((item, index) => (
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
                        {/* <ReactQuill
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
                        /> */}

                        {isQuillText == true ? (
                            <ReactQuill
                                ref={(el) => {
                                    reactQuillRef = el;
                                }}
                                bounds=".editor-container"
                                theme="bubble"
                                onChange={onBodyChange}
                                // onBlur={(range, source, quill) => {
                                //     onBodyBlur(quill.getHTML());
                                // }}
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
                                // onBlur={(range, source, quill) => {
                                //     onBodyBlur(quill.getHTML());
                                // }}
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
            {/* <ShareDialog link={sharelink} open={openShareDialog} handleClose={handleCloseShareDialog} /> */}
            <LoadingBar color="#8800ff" progress={progress} onLoaderFinished={() => setProgress(0)} />
        </>
    );
};

export default Document;
