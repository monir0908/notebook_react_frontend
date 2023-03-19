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

import ReactPaginate from 'react-paginate';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

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
import { SET_LOADER } from 'store/actions';
// ==============================|| SAMPLE PAGE ||============================== //

const Trash = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const data = useSelector((state) => state.document.documentList);
    const { error, loading, meta_data } = useSelector((state) => state.document);
    const [selectedItem, setSelectedItem] = useState(null);

    // const [page, setPage] = useState(1);
    // const PER_PAGE = 10;

    // const count = Math.ceil(data.length / PER_PAGE);
    // const _DATA = usePagination(data, PER_PAGE);

    // const handleChange = (e, p) => {
    //     setPage(p);
    //     _DATA.jump(p);
    // };

    // const [page, setPage] = React.useState(2);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(parseInt(event.target.value, 10));
    //     setPage(0);
    // };

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
        if (!userInfo) {
            navigate('/login');
        }
        // setTimeout(() => {
        dispatch({ type: SET_LOADER, loader: true });
        setTimeout(() => {
            const url = `document/list?doc_status=3&creator_id=${userInfo.id}&order_by=-updated_at`;
            dispatch(documentList({ url }));
            if (!loading) {
                dispatch({ type: SET_LOADER, loader: false });
            }
        }, 100);

        // }, 300);
    }, [navigate, userInfo]);

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
            const url = `document/list?doc_status=3&creator_id=${userInfo.id}&order_by=-updated_at`;
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
                title="Delete Document Permanently"
                description="Are you sure about that? Deleting the document will remove all of its history."
                open={openConfirmation}
                data={selectedItem}
                handleClose={handleCloseConfirmation}
                closeButtonText="Close"
                okButtonText="I'm sure -- Delete "
                handleOk={(values) => handleConfirmationDialogOk(values)}
            />
        </>
    );
};

export default Trash;
