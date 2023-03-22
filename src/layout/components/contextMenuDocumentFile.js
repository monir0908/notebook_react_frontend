import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// import { IconPencil, IconTrash } from '@tabler/icons';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';
const ContextMenuDocumentFile = (props) => {
    const getFileName = () => {
        if (props.data) {
            const arr = props.data.file.split('/');
            return arr[arr.length - 1];
        }
    };

    return (
        <>
            <Menu
                anchorEl={props.anchorEl}
                id="account-menu"
                open={props.open}
                onClose={props.handleClose}
                onClick={props.handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 0.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0
                        }
                    }
                }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <MenuItem onClick={() => props.handleOpenFileClick(props.data)}>
                    <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                        {props.data != null && props.data.file_name}
                    </Typography>
                </MenuItem>
                <MenuItem onClick={() => props.handleOpenFileClick(props.data)}>
                    <ListItemIcon>
                        <FileOpenIcon fontSize="1rem" />
                    </ListItemIcon>
                    Open File
                </MenuItem>

                <MenuItem onClick={() => props.handleDeleteClick(props.data)}>
                    <ListItemIcon>
                        <DeleteIcon style={{ color: 'red' }} fontSize="small" />
                    </ListItemIcon>
                    <Typography color="red">Delete File</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContextMenuDocumentFile;
