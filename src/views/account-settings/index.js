// project imports
import { useState, useEffect } from 'react';
import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Grid,
    IconButton,
    Divider,
    Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import SubCard from 'ui-component/cards/SubCard';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';

import { setProfilePic, setProfileData } from 'store/features/auth/authSlice';
import { changePassword } from 'store/features/auth/authActions';
import API from 'helpers/jwt.interceptor';
import { SET_LOADER } from 'store/actions';
import UpdateProfileDialog from 'layout/components/updateProfileDialog';
// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

const AccountSettings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const theme = useTheme();
    const { loading, userInfo, profile_pic, userToken } = useSelector((state) => state.auth);

    const tableCellStyle = {
        borderBottom: 'none',
        padding: '8px'
    };

    useEffect(() => {
        if (!userToken) {
            navigate('/login');
        }
        if (loading) {
            dispatch({ type: SET_LOADER, loader: true });
        } else {
            dispatch({ type: SET_LOADER, loader: false });
        }
    }, [loading]);

    const handlePicChange = async (e) => {
        const image = e.target.files[0];
        console.log(image);
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
                <MainCard title="Account Settings">
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

                        <Grid item md={12}>
                            <Formik
                                initialValues={{
                                    old_password: '',
                                    new_password: '',
                                    confirm_password: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    old_password: Yup.string().max(255).required('Current password is required'),
                                    new_password: Yup.string().max(255).required('New password is required'),
                                    confirm_password: Yup.string()
                                        .oneOf([Yup.ref('new_password'), null], "Passwords don't match")
                                        .required('Confirm password is required')
                                })}
                                onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                                    try {
                                        console.log(values);

                                        await dispatch(
                                            changePassword({ old_password: values.old_password, new_password: values.new_password })
                                        );
                                        resetForm();
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            >
                                {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, resetForm }) => (
                                    <form noValidate onSubmit={handleSubmit}>
                                        <SubCard title="Change Password">
                                            <Grid container spacing={1}>
                                                <Grid item md={6}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.old_password && errors.old_password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password-login">
                                                            Enter your current password
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-size-small"
                                                            defaultValue="Small"
                                                            size="small"
                                                            type="password"
                                                            value={values.old_password}
                                                            name="old_password"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                        />
                                                        {touched.old_password && errors.old_password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                                {errors.old_password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={1}>
                                                <Grid item md={6}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.new_password && errors.new_password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password-login">
                                                            Enter your new password
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-size-small"
                                                            defaultValue="Small"
                                                            size="small"
                                                            type="password"
                                                            value={values.new_password}
                                                            name="new_password"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                        />
                                                        {touched.new_password && errors.new_password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                                {errors.new_password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                                <Grid item md={6}>
                                                    <FormControl
                                                        fullWidth
                                                        error={Boolean(touched.confirm_password && errors.confirm_password)}
                                                        sx={{ ...theme.typography.customInput }}
                                                    >
                                                        <InputLabel htmlFor="outlined-adornment-password-login">
                                                            Enter your password again
                                                        </InputLabel>
                                                        <OutlinedInput
                                                            id="outlined-size-small"
                                                            defaultValue="Small"
                                                            size="small"
                                                            type="password"
                                                            value={values.confirm_password}
                                                            name="confirm_password"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            inputProps={{}}
                                                        />
                                                        {touched.confirm_password && errors.confirm_password && (
                                                            <FormHelperText error id="standard-weight-helper-text-password-login">
                                                                {errors.confirm_password}
                                                            </FormHelperText>
                                                        )}
                                                    </FormControl>
                                                </Grid>
                                            </Grid>

                                            {errors.submit && (
                                                <Box sx={{ mt: 3 }}>
                                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                                </Box>
                                            )}
                                            <Divider sx={{ my: 3 }} />
                                            <Grid container spacing={2} direction="row" justifyContent="flex-end" alignItems="center">
                                                <Grid item>
                                                    <Button type="submit" color="error" variant="contained">
                                                        Change Password
                                                    </Button>
                                                </Grid>
                                                <Grid item>
                                                    <Button onClick={resetForm} type="reset" variant="outlined">
                                                        Clear
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </SubCard>
                                    </form>
                                )}
                            </Formik>
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
