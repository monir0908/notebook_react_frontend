// material-ui
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails } from 'store/features/document/documentActions';
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
import { styled, useTheme } from '@mui/material/styles';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { IconPlus, IconTrash } from '@tabler/icons';
import DeleteIcon from '@mui/icons-material/Delete';
import { updateDocumentName, updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ShareDialog from 'layout/components/shareDialog';

// ==============================|| PAGE ||============================== //

const Document = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const navigate = useNavigate();
    const { documentKey } = useParams();
    const [docObj, setDocObj] = useState(null);
    const [publishShow, setPublishShow] = useState(false);
    const [unpublishShow, setUnpublishShow] = useState(false);
    const [sharelink, setShareLnk] = useState('');
    const [deleteShow, setDeleteShow] = useState(true);
    const [docTitle, setDocTitle] = useState('');
    const [docBody, setDocBody] = useState('');
    const [progress, setProgress] = useState(0);

    const getDocumentDetails = async () => {
        const res = await API.get(`document/${documentKey}`);

        let doc = res.data.data;
        setDocObj(doc);
        setDocTitle(doc.doc_title);
        setDocBody(doc.doc_body);

        if (doc.doc_status == 1) {
            setPublishShow(true);
            setUnpublishShow(false);
        }
        if (doc.doc_status == 2) {
            setPublishShow(false);
            setUnpublishShow(true);
        }
        if (doc.doc_status == 3 || doc.doc_status == 4) {
            setDeleteShow(false);
            setPublishShow(false);
            setUnpublishShow(false);
        } else {
            setDeleteShow(true);
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

    const onBodyChange = (value) => {
        setDocBody(value);
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
    useEffect(() => {
        attachQuillRefs();
        getDocumentDetails();
        const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
        dispatch(collectionList({ url }));

        // console.log(userInfo.first_name + ' document key is : ' + documentKey);
        // console.log('Executing useEffect...');

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider('ws://localhost:1234', documentKey, ydoc);
        const ytext = ydoc.getText('quill');
        // ytext.insert(0, 'my string');
        let binding = null;

        setTimeout(() => {
            // console.log(ytext);
            // console.log(ytext.toString());

            // let quillObj = JSON.stringify(ydoc);
            // console.log(quillObj);
            // if (JSON.parse(quillObj).quill) {
            //     quillText = JSON.parse(quillObj).quill;
            // }
            // console.log(quillText);
            if (ytext.toJSON().length > 0) isQuillText = true;
            binding = new QuillBinding(ytext, quillRef, provider.awareness);
        }, 500);

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
    }, [documentKey]);

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
        return () => clearInterval(interval);
    }, [docBody, docTitle]);

    const handleSubmit = async () => {
        try {
            console.log(docBody);
            const res = await API.patch(`document/update-doc/${documentKey}`, {
                doc_title: docTitle,
                doc_body: docBody
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

    //////////////////////////////// share dialog ///////////////////
    const [openShareDialog, setOpenShareDialog] = useState(false);

    const handleClickOpenShareDialog = () => {
        const clientURL = process.env.REACT_APP_PUBLICSITE_BASEURL;
        setOpenShareDialog(true);
        setShareLnk(clientURL + 'document/' + docObj.doc_key);
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
                url: 'document/update-status/' + docObj.doc_key,
                navigate,
                data: {
                    doc_status: 3
                },
                extraData: {
                    status: 'delete',
                    doc_url: '/document/' + docObj.doc_key
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
        dispatch(
            documentUpdate({
                url: 'document/update-status/' + docObj.doc_key,
                navigate,
                data: {
                    doc_status: status
                },
                extraData: {
                    status: 'publish',
                    doc_url: '/document/' + docObj.doc_key
                }
            })
        );

        if (status == 1) {
            setPublishShow(true);
            setUnpublishShow(false);
        }
        if (status == 2) {
            setPublishShow(false);
            setUnpublishShow(true);
        }

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    return (
        <>
            <MainCard title="">
                <Box sx={{ m: 1 }} style={{ float: 'right' }}>
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
                </Box>
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

            <ConfirmationDialog
                title="Delete Decument"
                description="If you delete this document,it will be moved to trash . Do you agree with that?"
                open={openConfirmation}
                handleClose={handleCloseConfirmation}
                handleOk={handleConfirmationDialogOk}
            />
            <ShareDialog link={sharelink} open={openShareDialog} handleClose={handleCloseShareDialog} />
            <LoadingBar color="#8800ff" progress={progress} onLoaderFinished={() => setProgress(0)} />
        </>
    );
};

export default Document;
