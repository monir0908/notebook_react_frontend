// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper, Typography, Divider } from '@mui/material';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';

import { IconPlus } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import IconButton from '@mui/material/IconButton';
import { IconDots } from '@tabler/icons';
import ContextMenuNewDoc from 'layout/components/contextMenuNewDoc';
import { documentList, documentCreate } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
// ==============================|| SAMPLE PAGE ||============================== //

const Home = () => {
    const theme = useTheme();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const collection = useSelector((state) => state.collection.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const url = `document/list?creator_id=${userInfo.id}&date_range_str=week`;
        dispatch(resetState());
        dispatch(documentList({ url }));
    }, []);

    const [selectedItem, setSelectedItem] = useState(null);
    //////////////////////////// context menu //////////////////////////////
    const [anchorEl, setAnchorEl] = useState(null);
    const openContextMenuNewDoc = Boolean(anchorEl);
    const handleContextMenuNewDocClick = (event) => {
        setAnchorEl(event.currentTarget);
        //  setSelectedItem(item);
    };
    const handleContextMenuNewDocClose = () => {
        setAnchorEl(null);
    };
    const handleNewDocItemClick = (value) => {
        dispatch(documentCreate({ url: 'document/create', navigate, data: { collection: value.id } }));
        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    const data = useSelector((state) => state.document.documentList);
    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };
    return (
        <>
            <MainCard title="">
                <Grid container direction="row" justifyContent="end" alignItems="center">
                    <Grid item>
                        <Button onClick={handleContextMenuNewDocClick} variant="contained" color="info" startIcon={<IconPlus />}>
                            <Typography stroke={2.5}>New Doc..</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Typography sx={{ p: 2 }} variant="h1">
                    Home
                </Typography>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ p: 2 }} variant="h4">
                            Recently updated
                        </Typography>
                    </Grid>
                </Grid>
                <Divider />
                <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="data">
                    {data.length > 0 &&
                        data.map((item, index) => (
                            <div key={item.id}>
                                <ListItemButton onClick={() => itemClicked(item)} component="a">
                                    <Grid container direction="row" alignItems="center" sx={{ px: 2 }}>
                                        <Grid item md={12}>
                                            <Typography variant="h3" sx={{ mt: 2 }}>
                                                {item.doc_title}
                                            </Typography>
                                            <Typography sx={{ pt: 1 }} variant="body1" style={{ color: 'rgb(155, 166, 178)' }}>
                                                You updated this document about{' '}
                                                {item && <ReactTimeAgo date={Date.parse(item.updated_at)} locale="en-US" />} in
                                                <b> {item.collection_title}</b>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ListItemButton>
                                <Divider />
                            </div>
                        ))}
                </List>
            </MainCard>

            <ContextMenuNewDoc
                data={collection}
                anchorEl={anchorEl}
                open={openContextMenuNewDoc}
                handleItemClick={(value) => handleNewDocItemClick(value)}
                handleClose={handleContextMenuNewDocClose}
            />
        </>
    );
};

export default Home;
