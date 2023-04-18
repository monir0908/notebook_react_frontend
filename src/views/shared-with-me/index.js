// material-ui

import { Grid, Typography, Divider } from '@mui/material';

import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
import { sharedDocumentList } from 'store/features/document/documentActions';
import { resetState } from 'store/features/document/documentSlice';
import ReactTimeAgo from 'react-time-ago';
import { SET_LOADER } from 'store/actions';

const SharedWithMe = () => {
    const { userInfo, userToken } = useSelector((state) => state.auth);
    const data = useSelector((state) => state.document.documentList);
    const { loading } = useSelector((state) => state.document);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        } else {
            dispatch({ type: SET_LOADER, loader: true });
            dispatch(resetState());
            setTimeout(() => {
                const url = `document/list-shared-with-me`;
                dispatch(sharedDocumentList({ url }));
                if (!loading) {
                    dispatch({ type: SET_LOADER, loader: false });
                }
            }, 500);
        }
    }, [navigate, userToken]);

    const itemClicked = (item) => {
        navigate('/document/' + item.doc_key);
    };
    return (
        <>
            <MainCard title="">
                <Typography sx={{ p: 2 }} variant="h1">
                    Shared With Me
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
                        data.map((item) => (
                            <div key={item.id}>
                                <ListItemButton onClick={() => itemClicked(item)} component="a">
                                    <Grid container direction="row" alignItems="center" sx={{ px: 2 }}>
                                        <Grid item md={12}>
                                            <Typography variant="h3" sx={{ mt: 2 }}>
                                                {item.doc_title}
                                            </Typography>
                                            <Typography sx={{ pt: 1 }} variant="body1" style={{ color: 'rgb(155, 166, 178)' }}>
                                                Created by -- {item.doc_creator_full_name}
                                            </Typography>
                                            <Typography sx={{ pt: 1 }} variant="body1" style={{ color: 'rgb(155, 166, 178)' }}>
                                                Document is updated about{' '}
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
        </>
    );
};

export default SharedWithMe;
