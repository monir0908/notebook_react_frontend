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

import img1 from '../../../assets/images/pages/img-maintenance-bg.svg';
import img2 from '../../../assets/images/pages/img-error-text.svg';
import img3 from '../../../assets/images/pages/img-error-primary-widget.svg';
import img4 from '../../../assets/images/pages/img-error-secondary-widget.svg';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Error404 = () => {
    const { loading, userInfo, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const loginClicked = () => {
        navigate('/login');
    };
    const theme = useTheme();

    return (
        <Grid sx={{ my: 10 }} container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={12}>
                <Card className="error-card">
                    <CardContent>
                        <div className="error-image-block">
                            <img className="image-animated img-fluid" src={img1} alt="image1" />
                            <img src={img2} className="img-404 error-text" alt="image2" />
                            <img src={img4} className="img-404 error-primary" alt="image3" />
                            <img src={img4} className="img-404 puple error-secondary" alt="image4" />
                        </div>
                        <div className="text-center">
                            <h1 className="mt-4">
                                <b>Something is wrong</b>
                            </h1>
                            <p className="mt-4 text-muted">
                                The page you are looking was moved, removed,
                                <br />
                                renamed, or might never exist!
                            </p>
                            <Button onClick={loginClicked} variant="contained" startIcon={<LoginIcon />}>
                                Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default Error404;
