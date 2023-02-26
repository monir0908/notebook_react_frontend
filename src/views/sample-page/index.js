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

const SamplePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        let url = 'collection/list?creator_id=5&page=1&page_size=5';
        dispatch(collectionList({ url, navigate, toast }));
    }, []);

    return (
        <>
            <MainCard title="Sample Card">
                <Typography variant="body2">
                    Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa.
                    Ut enif ad minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube
                    grue dolor in reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non
                    president, sunk in culpa qui officiate descent molls anim id est labours.
                </Typography>
            </MainCard>
        </>
    );
};

export default SamplePage;
