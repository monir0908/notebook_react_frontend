import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationDialog = (props) => {
    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={props.handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{props.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">{props.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}> {props.closeButtonText ? props.closeButtonText : 'Disagree'}</Button>
                    <Button onClick={() => props.handleOk(props.data)}>{props.closeButtonText ? props.closeButtonText : 'Agree'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ConfirmationDialog;
