// material-ui
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails } from 'store/features/document/documentActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import API from 'helpers/jwt.interceptor';

import { WebrtcProvider } from 'y-webrtc';
import { QuillBinding } from 'y-quill';
import { Quill } from 'react-quill';
import QuillCursors from 'quill-cursors';
import * as Y from 'yjs';
import ReactQuill from 'react-quill';
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
    useMediaQuery
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// ==============================|| PAGE ||============================== //

const Document = () => {
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    const { documentKey } = useParams();

    const [docTitle, setDocTitle] = useState('');
    const [docBody, setDocBody] = useState('');

    const getDocumentDetails = async () => {
        const res = await API.get(`document/${documentKey}`);
        const doc = res.data.data;

        setDocTitle(doc.doc_title);
        setDocBody(doc.doc_body);
    };

    const onTitleChange = (e) => {
        setDocTitle(e.target.value);
    };
    const onBodyChange = (value) => {
        setDocBody(value);
    };

    let quillRef = null;
    let reactQuillRef = null;
    // Quill.register('modules/cursors', QuillCursors);

    const attachQuillRefs = () => {
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
        quillRef.getModule();
    };

    // const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(() => {
        // const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=5`;
        // dispatch(collectionList({ url }));

        attachQuillRefs();
        getDocumentDetails();
        // const ydoc = new Y.Doc();
        // const provider = new WebrtcProvider('ws://localhost:3000/document/', ydoc);
        // const ytext = ydoc.getText('quill');
        // new QuillBinding(ytext, quillRef, provider.awareness);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentKey]);

    const handleSubmit = async () => {
        try {
            const res = await API.patch(`document/update-doc/${documentKey}`, {
                doc_title: docTitle,
                doc_body: docBody
            });
        } catch (error) {
            throw error;
        }
    };

    const fabStyle = {
        position: 'absolute',
        bottom: '50%',
        right: 16
    };

    return (
        <>
            <MainCard title="">
                <form>
                    <TextField
                        inputProps={{ style: { fontSize: 40, fontWeight: 600 } }}
                        fullWidth
                        id="standard-basic"
                        className="title-text"
                        value={docTitle}
                        onChange={onTitleChange}
                        name="docTitle"
                        label=""
                        variant="standard"
                    />
                    {/* <div className="editor-container1">
                        <EditorToolbar toolbarId={'t1'} />
                        <ReactQuill
                            ref={(el) => {
                                reactQuillRef = el;
                            }}
                            bounds=".editor-container1"
                            theme="bubble"
                            value={docTitle}
                            onChange={onTitleChange}
                            placeholder={'Write something here...'}
                            formats={formats}
                            modules={modules('t1')}
                        />
                    </div> */}
                    <div className="editor-container">
                        <EditorToolbar toolbarId={'t1'} />
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
                    </div>
                    {/* <Box sx={{ mt: 2 }}>
                        <AnimateButton>
                            <Button type="submit" fullWidth size="large" variant="contained" color="secondary">
                                Submit
                            </Button>
                        </AnimateButton>
                    </Box> */}
                </form>

                <Fab sx={fabStyle} onClick={handleSubmit} aria-label="Save" color="primary">
                    <IconDeviceFloppy />
                </Fab>
            </MainCard>
        </>
    );
};

export default Document;
