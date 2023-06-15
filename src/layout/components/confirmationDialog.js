import * as React from 'react';
import { Button, Card, Typography, Stack, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { LoadingButton } from '@mui/lab';
import SvgIconStyle from 'ui-component/SvgIconStyle';
import deleteIcon from 'assets/icons/svg/delete-icon.svg';
import CloseIcon from 'assets/icons/svg/close-icon.svg';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationDialog = (props) => {
    return (
        <Dialog
            width={'382px'}
            maxHeight={'290px'}
            PaperProps={{
                style: { borderRadius: '16px' }
            }}
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={props.handleClose}
                    sx={{ position: 'absolute', right: '18px', alignItems: 'center', alignSelf: 'flex-end', justifyContent: 'flex-end' }}
                >
                    <SvgIconStyle src={CloseIcon} sx={{ color: '#01927B', width: 11.96, height: 11.96 }} />
                </IconButton>
            </DialogTitle>
            <Card>
                <DialogContent
                    sx={{ width: '382px', textAlign: 'center', paddingLeft: 7.5, paddingRight: 7.5, paddingTop: 2.5, paddingBottom: 7.5 }}
                >
                    <Typography paragraph sx={{ color: '#092625', fontSize: '24px', fontWeight: 700, mt: 1, color: '#092625' }}>
                        {props.title}
                    </Typography>
                    <Typography paragraph sx={{ mt: 3.5, color: '#092625' }}>
                        {props.description}
                    </Typography>
                    <Stack direction="row" justifyContent={'center'} spacing={1.5} sx={{ mt: 3.5 }}>
                        <Button
                            onClick={props.handleClose}
                            color="inherit"
                            variant="outlined"
                            size="large"
                            sx={{ padding: '10px 32px', fontSize: '14px', fontWeight: 300, lineHeight: '20.02px', borderRadius: '100px' }}
                        >
                            {props.closeButtonText ? props.closeButtonText : 'Disagree'}
                        </Button>
                        <LoadingButton
                            startIcon={<SvgIconStyle src={deleteIcon} sx={{ color: '#fff', width: 10.67, height: 12 }} />}
                            type="submit"
                            color="error"
                            variant="contained"
                            size="large"
                            sx={{
                                padding: '10px 32px',
                                fontSize: '14px',
                                fontWeight: 300,
                                lineHeight: '20.02px',
                                background: '#D22D2C',
                                borderRadius: '100px'
                            }}
                            onClick={() => props.handleOk(props.data)}
                        >
                            {props.okButtonText ? props.okButtonText : 'Agree'}
                        </LoadingButton>
                    </Stack>
                </DialogContent>
            </Card>
        </Dialog>
    );
};

export default ConfirmationDialog;
