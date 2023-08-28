// material-ui
import React, { useState, useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails, documentFileDelete } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import API from 'helpers/jwt.interceptor';
import ReactQuill, { Quill } from 'react-quill';
//import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import * as Y from 'yjs';

import EditorToolbar, { modules, formats } from './EditorToolbar';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import { colors } from 'ui-component/colors';
// assets
import { TextField, Grid, Typography, Box, IconButton, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// third party
import { format } from 'date-fns';

import DescriptionIcon from '@mui/icons-material/Description';
import { updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import ErrorDialog from 'layout/components/errorDialog';
import { documentUpdateOnEditorLeave } from 'store/features/document/documentActions';
import { updateDoc, updateDocId } from 'store/features/header/headerSlice';
import { SET_LOADER } from 'store/actions';
import ContextMenuDocumentFile from 'layout/components/contextMenuDocumentFile';
import ContextMenuEditor from 'layout/components/contextMenuEditor';
import { updateViewers } from 'store/features/header/headerSlice';
import IconPdf from 'ui-component/custom-icon/IconPdf';
import IconXls from 'ui-component/custom-icon/IconXls';
import IconDocx from 'ui-component/custom-icon/IconDocx';
import IconPptx from 'ui-component/custom-icon/IconPptx';
import IconImg from 'ui-component/custom-icon/IconImg';
import IconGif from 'ui-component/custom-icon/IconGif';

const Document = () => {
    const dispatch = useDispatch();
    const { doc } = useSelector((state) => state.header);
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const docData = useSelector((state) => state.document.data);
    const { viewers } = useSelector((state) => state.header);
    const navigate = useNavigate();
    const { documentKey } = useParams();
    const [docObj, setDocObj] = useState(null);
    const [docBody, setDocBody] = useState('');
    const [progress, setProgress] = useState(0);
    const [isQuillText, setIsQuillText] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [docTitle, setDocTitle] = useState('');
    const [isDocPage, setIsDocPage] = useState(false);
    let currentUrl = location.pathname;
    const urlArr = currentUrl.split('/');
    let bodyText = '';

    let selectedElement = null;
    let boundingRect = null;
    const getDocumentDetails = async () => {
        const res = await API.get(`document/${documentKey}`);
        console.log('doc details res', res);
        if (res) {
            let doc = res.data.data;
            setDocObj(doc);
            dispatch(updateDocId({ doc_id: doc.doc_key }));
            dispatch(updateDoc({ doc: doc }));
            setDocBody(doc.doc_body);
            bodyText = doc.doc_body;
        }
    };

    const onBodyChange = (value) => {
        setDocBody(value);
        bodyText = value;
    };

    let quillRef = null;
    let reactQuillRef = null;

    const getRamndomColors = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const attachQuillRefs = () => {
        if (reactQuillRef == null) return;
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
        const quillContainer = quillRef.container;

        window.addEventListener('scroll', function () {
            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
            });
            const selection = quillRef.getSelection();
            if (selection) {
                const bounds = quillRef.getBounds(selection.index);
                const editorEl = quillRef.container;
                const editorBounds = editorEl.getBoundingClientRect();
                const top = editorBounds.top + bounds.bottom;
                const tooltipEl = document.querySelector('.ql-tooltip');

                if (top > 100 && top < 500) {
                    tooltipEl.style.zIndex = 1101;
                } else {
                    tooltipEl.style.zIndex = '';
                }
            }
        });

        quillContainer.addEventListener('mouseover', (event) => {
            const containerBoundingRect = quillContainer.getBoundingClientRect();
            const targetElement = event.target;
            const hoverDiv = document.createElement('div');
            hoverDiv.style.left = -10;
            const fromElement = event.fromElement;
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
                targetElement.addEventListener('mouseenter', (ev) => {
                    if (targetElement.innerText == '\n') {
                        quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                            div.remove();
                        });
                    } else if (targetElement.innerText == ' ') {
                        quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                            div.remove();
                        });
                    } else if (targetElement.innerText == '&#xFEFF;') {
                        quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                            div.remove();
                        });
                    } else if (targetElement.innerText) {
                        if (targetElement.querySelector('img') == null) {
                            selectedElement = targetElement;
                            hoverDiv.classList.add('hover-div');
                            if (targetElement.tagName === 'SPAN') {
                                boundingRect = fromElement.getBoundingClientRect();
                            } else {
                                boundingRect = targetElement.getBoundingClientRect();
                            }

                            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                                div.remove();
                            });
                            let extraTop = 0;

                            if (targetElement.tagName === 'H1') {
                                extraTop = 12;
                                hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top + extraTop}px`;
                            } else if (targetElement.tagName === 'H2') {
                                extraTop = 8;
                                hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top + extraTop}px`;
                            } else if (targetElement.tagName === 'H3') {
                                extraTop = 6;
                                hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top + extraTop}px`;
                            } else if (targetElement.tagName === 'LI') {
                                extraTop = 7;
                                hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top + extraTop}px`;
                            } else if (targetElement.tagName === 'P') {
                                extraTop = 8;
                                hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top + extraTop}px`;
                            }

                            hoverDiv.style.cursor = 'grab';

                            if (targetElement.tagName === 'LI') {
                                if (targetElement.classList.contains('ql-indent-1')) {
                                    hoverDiv.style.left = '20px';
                                } else if (targetElement.classList.contains('ql-indent-2')) {
                                    hoverDiv.style.left = '45px';
                                } else if (targetElement.classList.contains('ql-indent-3')) {
                                    hoverDiv.style.left = '60px';
                                } else if (targetElement.classList.contains('ql-indent-4')) {
                                    hoverDiv.style.left = '90px';
                                } else if (targetElement.classList.contains('ql-indent-5')) {
                                    hoverDiv.style.left = '110px';
                                } else if (targetElement.classList.contains('ql-indent-6')) {
                                    hoverDiv.style.left = '130px';
                                } else if (targetElement.classList.contains('ql-indent-7')) {
                                    hoverDiv.style.left = '150px';
                                } else {
                                    hoverDiv.style.left = '3px';
                                }
                            } else {
                                hoverDiv.style.left = '-10px';
                            }

                            quillContainer.appendChild(hoverDiv);
                        }
                    }
                });
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
                targetElement.tagName === 'EM' ||
                targetElement.tagName === 'STRONG'
            ) {
                targetElement.classList.remove('hand-cursor'); // remove the CSS class
                targetElement.removeAttribute('draggable');
                quillContainer.querySelectorAll('.pointer-div').forEach((div) => {
                    div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
                });
            }
        });

        let pressTimer;
        quillContainer.addEventListener('mousedown', (event) => {
            const tooltipEl = document.querySelector('.ql-tooltip');
            tooltipEl.style.zIndex = 1101;

            let userAgentString = navigator.userAgent;
            let firefoxAgent = userAgentString.indexOf('Firefox') > -1;
            if (!firefoxAgent) {
                pressTimer = setTimeout(() => {
                    mouseDownEvent(event.target);
                }, 100);
            } else {
                mouseDownEvent(event.target);
            }
        });

        const mouseDownEvent = (targetEle) => {
            const targetElement = targetEle;
            // const dataBlockId = targetElement.dataset.blockId;

            if (targetElement.classList.contains('hover-div')) {
                // Do something on mousedown of hover-div with data-block-id=1
                targetElement.style.cursor = 'grabbing';
                targetElement.setAttribute('draggable', 'true');

                const selection = window.getSelection();
                selection.removeAllRanges();
                const range = document.createRange();
                range.selectNodeContents(selectedElement);
                selection.addRange(range);

                targetElement.addEventListener('dragstart', (event) => {
                    event.dataTransfer.effectAllowed = 'move';
                    targetElement.style.cursor = 'grabbing';

                    if (selectedElement.tagName === 'LI') {
                        const ul = document.createElement('ul');
                        const li = document.createElement('li');
                        li.innerHTML = selectedElement.innerHTML;
                        ul.appendChild(li);

                        event.dataTransfer.setData('text/html', ul.outerHTML); // set the HTML data
                    } else {
                        event.dataTransfer.setData('text/html', selectedElement.outerHTML);
                    }

                    event.dataTransfer.setDragImage(selectedElement, 0, 0);
                });
            }
        };

        quillContainer.addEventListener('mouseup', (event) => {
            clearTimeout(pressTimer);
            const targetElement = event.target;
            if (targetElement.classList.contains('hover-div')) {
                targetElement.style.cursor = 'grab';
                targetElement.removeAttribute('draggable');
            }

            if (selectedElement) selectedElement.removeAttribute('draggable');
        });

        const removePointerDivs = () => {
            quillContainer.querySelectorAll('.pointer-div').forEach((div) => {
                div.remove();
            });
        };

        quillContainer.addEventListener('dragover', (event) => {
            event.preventDefault();
            const targetElement = event.target;
            if (event.dataTransfer.types.includes('text/html')) {
                if (
                    targetElement.tagName === 'H1' ||
                    targetElement.tagName === 'H2' ||
                    targetElement.tagName === 'H3' ||
                    targetElement.tagName === 'H4' ||
                    targetElement.tagName === 'H5' ||
                    targetElement.tagName === 'H6' ||
                    targetElement.tagName === 'LI' ||
                    targetElement.tagName === 'P' ||
                    targetElement.tagName === 'UL'
                ) {
                    if (targetElement.tagName == 'LI' || selectedElement.tagName == 'LI') {
                        if (targetElement.tagName == selectedElement.tagName) {
                            removePointerDivs();
                            pointerDiv(event.clientY, targetElement);
                        } else {
                            return;
                        }
                    } else {
                        removePointerDivs();
                        pointerDiv(event.clientY, targetElement);
                    }
                } else {
                    removePointerDivs();
                }
            } else {
                removePointerDivs();
            }
        });

        quillContainer.addEventListener('dragenter', (event) => {
            event.preventDefault();
        });

        quillContainer.addEventListener('drop', (event) => {
            event.preventDefault();
            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
            });

            const targetElement = event.target;

            // Check if the dropped element is an image
            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                return; // Do nothing if the dropped item is an image
            } else if (targetElement.tagName === 'SPAN') {
                return;
            } else if (
                targetElement.tagName === 'H1' ||
                targetElement.tagName === 'H2' ||
                targetElement.tagName === 'H3' ||
                targetElement.tagName === 'H4' ||
                targetElement.tagName === 'H5' ||
                targetElement.tagName === 'H6' ||
                targetElement.tagName === 'LI' ||
                targetElement.tagName === 'P'
            ) {
                if (targetElement.tagName == 'LI' || selectedElement.tagName == 'LI') {
                    if (targetElement.tagName == selectedElement.tagName) {
                        const dropPosition = getDropPosition(event.clientY, targetElement);

                        // Check if the target element is a text node and get its parent element if it is
                        if (targetElement.nodeType === Node.TEXT_NODE) {
                            targetElement = targetElement.parentNode;
                        }

                        // Add your custom code to create the new element here
                        if (dropPosition === 'before') {
                            targetElement.parentNode.insertBefore(selectedElement, targetElement);
                        } else {
                            targetElement.parentNode.insertBefore(selectedElement, targetElement.nextSibling);
                        }

                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        const range = document.createRange();
                        range.selectNodeContents(selectedElement);
                        selection.addRange(range);
                    } else {
                        return;
                    }
                } else {
                    const dropPosition = getDropPosition(event.clientY, targetElement);

                    // Check if the target element is a text node and get its parent element if it is
                    if (targetElement.nodeType === Node.TEXT_NODE) {
                        targetElement = targetElement.parentNode;
                    }

                    // Add your custom code to create the new element here
                    if (dropPosition === 'before') {
                        targetElement.parentNode.insertBefore(selectedElement, targetElement);
                    } else {
                        targetElement.parentNode.insertBefore(selectedElement, targetElement.nextSibling);
                    }

                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    const range = document.createRange();
                    range.selectNodeContents(selectedElement);
                    selection.addRange(range);
                }
            }

            quillContainer.querySelector('.pointer-div').remove();
        });

        const pointerDiv = (clientY, targetElement) => {
            const pointerDiv = document.createElement('hr');
            pointerDiv.classList.add('pointer-div');
            pointerDiv.style.position = 'absolute';
            pointerDiv.style.zIndex = 999;
            pointerDiv.style.pointerEvents = 'none';
            pointerDiv.style.left = '10px';
            pointerDiv.style.width = '100%';
            pointerDiv.style.borderTop = '3px solid rgb(35,131,226,0.43)';
            const containerBoundingRect = quillContainer.getBoundingClientRect();

            if (targetElement != selectedElement) {
                if (targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height / 2 < clientY) {
                    pointerDiv.style.top = `${
                        targetElement.getBoundingClientRect().top -
                        8 -
                        containerBoundingRect.top +
                        targetElement.getBoundingClientRect().height
                    }px`;
                    quillContainer.appendChild(pointerDiv);
                } else {
                    if (targetElement.getBoundingClientRect().top != selectedElement.nextSibling.getBoundingClientRect().top) {
                        pointerDiv.style.top = `${targetElement.getBoundingClientRect().top - 8 - containerBoundingRect.top}px`;
                        quillContainer.appendChild(pointerDiv);
                    }
                }
            }
        };

        const getDropPosition = (clientY, targetElement) => {
            if (targetElement.getBoundingClientRect().top + targetElement.getBoundingClientRect().height / 2 < clientY) {
                return 'after';
            } else {
                return 'before';
            }
        };

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
                }
            }
        );

        let tooltip = quillRef.theme.tooltip;
        let input = tooltip.root.querySelector('input[data-link]');
        input.dataset.link = 'https://yourdomain.com';
    };

    const handleMouseLeave = (ev) => {
        if (reactQuillRef == null) return;
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
        const quillContainer = quillRef.container;
        quillContainer.querySelectorAll('.hover-div').forEach((div) => {
            div.remove();
        });

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
        const ytext = ydoc.getText('quill');
        const provider = new WebsocketProvider(process.env.REACT_APP_WEB_SOCKET_URL, documentKey, ydoc);

        dispatch({ type: SET_LOADER, loader: true });
        provider.once('synced', () => {
            if (ytext._length > 0) {
                setIsQuillText(true); //Loading from Ydoc
            } else {
                setIsQuillText(false); //Loading from database
            }
            if (quillRef != null) {
                new QuillBinding(ytext, quillRef, provider.awareness);
            }
            dispatch({ type: SET_LOADER, loader: false });

            provider.awareness.on('change', ({ added, removed, updated }) => {
                const users = [];
                for (const [clientId, state] of provider.awareness.getStates()) {
                    const user = state.user;
                    users.push(user);
                }
            });
        });

        // In every 2 second tries 5 times if any socket connection. If not show modal
        let falseCount = 0;
        const checkWebSocketConnection = setInterval(() => {
            if (!provider.wsconnected) {
                falseCount++;
                if (falseCount === 5) {
                    setOpenErrorDialog(true);
                }
            } else {
                falseCount = 0;
                setOpenErrorDialog(false);
                const users = [];
                for (const [clientId, state] of provider.awareness.getStates()) {
                    users.push(state.user);
                }
                dispatch(updateViewers({ viewers: users }));
            }
        }, 2 * 1000);

        provider.awareness.setLocalStateField('user', {
            name: userInfo.first_name,
            color: getRamndomColors()
        });

        return () => {
            clearInterval(checkWebSocketConnection);
            provider.disconnect();
            ydoc.destroy();

            const quillContainer = quillRef.container;
            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
            });
            const tooltipEl = document.querySelector('.ql-tooltip');
            if (tooltipEl) tooltipEl.style.zIndex = '';
        };
    }, [navigate, userToken, documentKey]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (docBody) handleSubmit();
        }, 60 * 1000);
        return () => {
            clearInterval(interval);
        };
    }, [docBody, selectedElement]);

    useEffect(() => {
        if (urlArr[1] == 'document') {
            setDocTitle(doc.doc_title);
            setIsDocPage(true);
        } else {
            setIsDocPage(false);
        }
    }, [doc]);

    const handleSubmit = async () => {
        try {
            const res = await API.patch(`document/update-doc/${documentKey}`, {
                doc_body: docBody ?? bodyText
            });
            if (res.data.state == 'success') {
                setProgress(100);
            }
        } catch (error) {
            throw error;
        }
    };

    //////////////////////////// editor context menu //////////////////////////////

    const [menuPosition, setMenuPosition] = useState(null);
    const [range, setRange] = useState(null);
    const [context, setContext] = useState(null);
    const [editorAnchorEl, setEditorAnchorEl] = useState(false);
    const handleEditorContextMenuPress = () => {
        setEditorAnchorEl(true);
    };
    const handleEditorContextMenuClose = () => {
        setEditorAnchorEl(false);
        setRange(null);
        setContext(null);
    };

    const handleEditorOnEnter = (values) => {
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();

        switch (values) {
            case 'h1':
                quillRef.deleteText(range.index, 1);
                quillRef.formatLine(range.index, 1, 'header', '1');
                break;
            case 'h2':
                quillRef.deleteText(range.index, 1);
                quillRef.formatLine(range.index, 1, 'header', '2');
                break;
            case 'h3':
                quillRef.deleteText(range.index, 1);
                quillRef.formatLine(range.index, 1, 'header', '3');
                break;
            case 'bullet':
                quillRef.deleteText(range.index, 1);
                quillRef.formatLine(range.index, 1, 'list', 'bullet');
                break;
            case 'ordered':
                quillRef.deleteText(range.index, 1);
                quillRef.formatLine(range.index, 1, 'list', 'ordered');
                break;
        }

        handleEditorContextMenuClose();
    };

    //////////////////////////////// sever error dialog /////////
    const [openErrorDialog, setOpenErrorDialog] = useState(false);

    const handleOpenErrorDialog = () => {
        setOpenErrorDialog(true);
    };

    const handleCloseErrorDialog = () => {
        setOpenErrorDialog(false);
        navigate('/home');
    };
    const handleOkErrorDialog = () => {
        window.location.reload(true);
        setOpenErrorDialog(false);
    };

    const quillStyle = {
        color: 'rgb(0, 0, 0)'
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
            dispatch(documentDetails({ url: `document/${docData.doc_key}` }));
        }, 500);
        setOpenFileConfirmation(false);
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

    return (
        <>
            {isDocPage ? (
                <Grid
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    mt={{ xs: 2, sm: 2, md: 0.5, lg: 0.5, xl: 0.5 }}
                    sx={{
                        width: { xs: '100%', sm: '100%', md: '100%', lg: '1108px', xl: '1108px' }
                    }}
                >
                    <TextField
                        margin="none"
                        InputProps={{
                            disableUnderline: true,

                            style: {}
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
                        sx={{
                            input: {
                                fontSize: { xs: '15px', sm: '28px', md: '32px', lg: '32px', xl: '32px' },
                                fontWeight: 700,
                                lineHeight: '45.76px',
                                ml: { xs: 1.5, sm: 9, md: 2, lg: 3.5, xl: 8.5 },
                                padding: 0,
                                textOverflow: 'ellipsis'
                            }
                        }}
                    />
                </Grid>
            ) : (
                ''
            )}
            <MainCard
                contentSX={{
                    margin: '0 auto',
                    padding: '0px !important',
                    borderRadius: '0px',
                    marginTop: { xs: '0px', sm: '0px', md: '0px', lg: '0px', xl: '0px' }
                }}
                sx={{
                    margin: '0 auto',
                    marginTop: 2,
                    width: { xs: '100%', sm: '600px', md: '720px', lg: '1108px', xl: '1108px' },
                    border: 'none',
                    padding: '0px !important',
                    paddingTop: '0px',
                    overflow: 'visible'
                }}
                title=""
                onMouseLeave={(ev) => handleMouseLeave(ev)}
            >
                <Box
                    className="editor-container"
                    sx={{
                        margin: '0 auto',
                        width: { xs: '100%', sm: '100%', md: '720px', lg: '1108px', xl: '1108px' }
                    }}
                >
                    <EditorToolbar toolbarId={'t1'} />
                    {isQuillText == true ? (
                        <ReactQuill
                            ref={(el) => {
                                reactQuillRef = el;
                            }}
                            contentStyle={quillStyle}
                            className="quill-editor"
                            bounds=".editor-container"
                            theme="bubble"
                            onChange={onBodyChange}
                            placeholder={'Write something here...'}
                            formats={formats}
                            modules={modules('t1')}
                            scrollingContainer="html"
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
                            scrollingContainer="html"
                        />
                    )}
                </Box>
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

            <ErrorDialog
                title="Trying to connect with server.."
                description="Please contact your system administrator."
                open={openErrorDialog}
                handleClose={handleCloseErrorDialog}
                handleOk={handleOkErrorDialog}
                okButtonText="Refresh"
                closeButtonText="Home"
            />

            <LoadingBar color="#8800ff" progress={progress} onLoaderFinished={() => setProgress(0)} />
        </>
    );
};

export default Document;
