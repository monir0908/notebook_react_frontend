// material-ui

import { Avatar, Button, Box, ButtonBase, Grid, InputAdornment, OutlinedInput, Typography, Divider } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { shouldForwardProp } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import { IconSearch } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import ContextMenuNewDoc from 'layout/components/contextMenuNewDoc';
import { documentList, documentCreate } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
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

const Home = () => {
    const theme = useTheme();
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const collection = useSelector((state) => state.collection.data);
    const { loading } = useSelector((state) => state.document);
    const data = useSelector((state) => state.document.documentList);
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        } else {
            dispatch({ type: SET_LOADER, loader: true });
            setTimeout(() => {
                const url = `document/list?creator_id=${userInfo.id}&doc_status=1&doc_status=2&order_by=-updated_at`;
                dispatch(resetState());
                dispatch(documentList({ url }));
                if (!loading) {
                    dispatch({ type: SET_LOADER, loader: false });
                }
            }, 200);
        }
    }, [navigate, userToken]);

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

    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };

    const onEnter = (e) => {
        if (e.keyCode === 13 || e.type == 'click') {
            if (searchValue.length > 0) {
                navigate('/search/' + searchValue);
            }
        }
    };

    return (
        <>
            <MainCard sx={{ marginTop: '4px' }} title="">
                <Grid sx={{ mb: 3 }} container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Box>
                            <OutlineInputStyle
                                id="input-search-header"
                                style={{ height: '3em' }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                onKeyDown={onEnter}
                                placeholder="Search by document title, document texts.."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={2} size="1rem" color={theme.palette.grey[500]} />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">
                                        <ButtonBase onClick={onEnter} sx={{ borderRadius: '12px' }}>
                                            <HeaderAvatarStyle variant="rounded">
                                                <IconSearch stroke={1.5} size="1.3rem" />
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
                        data.map((item) => (
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
