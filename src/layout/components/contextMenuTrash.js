import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

// import { IconPencil, IconTrash } from '@tabler/icons';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import DeleteIcon from '@mui/icons-material/Delete';
const ContextMenuTrash = (props) => {
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
                <MenuItem onClick={props.handleEditClick}>
                    <ListItemIcon>
                        <SettingsBackupRestoreIcon fontSize="1rem" />
                    </ListItemIcon>
                    Restore
                </MenuItem>
                <MenuItem onClick={props.handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteIcon style={{ color: 'red' }} fontSize="small" />
                    </ListItemIcon>
                    <Typography color="red">Permanently delete</Typography>
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContextMenuTrash;
