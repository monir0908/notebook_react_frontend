/* eslint-disable jsx-a11y/no-autofocus */
import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { FormControl, FormControlLabel, FormHelperText, InputLabel, useMediaQuery, OutlinedInput } from '@mui/material';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import useScriptRef from 'hooks/useScriptRef';

import * as Yup from 'yup';
import { Formik } from 'formik';

const UpdateProfileDialog = (props) => {
    const theme = useTheme();
    return (
        <div>
            <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.handleClose}>
                <Formik
                    initialValues={{
                        first_name: props.data ? props.data.first_name : '',
                        last_name: props.data ? props.data.last_name : ''
                    }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                        first_name: Yup.string().max(255).required('First name is required'),
                        last_name: Yup.string().max(255).required('Last name is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            const obj = {
                                first_name: values.first_name,
                                last_name: values.last_name
                            };
                            props.handleDialogOk(obj);
                        } catch (err) {}
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <DialogTitle>{props.title}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>{props.description}</DialogContentText>
                                {/* <FormControl fullWidth error={Boolean(touched.first_name && errors.first_name)}>
                                    <TextField
                                        sx={{
                                            marginTop: '20px'
                                        }}
                                        autoFocus
                                        margin="dense"
                                        id="collectionName"
                                        label="Collection Name"
                                        type="text"
                                        onChange={handleChange}
                                        value={values.collecton_name}
                                        variant="outlined"
                                        name="collecton_name"
                                    />
                                    {touched.collecton_name && errors.collecton_name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.collecton_name}
                                        </FormHelperText>
                                    )}
                                </FormControl> */}

                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.first_name && errors.first_name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-first-name-register">First Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-first-name-register"
                                        type="text"
                                        value={values.first_name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        name="first_name"
                                    />
                                    {touched.first_name && errors.first_name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.first_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                                <FormControl
                                    fullWidth
                                    error={Boolean(touched.last_name && errors.last_name)}
                                    sx={{ ...theme.typography.customInput }}
                                >
                                    <InputLabel htmlFor="outlined-adornment-last-name-register">Last Name</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-last-name-register"
                                        type="text"
                                        value={values.last_name}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        name="last_name"
                                    />
                                    {touched.last_name && errors.last_name && (
                                        <FormHelperText error id="standard-weight-helper-text--register">
                                            {errors.last_name}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={props.handleClose}>Cancel</Button>
                                <Button type="submit">{props.saveButtonText ? props.saveButtonText : 'Save'}</Button>
                            </DialogActions>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};

export default UpdateProfileDialog;
