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
import { shouldForwardProp } from '@mui/system';
import { IconPlus } from '@tabler/icons';
import ReactTimeAgo from 'react-time-ago';
import IconButton from '@mui/material/IconButton';
import { IconDots } from '@tabler/icons';
import ContextMenuNewDoc from 'layout/components/contextMenuNewDoc';
import { documentList, documentCreate } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
// ==============================|| SAMPLE PAGE ||============================== //

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 300,
    marginLeft: 5,
    paddingLeft: 16,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 200
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: '#fff'
    }
}));

const Home = () => {
    const theme = useTheme();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const collection = useSelector((state) => state.collection.data);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const url = `document/list?creator_id=${userInfo.id}`;
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
                    {/* <Grid item>
                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <OutlineInputStyle
                                id="input-search-header"
                                style={{ height: '3em' }}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Search.."
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                    </InputAdornment>
                                }
                                aria-describedby="search-helper-text"
                                inputProps={{ 'aria-label': 'weight' }}
                            />
                        </Box>
                    </Grid> */}
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
                                            <h3 sx={{ mt: 2 }}>{item.doc_title}</h3>
                                            <p style={{ color: 'rgb(155, 166, 178)' }} variant="subtitle1">
                                                You updated this document about{' '}
                                                {item && <ReactTimeAgo date={Date.parse(item.updated_at)} locale="en-US" />} in
                                                <b> {item.collection_title}</b>
                                            </p>
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
