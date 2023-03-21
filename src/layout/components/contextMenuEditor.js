import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';

// import { IconPencil, IconTrash } from '@tabler/icons';
import HMobiledataIcon from '@mui/icons-material/HMobiledata';
import IconH1 from 'ui-component/custom-icon/IconH1';
import IconH2 from 'ui-component/custom-icon/IconH2';

const ContextMenuEditor = (props) => {
    const side = 300;
    const padding = 80;
    const margin = 100;

    const handleKeyDown = (e, type) => {
        if (e.key === 'Enter') {
            props.handleEditorOnEnter(type);
        }
    };

    return (
        <>
            <Menu
                //anchorEl={props.anchorEl}
                id="editor-menu"
                open={props.open}
                onClose={props.handleClose}
                onClick={props.handleClose}
                anchorReference="anchorPosition"
                anchorPosition={props.anchorPosition}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left'
                }}
            >
                <MenuItem onKeyDown={(event) => handleKeyDown(event, 'h1')}>
                    <ListItemIcon>
                        <IconH1 fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Heading 1</ListItemText>
                </MenuItem>
                <MenuItem onKeyDown={(event) => handleKeyDown(event, 'h2')}>
                    <ListItemIcon>
                        <IconH2 fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Heading 2</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContextMenuEditor;
