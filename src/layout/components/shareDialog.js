import { forwardRef, useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import useCopyToClipboard from 'hooks/useCopyToClipboard.ts';

const ShareDialog = (props) => {
    const [value, copy] = useCopyToClipboard();
    return (
        <div>
            <Dialog fullWidth={true} maxWidth="sm" open={props.open} onClose={props.handleClose}>
                <DialogTitle>Share this document</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Only members with permission can view.</DialogContentText> */}
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <TextField
                                margin="dense"
                                id="address"
                                value={props.link}
                                label="Share Link"
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" style={{ float: 'right' }} onClick={props.handleClose}>
                        Close
                    </Button>
                    <Button variant="contained" onClick={() => copy(props.link)}>
                        Copy
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ShareDialog;
