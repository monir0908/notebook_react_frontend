import * as React from 'react';
import { Button, Card, Typography, Stack, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { LoadingButton } from '@mui/lab';
import SvgIconStyle from 'ui-component/SvgIconStyle';
import CloseIcon from 'assets/icons/svg/close-icon.svg';
import AttachmentListTable from './AttachmentListTable';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AttachmentListDialog = (props) => {
    return (
        <Dialog
            maxWidth={'828px'}
            maxHeight={'651px'}
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
                    sx={{
                        textAlign: 'center',
                        padding: {
                            xs: '16px 16px 16px 16px',
                            sm: '16px 16px 16px 16px',
                            md: '16px 16px 16px 16px',
                            lg: '28px 60px 60px 60px',
                            xl: '28px 60px 60px 60px'
                        }
                    }}
                >
                    <Typography paragraph sx={{ color: '#092625', fontSize: '24px', fontWeight: 700, mt: 1, color: '#092625' }}>
                        {props.title}
                    </Typography>
                    <AttachmentListTable />
                </DialogContent>
            </Card>
        </Dialog>
    );
};

export default AttachmentListDialog;
