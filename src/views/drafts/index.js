// material-ui
import { Grid, Typography, Divider, MenuItem, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
// project imports
import ReactTimeAgo from 'react-time-ago';
import MainCard from 'ui-component/cards/MainCard';
import Select from '@mui/material/Select';
import { resetState } from 'store/features/document/documentSlice';
import { documentList } from 'store/features/document/documentActions';
import { SET_LOADER } from 'store/actions';

const Drafts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const collection = useSelector((state) => state.collection.data);
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const data = useSelector((state) => state.document.documentList);
    const { loading } = useSelector((state) => state.document);
    const [collectionSelected, setCollectionSelected] = useState('Any Collection');
    const [time, setTime] = useState('Any Time');

    const handleCollectionTitleChange = (event) => {
        setCollectionSelected(event.target.value);
    };
    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const getList = () => {
        dispatch({ type: SET_LOADER, loader: true });
        let url = {
            doc_status: 1,
            creator_id: userInfo.id,
            order_by: '-updated_at',
            collection_id: null,
            date_range_str: null
        };

        if (collectionSelected !== 'Any Collection') {
            url.collection_id = collectionSelected;
        } else {
            delete url.collection_id;
        }

        if (time !== 'Any Time') {
            url.date_range_str = time;
        } else {
            delete url.date_range_str;
        }

        const objString = 'document/list?' + new URLSearchParams(url).toString();
        dispatch(documentList({ url: objString })).then((res) => {
            dispatch({ type: SET_LOADER, loader: false });
        });
        // dispatch({ type: SET_LOADER, loader: true });
        // setTimeout(() => {
        //     dispatch(documentList({ url: objString }));
        //     if (!loading) {
        //         dispatch({ type: SET_LOADER, loader: false });
        //     }
        // }, 500);
    };

    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        } else {
            dispatch(resetState());
            getList();
        }
        // dispatch(resetState());
        // setTimeout(() => {
        //     getList();
        // }, 300);
    }, [navigate, userToken]);

    useEffect(() => {
        getList();
    }, [collectionSelected, time]);
    return (
        <>
            <MainCard sx={{ border: 'none' }} title="">
                <Typography sx={{ p: 2 }} variant="h1" component="h2">
                    Drafts
                </Typography>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography sx={{ p: 2 }} variant="h4" component="h4">
                            Documents
                        </Typography>
                    </Grid>
                    <Grid item>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                defaultValue="Any Collection"
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={collectionSelected}
                                onChange={handleCollectionTitleChange}
                                label=""
                            >
                                <MenuItem value="Any Collection">Any Collection</MenuItem>
                                {collection.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.collection_title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} size="small">
                            <Select
                                defaultValue="Any Time"
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={time}
                                onChange={handleTimeChange}
                                label=""
                            >
                                <MenuItem value="Any Time">Any Time</MenuItem>
                                <MenuItem value={'yesterday'}>Yesterday</MenuItem>
                                <MenuItem value={'week'}>last 7 days</MenuItem>
                                <MenuItem value={'month'}>last 30 days</MenuItem>
                                <MenuItem value={'year'}>last 365 days</MenuItem>
                            </Select>
                        </FormControl>
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
                                                You saved {item && <ReactTimeAgo date={Date.parse(item.updated_at)} locale="en-US" />} in
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
        </>
    );
};

export default Drafts;
