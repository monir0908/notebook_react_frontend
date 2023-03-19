// material-ui

import { Box, Button, Grid, Typography, Divider } from '@mui/material';

import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
import API from 'helpers/jwt.interceptor';
// project imports
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MainCard from 'ui-component/cards/MainCard';

import { IconPlus } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import { documentCreate } from 'store/features/document/documentActions';
import { collectionDetails } from 'store/features/collection/collectionActions';
import { SET_LOADER } from 'store/actions';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
}

const Collection = () => {
    const { collectionKey } = useParams();
    const { userToken, userInfo } = useSelector((state) => state.auth);
    const collectionData = useSelector((state) => state.collection.collection);
    const collection_id = collectionData ? collectionData.data.id : null;
    const [tabValue, setTabValue] = useState(0);
    const [documentTabData, setDocumentTabData] = useState({ data: [], meta_data: {} });
    const [recentlyUpdatedTabData, setRecentlyUpdatedTabData] = useState({ data: [], meta_data: {} });
    const [recentlyPublishedTabData, setRecentlyPublishedTabData] = useState({ data: [], meta_data: {} });
    const [atozTabData, setAtoZTabData] = useState({ data: [], meta_data: {} });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getCollectionDetails = () => {
        const url = `collection/` + collectionKey;
        dispatch(collectionDetails({ url }));
    };

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        }
        // dispatch(resetState());
        getCollectionDetails();
    }, [navigate, userToken, collectionKey]);

    useEffect(() => {
        if (collectionData) {
            setTabValue(0);
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

    const getList = async (type) => {
        let p = new URLSearchParams();
        p.append('creator_id', userInfo.id);
        p.append('collection_id', collection_id);

        switch (type) {
            case 0:
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                break;
            case 1:
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                p.append('order_by', '-updated_at');
                break;
            case 2:
                p.append('doc_status', 2);
                p.append('order_by', '-published_at');
                break;
            case 3:
                p.append('doc_status', 1);
                p.append('doc_status', 2);
                p.append('order_by', 'doc_title');
                break;
        }
        dispatch({ type: SET_LOADER, loader: true });

        const objString = 'document/list?' + p.toString();
        const res = await API.get(objString);
        setTimeout(() => {
            if (res) {
                dispatch({ type: SET_LOADER, loader: false });
            }
        }, 200);
        switch (type) {
            case 0:
                if (res.data.success) {
                    setDocumentTabData(res.data);
                }
                break;
            case 1:
                if (res.data.success) {
                    setRecentlyUpdatedTabData(res.data);
                }
                break;
            case 2:
                if (res.data.success) {
                    setRecentlyPublishedTabData(res.data);
                }
                break;
            case 3:
                if (res.data.success) {
                    setAtoZTabData(res.data);
                }
                break;
        }
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
                {documentTabData.data.length > 0 ? (
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
                                {documentTabData.data.length > 0 &&
                                    documentTabData.data.map((item) => (
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
                                {recentlyUpdatedTabData.data.length > 0 &&
                                    recentlyUpdatedTabData.data.map((item) => (
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
                                {recentlyPublishedTabData.data.length > 0 &&
                                    recentlyPublishedTabData.data.map((item) => (
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
                                {atozTabData.data.length > 0 &&
                                    atozTabData.data.map((item) => (
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
