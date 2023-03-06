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
import { documentList } from 'store/features/document/documentActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import ReactTimeAgo from 'react-time-ago';
import IconButton from '@mui/material/IconButton';
import { IconChevronRight, IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';
import ContextMenuTrash from 'layout/components/contextMenuTrash';
// ==============================|| SAMPLE PAGE ||============================== //

const Trash = () => {
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const data = useSelector((state) => state.document.data);
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
        const url = `document/list?doc_status=3&creator_id=${userInfo.id}`;
        dispatch(documentList({ url }));
        console.log(data);
    }, []);

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

                <List sx={{ px: 4, width: '100%', bgcolor: 'background.paper' }} component="nav">
                    {data &&
                        data.map((item, index) => (
                            <div key={item.id}>
                                <Grid container direction="row" justifyContent="space-around" alignItems="center">
                                    <Grid item>
                                        <h3 sx={{ mt: 2 }}>{item.doc_title}</h3>
                                        <p style={{ color: 'rgb(155, 166, 178)' }} sx={{ mb: 2 }} variant="subtitle1">
                                            You Deleted this document about {item && <ReactTimeAgo date={item.updated_at} locale="en-US" />}{' '}
                                            in
                                            <b> {item.collection_title}</b>
                                        </p>
                                    </Grid>
                                    <Grid item>
                                        <IconButton
                                            onClick={(event) => handleContextMenuClick(event, item)}
                                            size="1rem"
                                            aria-label="option"
                                            style={{ float: 'right', marginTop: '-5px', marginRight: '-15px', cursor: 'pointer' }}
                                        >
                                            <IconDots size="1rem" />
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
                handleEditClick={handleContextMenuClose}
                handleDeleteClick={handleContextMenuClose}
            />
        </>
    );
};

export default Trash;
