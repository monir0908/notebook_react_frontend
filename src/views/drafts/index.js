// material-ui
import {
    Avatar,
    Box,
    Button,
    ButtonBase,
    Card,
    Grid,
    InputAdornment,
    OutlinedInput,
    Popper,
    Typography,
    Divider,
    InputLabel,
    MenuItem,
    FormControl
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconChevronRight, IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';

import Select, { SelectChangeEvent } from '@mui/material/Select';
// ==============================|| SAMPLE PAGE ||============================== //

const Drafts = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [collectionTitle, setCollectionTitle] = useState('Any Collection');

    const handleCollectionTitleChange = (event) => {
        setCollectionTitle(event.target.value);
    };

    useEffect(() => {}, []);

    return (
        <>
            <MainCard title="">
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
                                value={collectionTitle}
                                onChange={handleCollectionTitleChange}
                                label=""
                            >
                                <MenuItem value="Any Collection">Any Collection</MenuItem>
                                <MenuItem value={'Collection 1'}>Collection 1</MenuItem>
                                <MenuItem value={'Collection 2'}>Collection 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
            </MainCard>
        </>
    );
};

export default Drafts;
