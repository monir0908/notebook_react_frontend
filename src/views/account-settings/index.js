// project imports
import React, { useState, useEffect } from 'react';
import { Grid, Link, IconButton, Typography, Divider, MuiTypography } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { setProfilePic, setProfileData } from 'store/features/auth/authSlice';
import API from 'helpers/jwt.interceptor';
import { SET_LOADER } from 'store/actions';
import UpdateProfileDialog from 'layout/components/updateProfileDialog';
// ==============================|| Account Settings ||============================== //

const AccountSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { userInfo, profile_pic, userToken } = useSelector((state) => state.auth);

    const tableCellStyle = {
        borderBottom: 'none',
        padding: '8px'
    };

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        }
    });

    const handlePicChange = async (e) => {
        const image = e.target.files[0];

        if (image) {
            const formData = new FormData();
            formData.append('profile_pic', image);

            dispatch({ type: SET_LOADER, loader: true });
            const res = await API.put('user/update-profile-pic/' + userInfo.id, formData);
            if (res.data.state == 'success') {
                dispatch({ type: SET_LOADER, loader: false });
                toast.success(res.data.message, { autoClose: 3000 });
                dispatch(setProfilePic({ data: res.data.profile_pic }));
            } else {
                dispatch({ type: SET_LOADER, loader: false });
                toast.warn(res.data.message, { autoClose: 3000 });
            }
        }
    };

    //////////////////////////// edit dialog //////////////////////////////
    const [openDialog, setOpenDialog] = useState(false);
    const handleDialogClickOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const handleDialogOk = async (values) => {
        const obj = {
            first_name: values.first_name,
            last_name: values.last_name
        };

        dispatch({ type: SET_LOADER, loader: true });
        const res = await API.put('user/update-profile/' + userInfo.id, obj);
        if (res.data.state == 'success') {
            dispatch({ type: SET_LOADER, loader: false });
            toast.success(res.data.message, { autoClose: 3000 });
            dispatch(setProfileData({ data: { first_name: res.data.first_name, last_name: res.data.last_name } }));
        } else {
            dispatch({ type: SET_LOADER, loader: false });
            toast.warn(res.data.message, { autoClose: 3000 });
        }

        setOpenDialog(false);
    };

    return (
        <>
            {userInfo != null && (
                <MainCard title="Account Setting">
                    <Grid container spacing={gridSpacing}>
                        <Grid item md={12}>
                            <Card
                                sx={{
                                    border: '1px solid',
                                    borderColor: theme.palette.primary.light,
                                    ':hover': {
                                        boxShadow: '0 2px 14px 0 rgb(32 40 45 / 8%)'
                                    }
                                }}
                            >
                                <CardHeader
                                    avatar={<Avatar alt={userInfo.full_name} sx={{ width: 64, height: 64 }} src={profile_pic} />}
                                    action={
                                        <IconButton
                                            onChange={handlePicChange}
                                            color="primary"
                                            aria-label="upload picture"
                                            component="label"
                                        >
                                            <input hidden accept=".png, .jpg, .jpeg" type="file" />
                                            <PhotoCamera />
                                        </IconButton>
                                    }
                                    title={userInfo.full_name}
                                    subheader={userInfo.user_code}
                                />
                                <Divider />

                                <Grid container direction="row" justifyContent="flex-end" alignItems="flex-start">
                                    <Grid item>
                                        <IconButton onClick={handleDialogClickOpen} color="primary" sx={{ mr: 3 }} aria-label="Edit">
                                            <EditIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                <CardContent>
                                    <TableContainer>
                                        <Table aria-label="simple table">
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell style={{ width: '20%' }} sx={tableCellStyle} component="th" scope="row">
                                                        <b>First Name</b>
                                                    </TableCell>
                                                    <TableCell style={{ width: '5%' }} sx={tableCellStyle}>
                                                        :
                                                    </TableCell>
                                                    <TableCell sx={tableCellStyle} align="left">
                                                        {userInfo.first_name}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ width: '20%' }} sx={tableCellStyle} component="th" scope="row">
                                                        <b>Last Name</b>
                                                    </TableCell>
                                                    <TableCell style={{ width: '5%' }} sx={tableCellStyle}>
                                                        :
                                                    </TableCell>
                                                    <TableCell sx={tableCellStyle} align="left">
                                                        {userInfo.last_name}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell style={{ width: '20%' }} sx={tableCellStyle} component="th" scope="row">
                                                        <b>Email</b>
                                                    </TableCell>
                                                    <TableCell style={{ width: '5%' }} sx={tableCellStyle}>
                                                        :
                                                    </TableCell>
                                                    <TableCell sx={tableCellStyle} align="left">
                                                        {userInfo.email}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <UpdateProfileDialog
                        title="Update Profile"
                        description="You can edit your basic personal information (for example: first name, last name)"
                        open={openDialog}
                        data={userInfo}
                        saveButtonText="Update"
                        handleClose={handleDialogClose}
                        handleDialogOk={(values) => {
                            handleDialogOk(values);
                        }}
                    />
                </MainCard>
            )}
        </>
    );
};

export default AccountSettings;
