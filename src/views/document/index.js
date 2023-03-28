// material-ui
import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails, documentFileDelete } from 'store/features/document/documentActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import API from 'helpers/jwt.interceptor';
import { Quill } from 'react-quill';
//import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import * as Y from 'yjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactQuill from 'react-quill';
import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { colors } from 'ui-component/colors';
import Fab from '@mui/material/Fab';
// assets
import { IconDeviceFloppy } from '@tabler/icons';

import { TextField, Typography, Box, IconButton, Stack, useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
// third party
import { format } from 'date-fns';

import DescriptionIcon from '@mui/icons-material/Description';
import { updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentUpdate, documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import { updateDoc, updateDocId } from 'store/features/header/headerSlice';
import { SET_LOADER } from 'store/actions';
import ContextMenuDocumentFile from 'layout/components/contextMenuDocumentFile';
import ReactTimeAgo from 'react-time-ago';
import ContextMenuEditor from 'layout/components/contextMenuEditor';
import IconPdf from 'ui-component/custom-icon/IconPdf';
import IconXls from 'ui-component/custom-icon/IconXls';
import IconDocx from 'ui-component/custom-icon/IconDocx';
import IconPptx from 'ui-component/custom-icon/IconPptx';
import IconImg from 'ui-component/custom-icon/IconImg';
import IconGif from 'ui-component/custom-icon/IconGif';

const Document = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const docData = useSelector((state) => state.document.data);
    const navigate = useNavigate();
    const { documentKey } = useParams();
    const [docObj, setDocObj] = useState(null);
    const [docTitle, setDocTitle] = useState('');
    const [docBody, setDocBody] = useState('');
    const [progress, setProgress] = useState(0);
    const [isQuillText, setIsQuillText] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selection, setSelection] = useState(null);
    const [content, setContent] = useState('');
    let bodyText = '';
    const side = 300;
    const padding = 80;
    const margin = 100;

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
    //let isQuillText = true;

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

        // Add event listeners for mouseover and mouseout
        const quillContainer = quillRef.container;
        quillContainer.addEventListener('mouseover', (event) => {
            const targetElement = event.target;
            if (
                targetElement.tagName === 'H1' ||
                targetElement.tagName === 'H2' ||
                targetElement.tagName === 'H3' ||
                targetElement.tagName === 'H4' ||
                targetElement.tagName === 'H5' ||
                targetElement.tagName === 'H6' ||
                targetElement.tagName === 'LI' ||
                targetElement.tagName === 'P'
            ) {
                switch (targetElement.innerText) {
                    case '\n':
                        break;
                    case ' ':
                        break;

                    default:
                        targetElement.classList.add('hand-cursor');
                        break;
                }
            }
        });

        quillContainer.addEventListener('mouseout', (event) => {
            const targetElement = event.target;
            if (
                targetElement.tagName === 'H1' ||
                targetElement.tagName === 'H2' ||
                targetElement.tagName === 'H3' ||
                targetElement.tagName === 'H4' ||
                targetElement.tagName === 'H5' ||
                targetElement.tagName === 'H6' ||
                targetElement.tagName === 'LI' ||
                targetElement.tagName === 'P'
            ) {
                targetElement.classList.remove('hand-cursor'); // remove the CSS class
            }
        });

        quillContainer.addEventListener('mousedown', (event) => {
            const targetElement = event.target;
            if (
                targetElement.tagName === 'H1' ||
                targetElement.tagName === 'H2' ||
                targetElement.tagName === 'H3' ||
                targetElement.tagName === 'H4' ||
                targetElement.tagName === 'H5' ||
                targetElement.tagName === 'H6' ||
                targetElement.tagName === 'LI' ||
                targetElement.tagName === 'P'
            ) {
                targetElement.setAttribute('draggable', 'true');
                const selection = window.getSelection();
                selection.removeAllRanges();
                const range = document.createRange();
                range.selectNodeContents(targetElement);
                selection.addRange(range);
            }
        });

        quillRef.keyboard.addBinding(
            {
                key: 191,
                offset: 0
            },
            function (ranges, contexts) {
                setRange(ranges);
                setContext(contexts);
                const selection = quillRef.getSelection();
                if (selection) {
                    quillRef.insertText(selection.index, '/');
                    const bounds = quillRef.getBounds(selection.index);
                    const editorEl = quillRef.container;
                    const editorBounds = editorEl.getBoundingClientRect();
                    setMenuPosition({
                        top: editorBounds.top + bounds.bottom,
                        left: editorBounds.left + bounds.left + 10
                    });
                    handleEditorContextMenuPress();
                    quillRef.focus();
                }

                //this.quill.formatText(range, 'bold', true);
            }
        );
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
        getDocumentDetails();
        attachQuillRefs();

        dispatch(documentDetails({ url: `document/${documentKey}` }));
        const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
        dispatch(collectionList({ url }));

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(process.env.REACT_APP_WEB_SOCKET_URL, documentKey, ydoc);
        const ytext = ydoc.getText('quill');

        dispatch({ type: SET_LOADER, loader: true });
        setTimeout(() => {
            if (ytext.toJSON().length > 0) {
                setIsQuillText(true);
            } else {
                setIsQuillText(false);
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
        right: 36
    };

    //////////////////////////// editor context menu //////////////////////////////

    const [menuPosition, setMenuPosition] = useState(null);
    const [range, setRange] = useState(null);
    const [context, setContext] = useState(null);
    const [editorAnchorEl, setEditorAnchorEl] = useState(false);
    const openEditorContextMenu = Boolean(editorAnchorEl);
    const handleEditorContextMenuPress = () => {
        setEditorAnchorEl(true);
    };
    const handleEditorContextMenuClose = () => {
        setEditorAnchorEl(false);
        setRange(null);
        setContext(null);

        // if (selection) {
        //     // quillRef.deleteText(selection.index, 1);
        //     // setMenuPosition(null);
        //     quillRef.focus();
        // }
    };

    const handleEditorOnEnter = (values) => {
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();

        switch (values) {
            case 'h1':
                quillRef.formatLine(range.index, 1, 'header', '1');
                break;
            case 'h2':
                quillRef.formatLine(range.index, 1, 'header', '2');
                break;
            case 'h3':
                quillRef.formatLine(range.index, 1, 'header', '3');
                break;
            case 'bullet':
                quillRef.formatLine(range.index, 1, 'list', 'bullet');
                break;
            case 'ordered':
                quillRef.formatLine(range.index, 1, 'list', 'ordered');
                break;
        }

        // setTimeout(() => {
        //     quillRef.deleteText(range.index - 1, 1);
        //     quillRef.focus();
        // }, 500);
        //   // apply bullet formatting to the line
        //   this.quill.formatLine(range.index, 1, 'list', 'bullet');

        handleEditorContextMenuClose();
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

    /////////////////////////////////// drag and drop //////////////////

    useEffect(() => {
        const quillContainer = quillRef.container;
        // Add event listeners to the document to track when elements are being dragged
        quillContainer.addEventListener('dragstart', handleDragStart);
        quillContainer.addEventListener('drop', handleDrop);

        return () => {
            // Clean up the event listeners when the component is unmounted
            quillContainer.removeEventListener('dragstart', handleDragStart);
            quillContainer.removeEventListener('drop', handleDrop);
        };
    }, []);

    const handleDragStart = (event) => {
        console.log('dragstart');
        // console.log(event.target.parentNode);
        // const tagName = event.target.tagName.toLowerCase();
        // // Only allow dragging of h1 and p tags
        // if (tagName === 'h1' || tagName === 'p') {
        //     // Set the data that will be passed when the element is dropped
        //     // event.dataTransfer.setData('text/html', event.target.outerHTML);
        //     event.dataTransfer.setData('text/html', event.target.parentNode);
        // }
    };

    const handleDrop = (event) => {
        console.log('drop');
        // console.log(event.target.parentNode);
        // const tagName = event.target.tagName.toLowerCase();
        // // Only allow dragging of h1 and p tags
        // if (tagName === 'h1' || tagName === 'p') {
        //     // Set the data that will be passed when the element is dropped
        //     // event.dataTransfer.setData('text/html', event.target.outerHTML);
        //     event.dataTransfer.setData('text/html', event.target.parentNode);
        // }
    };

    /////////////////////////////////// drag and drop //////////////////
    return (
        <>
            <MainCard title="" onMouseLeave={(ev) => handleMouseLeave(ev)}>
                {/* <h1 draggable={true} onDragStart={handleDragStart}>
                    Heading
                </h1>
                <p draggable={true} onDragStart={handleDragStart}>
                    Paragraph
                </p> */}

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
                                        {(() => {
                                            switch (item.file_extension) {
                                                case '.pdf':
                                                    return <IconPdf fontSize="inherit" />;
                                                case '.xls':
                                                    return <IconXls fontSize="inherit" />;
                                                case '.xlsx':
                                                    return <IconXls fontSize="inherit" />;
                                                case '.doc':
                                                    return <IconDocx fontSize="inherit" />;
                                                case '.docx':
                                                    return <IconDocx fontSize="inherit" />;
                                                case '.ppt':
                                                    return <IconPptx fontSize="inherit" />;
                                                case '.pptx':
                                                    return <IconPptx fontSize="inherit" />;
                                                case '.jpg':
                                                    return <IconImg fontSize="inherit" />;
                                                case '.jpeg':
                                                    return <IconImg fontSize="inherit" />;
                                                case '.png':
                                                    return <IconImg fontSize="inherit" />;
                                                case '.gif':
                                                    return <IconGif fontSize="inherit" />;
                                                default:
                                                    return <DescriptionIcon fontSize="inherit" />;
                                            }
                                        })()}
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
                    {docData != null && (
                        <Typography sx={{ pt: 1 }} variant="body2" style={{ color: 'rgb(155, 166, 178)', fontStyle: 'italic' }}>
                            Last updated at {format(Date.parse(docData.updated_at), 'dd/LL/yyyy hh:mm a')}
                            {/* Updated {docData && <ReactTimeAgo date={Date.parse(docData.updated_at)} locale="en-US" />} */}
                        </Typography>
                    )}

                    <div className="editor-container">
                        <EditorToolbar toolbarId={'t1'} />
                        {isQuillText == true ? (
                            <ReactQuill
                                ref={(el) => {
                                    reactQuillRef = el;
                                }}
                                className="quill-editor"
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
                                className="quill-editor"
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

            <ContextMenuEditor
                anchorPosition={menuPosition}
                quill={quillRef}
                open={editorAnchorEl}
                handleClose={handleEditorContextMenuClose}
                handleEditorOnEnter={(values) => handleEditorOnEnter(values)}
            />

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
