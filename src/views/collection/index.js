// material-ui

import { Avatar, Box, Button, ButtonBase, Grid, Typography, Divider, OutlinedInput, InputAdornment } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
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
import { shouldForwardProp } from '@mui/system';
import { IconPlus, IconSearch, IconX } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import { documentCreate, documentList } from 'store/features/document/documentActions';
import { collectionDetails } from 'store/features/collection/collectionActions';
import { SET_LOADER } from 'store/actions';

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 500,
    marginLeft: 5,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important',
        height: '0.4375em !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 600
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const HeaderAvatarStyle = styled(Avatar, { shouldForwardProp })(({ theme }) => ({
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    background: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
    '&:hover': {
        background: theme.palette.secondary.dark,
        color: theme.palette.secondary.light
    }
}));

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
    const theme = useTheme();
    const { collectionKey } = useParams();
    const { userToken, userInfo } = useSelector((state) => state.auth);
    const collectionData = useSelector((state) => state.collection.collection);
    const collection_id = collectionData ? collectionData.data.id : null;

    const searchData = useSelector((state) => state.document.documentList);

    const [tabValue, setTabValue] = useState(0);
    const [documentTabData, setDocumentTabData] = useState({ data: [], meta_data: {} });
    const [recentlyUpdatedTabData, setRecentlyUpdatedTabData] = useState({ data: [], meta_data: {} });
    const [recentlyPublishedTabData, setRecentlyPublishedTabData] = useState({ data: [], meta_data: {} });
    const [atozTabData, setAtoZTabData] = useState({ data: [], meta_data: {} });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const [showSearchResult, setShowSearchResult] = useState(false);

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

    const onEnter = (e) => {
        if (e.keyCode === 13 || e.type == 'click') {
            if (searchValue.length > 0) {
                setShowSearchResult(true);
                let url = `document/list?creator_id=${userInfo.id}&collection_id=${collection_id}&doc_status=1&doc_status=2&search_param=${searchValue}`;
                dispatch(documentList({ url }));
            }
        }
    };

    const onClearSearch = () => {
        setSearchValue('');
        setShowSearchResult(false);
        setTabValue(0);
        getList(0);
    };

    return (
        <>
            <MainCard title="">
                <Grid sx={{ mb: 3 }} container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Box>
                            <OutlineInputStyle
                                id="input-search-header"
                                style={{ height: '3em' }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={onEnter}
                                placeholder="Search document under this collection.."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={2} size="1rem" color={theme.palette.grey[500]} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <ButtonBase onClick={onEnter} sx={{ borderRadius: '12px', mr: 1 }}>
                                            <HeaderAvatarStyle variant="rounded">
                                                <IconSearch stroke={1.5} size="1.3rem" />
                                            </HeaderAvatarStyle>
                                        </ButtonBase>
                                        <ButtonBase onClick={onClearSearch} sx={{ borderRadius: '12px' }}>
                                            <HeaderAvatarStyle variant="rounded">
                                                <IconX stroke={1.5} size="1.3rem" />
                                            </HeaderAvatarStyle>
                                        </ButtonBase>
                                    </InputAdornment>
                                }
                                aria-describedby="search-helper-text"
                                inputProps={{ 'aria-label': 'weight' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button onClick={handleAddNewDocClick} variant="contained" color="info" startIcon={<IconPlus />}>
                            <Typography stroke={2.5}>New Doc..</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Typography sx={{ p: 2 }} variant="h1">
                    {collectionData && collectionData.data.collection_title}
                </Typography>
                <Divider />

                {documentTabData.data.length > 0 && showSearchResult === false ? (
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
                ) : showSearchResult == true ? (
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        <Grid item md={12}>
                            <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="data">
                                {searchData.length > 0 ? (
                                    searchData.map((item) => (
                                        <div key={item.id}>
                                            <ListItemButton onClick={() => itemClicked(item)} component="a">
                                                <Grid container direction="row" alignItems="center" sx={{ px: 2 }}>
                                                    <Grid item md={12}>
                                                        <h3 sx={{ mt: 2 }}>{item.doc_title}</h3>
                                                        <p style={{ color: 'rgb(155, 166, 178)' }} variant="subtitle1">
                                                            You saved{' '}
                                                            {item && <ReactTimeAgo date={Date.parse(item.updated_at)} locale="en-US" />} in
                                                            <b> {item.collection_title}</b>
                                                        </p>
                                                    </Grid>
                                                </Grid>
                                            </ListItemButton>
                                            <Divider />
                                        </div>
                                    ))
                                ) : (
                                    <Grid container direction="row" justifyContent="center" alignItems="center">
                                        <Grid sx={{ mt: 3 }} item md={12} style={{ textAlign: 'center' }}>
                                            <Typography variant="p" style={{ color: 'rgb(155, 166, 178)' }}>
                                                No documents found for your search filters under this collection.
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                )}
                            </List>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container direction="row" justifyContent="center" alignItems="center">
                        <Grid item md={6}>
                            <Typography sx={{ pt: 3 }} style={{ textAlign: 'center', color: 'rgb(155, 166, 178)' }} variant="h4">
                                This collection doesn’t contain any documents yet.
                                <br />
                                Get started by creating a new one!
                                <br />
                                {/* <Button
                                    onClick={handleAddNewDocClick}
                                    sx={{ mt: 2 }}
                                    size="small"
                                    variant="contained"
                                    color="info"
                                    startIcon={<IconPlus />}
                                >
                                    Create a document
                                </Button> */}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </MainCard>
        </>
    );
};

export default Collection;
