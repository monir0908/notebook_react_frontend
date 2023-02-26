// material-ui
import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

const Search = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    return (
        <>
            <MainCard title="Search">
                <Typography variant="body2">This is a search page</Typography>
            </MainCard>
        </>
    );
};

export default Search;
