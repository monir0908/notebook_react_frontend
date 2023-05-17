// material-ui
import { useState, useEffect } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Grid, InputAdornment, OutlinedInput, Typography, Divider } from '@mui/material';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
// project imports
import ReactTimeAgo from 'react-time-ago';
import { shouldForwardProp } from '@mui/system';
import MainCard from 'ui-component/cards/MainCard';
import { IconSearch } from '@tabler/icons';
import { documentList } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
import { SET_LOADER } from 'store/actions';

const OutlineInputStyle = styled(OutlinedInput, { shouldForwardProp })(({ theme }) => ({
    width: 800,
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

const Search = () => {
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const data = useSelector((state) => state.document.documentList);
    const { loading } = useSelector((state) => state.document);
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { searchText } = useParams();
    const [value, setValue] = useState('');
    const [initPage, setInitPage] = useState(false);
    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        }
        dispatch(resetState());

        if (searchText) {
            setValue(searchText);
            let url = `document/list?creator_id=${userInfo.id}&search_param=${searchText}`;
            dispatch(documentList({ url }));
            setTimeout(() => {
                setInitPage(true);
            }, 500);
        }

        return () => {
            setValue('');
            setInitPage(false);
        };
    }, [navigate, userToken]);
    useEffect(() => {}, [value]);

    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };

    const onEnter = (e) => {
        if (e.keyCode === 13 || e.type == 'click') {
            if (value.length > 0) {
                getList();
                setTimeout(() => {
                    setInitPage(true);
                }, 500);
            } else {
                dispatch(resetState());
                setInitPage(false);
            }
        }
    };

    const getList = () => {
        dispatch({ type: SET_LOADER, loader: true });
        setTimeout(() => {
            let url = `document/list?creator_id=${userInfo.id}&search_param=${value}`;
            dispatch(documentList({ url }));
            if (!loading) {
                dispatch({ type: SET_LOADER, loader: false });
            }
        }, 500);
    };

    return (
        <>
            <MainCard sx={{}} title="">
                <Grid container direction="row" justifyContent="center" alignItems="center">
                    <Grid item mt={2}>
                        <Box>
                            <OutlineInputStyle
                                id="input-search-header"
                                style={{ height: '3em' }}
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                onKeyDown={onEnter}
                                placeholder="Search by document title, document texts or collection title.."
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
                        <Divider sx={{ mt: 2 }} />
                    </Grid>
                </Grid>

                <Grid sx={{ m: 3 }} container direction="row" justifyContent="center" alignItems="center">
                    <Grid item md={12}>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="data">
                            {data.length > 0 ? (
                                data.map((item) => (
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
                                    <Grid item md={12} style={{ textAlign: 'center' }}>
                                        <Typography variant="p" style={{ color: 'rgb(155, 166, 178)' }}>
                                            {initPage && `No documents found for your search filters.`}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )}
                        </List>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default Search;
