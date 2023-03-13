import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Error403 = () => {
    const { loading, userInfo, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    // redirect authenticated user to / page
    // useEffect(() => {
    //     if (userInfo) {
    //         navigate('/home');
    //     }
    // }, [navigate, userInfo]);
    const homeClicked = () => {
        navigate('/home');
    };
    const theme = useTheme();

    return (
        <Grid sx={{ my: 30 }} container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <Card className="error-card">
                    <CardContent>
                        <div className="message">
                            <h1>Access to this page is restricted</h1>
                            <p>Please check with the site admin if you believe this is a mistake.</p>
                        </div>
                        <div className="text-center">
                            <Button onClick={homeClicked} variant="contained" startIcon={<HomeIcon />}>
                                Home Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Error403;
