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
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ShareIcon from '@mui/icons-material/Share';
import PublishIcon from '@mui/icons-material/Publish';
const ContextMenuDocument = (props) => {
    const side = 300;
    const padding = 80;
    const margin = 100;

    return (
        <>
            <Menu
                anchorReference="anchorPosition"
                anchorPosition={{ top: props.coordinates[1], left: props.coordinates[0] + 10 }}
                anchorOrigin={{
                    vertical: (props.coordinates[1] - (margin + padding)) / side <= 0.5 ? 'top' : 'bottom',
                    horizontal: (props.coordinates[0] - (margin + padding)) / side <= 0.5 ? 'left' : 'right'
                }}
                id="account-menu"
                open={props.open}
                onClose={props.handleClose}
                onClick={props.handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
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
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <MenuItem onClick={props.handleClose}>
                    <ListItemIcon>
                        <ShareIcon fontSize="1rem" />
                    </ListItemIcon>
                    Share
                </MenuItem>
                <MenuItem onClick={props.handlePublishClick}>
                    <ListItemIcon>
                        <PublishIcon fontSize="small" />
                    </ListItemIcon>
                    Publish
                </MenuItem>
                <Divider />

                <MenuItem onClick={props.handleDeleteClick}>
                    <ListItemIcon>
                        <DeleteForeverIcon fontSize="small" />
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContextMenuDocument;
