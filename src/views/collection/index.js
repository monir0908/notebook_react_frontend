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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MainCard from 'ui-component/cards/MainCard';
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';

import { IconPlus } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import IconButton from '@mui/material/IconButton';
import { IconDots } from '@tabler/icons';
import { documentList, documentCreate } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
import { collectionDetails } from 'store/features/collection/collectionActions';
// ==============================|| SAMPLE PAGE ||============================== //

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

const Collection = () => {
    const theme = useTheme();
    const { collectionKey } = useParams();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const data = useSelector((state) => state.document.documentList);
    const collectionData = useSelector((state) => state.collection.collection);
    const collection_id = collectionData ? collectionData.data.id : null;
    const [tabValue, setTabValue] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getCollectionDetails = () => {
        const url = `collection/` + collectionKey;
        dispatch(collectionDetails({ url }));
    };

    useEffect(() => {
        // dispatch(resetState());
        getCollectionDetails();
    }, [collectionKey]);

    useEffect(() => {
        if (collectionData) {
            getList(0);
        }
    }, [collection_id]);

    useEffect(() => {
        if (collectionData) {
            getList(tabValue);
        }
    }, [tabValue]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };

    const getList = (type) => {
        const p = new URLSearchParams();

        // let paramJson = {
        //     creator_id: userInfo.id,
        //     collection_id: collection_id,
        //     order_by: null,
        //     doc_status: []
        // };

        switch (type) {
            case 0:
                p.append('creator_id', userInfo.id);
                p.append('collection_id', collection_id);
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                break;
            case 1:
                p.append('creator_id', userInfo.id);
                p.append('collection_id', collection_id);
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                p.append('order_by', '-updated_at');
                break;
            case 2:
                p.append('creator_id', userInfo.id);
                p.append('collection_id', collection_id);
                p.append('doc_status', 2);
                p.append('order_by', '-published_at');
                break;
            case 3:
                p.append('creator_id', userInfo.id);
                p.append('collection_id', collection_id);
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                p.append('order_by', 'doc_title');
                break;
        }

        const objString = 'document/list?' + p.toString();
        dispatch(documentList({ url: objString }));
    };

    const handleAddNewDocClick = () => {
        dispatch(documentCreate({ url: 'document/create', navigate, data: { collection: collection_id } }));
        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    return (
        <>
            <MainCard title="">
                <Typography sx={{ p: 2 }} variant="h1">
                    {collectionData && collectionData.data.collection_title}
                </Typography>
                <Divider />
                {data.length > 0 ? (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                                <Tab label="Documents" />
                                <Tab label="Recently updated" />
                                <Tab label="Recently published" />
                                <Tab label="A–Z" />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabValue} index={0}>
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
                                                            You updated{' '}
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
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
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
                                                            You updated{' '}
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
                        </TabPanel>
                        <TabPanel value={tabValue} index={2}>
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
                                                            You published{' '}
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
                        </TabPanel>
                        <TabPanel value={tabValue} index={3}>
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
                                                            You updated{' '}
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
                        </TabPanel>
                    </Box>
                ) : (
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        <Grid item md={6}>
                            <Typography sx={{ pt: 3 }} style={{ textAlign: 'center', color: 'rgb(155, 166, 178)' }} variant="h4">
                                This collection doesn’t contain any documents yet.
                                <br />
                                Get started by creating a new one!
                                <br />
                                <Button
                                    onClick={handleAddNewDocClick}
                                    sx={{ mt: 2 }}
                                    size="small"
                                    variant="contained"
                                    color="info"
                                    startIcon={<IconPlus />}
                                >
                                    Create a document
                                </Button>
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </MainCard>
        </>
    );
};

export default Collection;
