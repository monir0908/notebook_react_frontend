import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
// assets

const Error403 = () => {
    const { loading, userInfo, error } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const homeClicked = () => {
        navigate('/home');
    };

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
