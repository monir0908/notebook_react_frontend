/* eslint-disable jsx-a11y/no-autofocus */
import * as React from 'react';

import { useTheme } from '@mui/material/styles';
import { FormControl, FormControlLabel, FormHelperText, useMediaQuery } from '@mui/material';

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

const CollectionDialog = (props) => {
    const theme = useTheme();
    return (
        <div>
            <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.handleClose}>
                <Formik
                    initialValues={{
                        collecton_name: props.data ? props.data.title : ''
                    }}
                    enableReinitialize={true}
                    validationSchema={Yup.object().shape({
                        collecton_name: Yup.string().max(255).required('Collection name is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            const obj = {
                                collecton_name: values.collecton_name,
                                collecton_key: props.data ? props.data.id : null
                            };
                            props.handleCCDialogOk(obj);
                        } catch (err) {}
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit}>
                            <DialogTitle>{props.title}</DialogTitle>
                            <DialogContent>
                                <DialogContentText>{props.description}</DialogContentText>
                                <FormControl fullWidth error={Boolean(touched.collecton_name && errors.collecton_name)}>
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

export default CollectionDialog;
