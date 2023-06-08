import * as React from 'react';

import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Button, Card, Typography, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { LoadingButton } from '@mui/lab';
import SvgIconStyle from 'ui-component/SvgIconStyle';
import deleteIcon from 'assets/icons/svg/delete-icon.svg';
import publishIcon from 'assets/icons/svg/publish-icon.svg';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import { FormLabel } from '@mui/material';
import useCopyToClipboard from 'hooks/useCopyToClipboard.ts';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#01927B'
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

const PublishSettingDialog = (props) => {
    const { doc_id, doc, upload_show, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);
    const [sharelink, setShareLnk] = useState('');
    const [value, copy] = useCopyToClipboard();

    useEffect(() => {
        const clientURL = process.env.REACT_APP_PUBLICSITE_BASEURL;
        setShareLnk(clientURL + 'document/' + doc_id);
    }, [doc_id]);

    return (
        <Dialog
            width={'382px'}
            maxHeight={'290px'}
            PaperProps={{
                style: { borderRadius: 20 }
            }}
            open={props.open}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.handleClose}
            aria-describedby="alert-dialog-slide-description"
        >
            <Card>
                <BootstrapDialogTitle id="customized-dialog-title" onClose={props.handleClose}></BootstrapDialogTitle>
                <DialogContent sx={{ width: '382px', textAlign: 'center', padding: 2 }}>
                    <SvgIconStyle src={publishIcon} sx={{ color: 'grey', width: 36, height: 36 }} />
                    <Typography paragraph sx={{ color: '#092625', fontSize: '14px', fontWeight: 700, mt: 1, mb: 1, color: 'grey.600' }}>
                        {publish_show === true ? 'Publish this document?' : 'This document has been published.'}
                    </Typography>
                    {publish_show === true ? (
                        <Typography paragraph sx={{ color: 'grey', fontSize: '12px' }}>
                            {'You can allow others to view.'}
                        </Typography>
                    ) : (
                        ''
                    )}
                    {unpublish_show === true ? (
                        <Stack direction="row" justifyContent={'center'} spacing={1.5} sx={{ mt: 2, pb: 3 }}>
                            <Button
                                variant="outlined"
                                size="large"
                                sx={{
                                    padding: '10px 32px',
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    lineHeight: '20.02px',
                                    borderRadius: '100px',
                                    border: '1px solid #01927B',
                                    color: '#01927B'
                                }}
                                onClick={() => props.handleOk(1)}
                            >
                                {'Unpublish'}
                            </Button>
                        </Stack>
                    ) : (
                        ''
                    )}
                    {publish_show === true ? (
                        <Stack direction="row" justifyContent={'center'} spacing={1.5} sx={{ mt: 3.5, pb: 3 }}>
                            <LoadingButton
                                variant="contained"
                                size="large"
                                sx={{
                                    width: '100%',
                                    padding: '10px 32px',
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    lineHeight: '20.02px',
                                    borderRadius: '100px'
                                }}
                                style={{ background: 'linear-gradient(200deg, #00A5DC 30%, #37C36B 90%)' }}
                                onClick={() => props.handleOk(2)}
                            >
                                Publish
                            </LoadingButton>
                        </Stack>
                    ) : (
                        ''
                    )}
                    {unpublish_show === true ? (
                        <Stack direction="column" justifyContent={'center'} spacing={1.5} sx={{ mt: 0.775, pb: 3 }}>
                            <FormLabel
                                sx={{
                                    textAlign: 'left',
                                    color: '#949497',
                                    fontSize: '13px',
                                    fontWeight: 500
                                }}
                            >
                                Share link
                            </FormLabel>
                            <TextField
                                InputProps={{
                                    disableUnderline: true,
                                    style: {}
                                }}
                                variant="filled"
                                fullWidth
                                sx={{
                                    input: { paddingTop: '8px !important', backgroundColor: '#F3F4F4' },
                                    color: '#849392',
                                    fontSize: 16,
                                    fontWeight: 300,
                                    lineHeight: '22.88px'
                                }}
                                value={sharelink}
                                type="text"
                            />
                            <LoadingButton
                                variant="contained"
                                size="large"
                                sx={{
                                    width: '100%',
                                    padding: '10px 32px',
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    lineHeight: '20.02px',
                                    borderRadius: '100px'
                                }}
                                style={{ background: 'linear-gradient(200deg, #00A5DC 30%, #37C36B 90%)' }}
                                // onClick={() => props.handleOk(2)}
                                onClick={() => copy(sharelink)}
                            >
                                Copy link
                            </LoadingButton>
                        </Stack>
                    ) : (
                        ''
                    )}
                </DialogContent>
            </Card>
        </Dialog>
    );
};

export default PublishSettingDialog;
