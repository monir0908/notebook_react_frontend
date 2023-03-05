// material-ui
import { useTheme, styled } from '@mui/material/styles';
import { Avatar, Box, Button, ButtonBase, Card, Grid, InputAdornment, OutlinedInput, Popper, Typography, Divider } from '@mui/material';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import MainCard from 'ui-component/cards/MainCard';
import { IconAdjustmentsHorizontal, IconSearch, IconX } from '@tabler/icons';
import { shouldForwardProp } from '@mui/system';
import { IconPlus } from '@tabler/icons';
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
    const [value, setValue] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {}, []);

    return (
        <>
            <MainCard title="">
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                    <Grid item>
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
                                // endAdornment={
                                //     <InputAdornment position="end">
                                //         <ButtonBase sx={{ borderRadius: '12px' }}>
                                //             <HeaderAvatarStyle variant="rounded">
                                //                 <IconAdjustmentsHorizontal stroke={1.5} size="1.3rem" />
                                //             </HeaderAvatarStyle>
                                //         </ButtonBase>
                                //     </InputAdornment>
                                // }
                                aria-describedby="search-helper-text"
                                inputProps={{ 'aria-label': 'weight' }}
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="info" startIcon={<IconPlus />}>
                            <Typography stroke={2.5}>New Doc..</Typography>
                        </Button>
                    </Grid>
                </Grid>
                <Divider sx={{ mt: 2 }} />
                <Typography sx={{ p: 5 }} variant="h1" component="h2">
                    Home
                </Typography>
            </MainCard>
        </>
    );
};

export default Home;
