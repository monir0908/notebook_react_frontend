// material-ui
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Card,
    Grid,
    InputAdornment,
    OutlinedInput,
    Popper,
    Typography,
    Divider,
    InputLabel,
    MenuItem,
    FormControl
} from '@mui/material';
import { v4 } from 'uuid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { documentList, documentUpdate } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import ReactTimeAgo from 'react-time-ago';
import IconButton from '@mui/material/IconButton';
import { IconChevronRight, IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';
import ContextMenuTrash from 'layout/components/contextMenuTrash';
import ConfirmationDialog from 'layout/components/confirmationDialog';
import { documentDelete } from 'store/features/document/documentActions';
// ==============================|| SAMPLE PAGE ||============================== //

const Trash = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const data = useSelector((state) => state.document.documentList);

    const [selectedItem, setSelectedItem] = useState(null);
    //////////////////////////// context menu //////////////////////////////
    const [anchorEl, setAnchorEl] = useState(null);
    const openContextMenu = Boolean(anchorEl);
    const handleContextMenuClick = (event, item) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(item);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        // setTimeout(() => {
        const url = `document/list?doc_status=3&creator_id=${userInfo.id}`;
        dispatch(documentList({ url }));

        // }, 300);
    }, []);

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
            documentDelete({
                url: 'document/delete-doc/' + values.id,
                navigate
            })
        );
        setTimeout(() => {
            const url = `document/list?doc_status=3&creator_id=${userInfo.id}`;
            dispatch(documentList({ url }));
            if (data) {
                setList(data.data);
            } else {
                setList([]);
            }
        }, 300);

        setOpenConfirmation(false);
    };

    const handleDocRestore = (values) => {
        dispatch(
            documentUpdate({
                url: 'document/update-status/' + values.doc_key,
                navigate,
                dispatch,
                data: {
                    doc_status: 1
                },
                extraData: {
                    status: 'restore',
                    col_key: null,
                    doc_url: '/document/' + values.doc_key
                }
            })
        );

        // setTimeout(() => {
        //     const url = `document/list?doc_status=3&creator_id=${userInfo.id}`;
        //     dispatch(documentList({ url }));
        // }, 500);
    };

    return (
        <>
            <MainCard title="">
                <Typography sx={{ p: 2 }} variant="h1">
                    Trash
                </Typography>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ p: 2 }} variant="h4">
                            Documents
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />

                <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="data">
                    {data.length > 0 &&
                        data.map((item, index) => (
                            <div key={item.id}>
                                <Grid container direction="row" alignItems="center" sx={{ px: 2 }}>
                                    <Grid item md={8}>
                                        <h3 sx={{ mt: 2 }}>{item.doc_title}</h3>
                                        <p style={{ color: 'rgb(155, 166, 178)' }} sx={{ mb: 2 }} variant="subtitle1">
                                            You deleted this document about{' '}
                                            {item && <ReactTimeAgo date={Date.parse(item.updated_at)} locale="en-US" />} in
                                            <b> {item.collection_title}</b>
                                        </p>
                                    </Grid>
                                    <Grid item md={4}>
                                        <IconButton
                                            onClick={(event) => handleContextMenuClick(event, item)}
                                            size="1rem"
                                            aria-label="option"
                                            style={{ float: 'right', marginTop: '-5px', marginRight: '-15px', cursor: 'pointer' }}
                                        >
                                            <IconDots size="1.5rem" />
                                        </IconButton>
                                    </Grid>
                                </Grid>

                                <Divider />
                            </div>
                        ))}
                </List>
            </MainCard>
            <ContextMenuTrash
                anchorEl={anchorEl}
                open={openContextMenu}
                handleClose={handleContextMenuClose}
                handleRestoreClick={() => handleDocRestore(selectedItem)}
                handleDeleteClick={handleClickOpenConfirmation}
            />
            <ConfirmationDialog
                title="Delete Decument Permanently"
                description="If you delete this document,it will be deleted permanently. Do you agree with that?"
                open={openConfirmation}
                data={selectedItem}
                handleClose={handleCloseConfirmation}
                handleOk={(values) => handleConfirmationDialogOk(values)}
            />
        </>
    );
};

export default Trash;
