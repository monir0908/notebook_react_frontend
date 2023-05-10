// material-ui
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import LoadingBar from 'react-top-loading-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentDetails, documentFileDelete } from 'store/features/document/documentActions';
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
import Fab from '@mui/material/Fab';
// assets
import { IconDeviceFloppy } from '@tabler/icons';

import { TextField, Button, Grid, Typography, Box, IconButton, Stack, useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
// third party
import { format } from 'date-fns';

import DescriptionIcon from '@mui/icons-material/Description';
import { updateDocumentTitle } from 'store/features/collection/collectionSlice';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import ErrorDialog from 'layout/components/errorDialog';
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

import { updateViewers } from 'store/features/header/headerSlice';

const Document = () => {
    const dispatch = useDispatch();
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const docData = useSelector((state) => state.document.data);
    const { viewers } = useSelector((state) => state.header);
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
    const [isServerError, setIsServerError] = useState(false);
    let bodyText = '';
    const side = 300;
    const padding = 80;
    const margin = 100;
    let selectedElement = null;
    let boundingRect = null;

    const getDocumentDetails = async () => {
        const res = await API.get(`document/${documentKey}`);
        if (res) {
            let doc = res.data.data;
            setDocObj(doc);
            dispatch(updateDocId({ doc_id: doc.doc_key }));
            dispatch(updateDoc({ doc: doc }));

            //setDocTitle(doc.doc_title);
            setDocBody(doc.doc_body);
            bodyText = doc.doc_body;
        }
    };

    // const onTitleChange = (e) => {
    //     setDocTitle(e.target.value);
    //     dispatch(updateDocumentTitle({ document_key: documentKey, doc_title: e.target.value }));
    // };

    // const onTitleBlur = (e) => {
    //     dispatch(
    //         documentUpdateOnEditorLeave({
    //             url: 'document/update-doc/' + docObj.doc_key,
    //             navigate,
    //             data: {
    //                 doc_title: e.target.value
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
    let quillText;
    //let isLoadedOnce = true;
    //let isQuillText = true;

    const getRamndomColors = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const attachQuillRefs = () => {
        if (reactQuillRef == null) return;
        if (typeof reactQuillRef.getEditor !== 'function') return;
        quillRef = reactQuillRef.getEditor();
        const tooltipEl = document.querySelector('.ql-tooltip');
        tooltipEl.style.zIndex = 1101;
        window.addEventListener('scroll', function () {
            const selection = quillRef.getSelection();
            if (selection) {
                const bounds = quillRef.getBounds(selection.index);
                const editorEl = quillRef.container;
                const editorBounds = editorEl.getBoundingClientRect();
                const top = editorBounds.top + bounds.bottom;
                const tooltipEl = document.querySelector('.ql-tooltip');
                if (top > 170) {
                    tooltipEl.style.zIndex = 1101;
                } else {
                    tooltipEl.style.zIndex = '';
                }
            }
        });

        // quillRef.on('editor-change', function (eventName, ...args) {
        //     if (eventName === 'text-change') {
        //         if (isLoadedOnce) {
        //             const range = quillRef.getSelection(true);
        //             quillRef.setSelection(range.index, quillRef.getLength(), 'user');
        //             isLoadedOnce = false;
        //             // setTimeout(() => {
        //             //     const selection = window.getSelection();
        //             //     selection.removeAllRanges();
        //             // }, 10);
        //         }
        //         console.log(eventName);
        //         console.log(args[0]);
        //     } else if (eventName === 'selection-change') {
        //         console.log(eventName);
        //         console.log(args[0]);
        //     }
        // });

        const quillContainer = quillRef.container;

        quillContainer.addEventListener('scroll', (event) => {
            console.log(quillContainer.scrollY);
        });

        quillContainer.addEventListener('mouseover', (event) => {
            const targetElement = event.target;
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
                switch (targetElement.innerText) {
                    case '\n':
                        break;
                    case ' ':
                        break;

                    default:
                        if (targetElement.querySelector('img') == null) {
                            selectedElement = targetElement;
                            const hoverDiv = document.createElement('div');
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

                            if (targetElement.tagName === 'H1' || targetElement.tagName === 'H2') {
                                extraTop = 10;
                            }
                            //const uuid = uuidv4();
                            //hoverDiv.setAttribute('data-block-id', uuid);
                            //targetElement.setAttribute('id', uuid);
                            // const value = targetElement.getAttribute('id');
                            // if (value) {
                            //     hoverDiv.setAttribute('data-block-id', value);
                            // } else {
                            //     //targetElement.setAttribute('id', uuid);
                            // }
                            hoverDiv.style.cursor = 'grab';

                            // targetElement.style.userSelect = 'none';
                            // targetElement.querySelectorAll('*').forEach((el) => {
                            //     el.style.userSelect = 'none';
                            // });

                            const containerBoundingRect = quillContainer.getBoundingClientRect();
                            hoverDiv.style.top = `${boundingRect.top - containerBoundingRect.top - 2 + extraTop}px`;

                            if (targetElement.tagName === 'LI') {
                                //targetElement.parentNode.setAttribute('data-block-id', uuid);
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
                targetElement.removeAttribute('draggable');
                //const targetId = targetElement.getAttribute('id');
                // quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                //     if (div.dataset.blockId !== targetId) {
                //         div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
                //     }
                // });

                quillContainer.querySelectorAll('.pointer-div').forEach((div) => {
                    div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
                });
            }
        });

        let pressTimer;
        quillContainer.addEventListener('mousedown', (event) => {
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
                //selectedElement.setAttribute('draggable', 'true');

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
                    //event.dataTransfer.setDragImage('https://www.google.com/intl/en_ALL/mapfiles/closedhand.cur', -10, -10);
                    // document.body.style.cursor = 'grabbing';
                });

                // targetElement.addEventListener('drag', (event) => {
                //     event.dataTransfer.cursor = '-webkit-grabbing';
                //     event.dataTransfer.cursor = 'grabbing';
                //     selectedElement.style.cursor = 'grabbing';
                //     targetElement.style.cursor = 'grabbing'; // <-- Add this line
                //     console.log(event);
                // });

                targetElement.addEventListener('dragend', (event) => {
                    // Reset the cursor style to its default value
                    targetElement.style.cursor = 'default';
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
                    targetElement.tagName === 'P'
                ) {
                    if (targetElement.tagName == 'LI' || selectedElement.tagName == 'LI') {
                        if (targetElement.tagName == selectedElement.tagName) {
                            removePointerDivs();
                            pointerDiv(targetElement);
                        } else {
                            return;
                        }
                    } else {
                        removePointerDivs();
                        pointerDiv(targetElement);
                    }
                } else {
                    removePointerDivs();
                }
            } else {
                removePointerDivs();
            }
        });

        quillContainer.addEventListener('drop', (event) => {
            event.preventDefault();
            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
            });

            const targetElement = event.target;
            // console.log(targetElement);
            // console.log(targetElement.parentNode);
            // console.log(targetElement.nextSibling);

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
        });

        const pointerDiv = (targetElement) => {
            const pointerDiv = document.createElement('div');
            pointerDiv.classList.add('pointer-div');
            pointerDiv.style.position = 'absolute';
            pointerDiv.style.zIndex = 999;
            pointerDiv.style.pointerEvents = 'none';
            pointerDiv.style.backgroundColor = 'rgb(35,131,226,0.43)';
            pointerDiv.style.left = '14px';
            pointerDiv.style.right = '0px';
            pointerDiv.style.bottom = '-4px';
            pointerDiv.style.width = '70%';
            pointerDiv.style.height = '3px';
            pointerDiv.style.marginTop = '1px';
            pointerDiv.style.marginBottom = '1px';
            const boundingRect = targetElement.getBoundingClientRect();
            //console.log(boundingRect);
            const containerBoundingRect = quillContainer.getBoundingClientRect();
            //console.log(containerBoundingRect);
            pointerDiv.style.top = `${boundingRect.top - containerBoundingRect.top}px`;
            quillContainer.appendChild(pointerDiv);
        };

        const getDropPosition = (clientY, targetElement) => {
            const boundingRect = targetElement.getBoundingClientRect();
            const dropPosition = (clientY - boundingRect.top) / boundingRect.height;
            if (dropPosition <= 1) {
                return 'before';
            } else {
                return 'after';
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
                    //  quillRef.focus();
                }
            }
        );

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
            // let quillObj = JSON.stringify(ydoc);
            // if (JSON.parse(quillObj).quill) {
            //     quillText = JSON.parse(quillObj).quill;
            // }
            // console.log(quillText);

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

        // provider.awareness.on('change', ({ added, removed, updated }) => {
        //     const users = [];
        //     for (const [clientId, state] of provider.awareness.getStates()) {
        //         const user = state.user;
        //         console.log('ws connected: ', provider.wsconnected);
        //         // let quillObj = JSON.stringify(ydoc);
        //         // if (JSON.parse(quillObj).quill) {
        //         //     quillText = JSON.parse(quillObj).quill;
        //         // }
        //         // console.log(user, quillText);
        //         users.push(user);
        //     }
        // });

        provider.awareness.setLocalStateField('user', {
            name: userInfo.first_name,
            color: getRamndomColors()
        });

        return () => {
            clearInterval(checkWebSocketConnection);
            // Clean up Yjs document
            provider.disconnect();
            ydoc.destroy();

            const quillContainer = quillRef.container;
            quillContainer.querySelectorAll('.hover-div').forEach((div) => {
                div.remove(); // Remove the hover-div only if its data-block-id is not equal to targetId
            });
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

    useEffect(() => {}, [docData]);

    const handleSubmit = async () => {
        try {
            const res = await API.patch(`document/update-doc/${documentKey}`, {
                // doc_title: docTitle,
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

    return (
        <>
            <MainCard title="" onMouseLeave={(ev) => handleMouseLeave(ev)}>
                {/* {docData != null && (
                    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                        <Grid item>
                            <Box style={{ float: 'right' }}>
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
                        </Grid>
                    </Grid>
                )} */}
                {/* <form> */}
                {/* <TextField
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
                /> */}
                {/* {docData != null && (
                    <>
                        <Grid container direction="row" justifyContent="space-between" alignItems="center">
                            <Grid item>
                                <Typography sx={{ pt: 1 }} variant="body2" style={{ color: 'rgb(155, 166, 178)', fontStyle: 'italic' }}>
                                    Last updated at{' '}
                                    {docData.attachments != null && format(Date.parse(docData.updated_at), 'dd/LL/yyyy hh:mm a')}
                                    &nbsp;&nbsp;&nbsp; Created by{' '}
                                    {userInfo.full_name == docData.doc_creator_full_name ? 'me' : docData.doc_creator_full_name}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography sx={{ pt: 1 }} variant="body2" style={{ color: 'rgb(155, 166, 178)', fontStyle: 'italic' }}>
                                    Currently viewing{' : '}
                                    {viewers.map((item, index) =>
                                        index === viewers.length - 1 && viewers.length === 1
                                            ? item.name
                                            : index === viewers.length - 1
                                            ? item.name
                                            : item.name + ', '
                                    )}
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                )} */}
                {/* <br />
                <br />
                <br />
                <br /> */}
                {docData != null && <>{docData.attachments != null && docData.attachments.length > 0 && <br />}</>}

                <div className="editor-container">
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
                    {/* <Fab sx={fabStyle} onClick={handleSubmit} aria-label="Save" color="primary">
                            <IconDeviceFloppy />
                        </Fab> */}
                </div>
                {/* </form> */}
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

            <ErrorDialog
                title="Trying to connect with server.."
                description="Please contact your system administrator."
                open={openErrorDialog}
                handleClose={handleCloseErrorDialog}
                handleOk={handleOkErrorDialog}
                okButtonText="Refresh"
                closeButtonText="Home"
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
            {/* <BlockUIEditor blocking={editorLoader} title="Server Error" /> */}
        </>
    );
};

export default Document;
