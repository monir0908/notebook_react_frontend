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
import IconH3 from 'ui-component/custom-icon/IconH3';
import IconOl from 'ui-component/custom-icon/IconOl';
import IconUl from 'ui-component/custom-icon/IconUl';

const ContextMenuEditor = (props) => {
    const side = 300;
    const padding = 80;
    const margin = 100;

    const handleKeyDown = (e, type) => {
        if (e.key === 'Enter') {
            props.handleEditorOnEnter(type);
        }
    };

    const handleOnClick = (e, type) => {
        if (e) {
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
                // transformOrigin={{
                //     vertical: 'bottom',
                //     horizontal: 'left'
                // }}
            >
                <MenuItem onClick={(event) => handleOnClick(event, 'h1')} onKeyDown={(event) => handleKeyDown(event, 'h1')}>
                    <ListItemIcon>
                        <IconH1 fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Big heading</ListItemText>
                </MenuItem>
                <MenuItem onClick={(event) => handleOnClick(event, 'h2')} onKeyDown={(event) => handleKeyDown(event, 'h2')}>
                    <ListItemIcon>
                        <IconH2 fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Medium heading</ListItemText>
                </MenuItem>
                <MenuItem onClick={(event) => handleOnClick(event, 'h3')} onKeyDown={(event) => handleKeyDown(event, 'h3')}>
                    <ListItemIcon>
                        <IconH3 fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Small heading</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={(event) => handleOnClick(event, 'bullet')} onKeyDown={(event) => handleKeyDown(event, 'h3')}>
                    <ListItemIcon>
                        <IconUl fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Bulleted list</ListItemText>
                </MenuItem>
                <MenuItem onClick={(event) => handleOnClick(event, 'ordered')} onKeyDown={(event) => handleKeyDown(event, 'h3')}>
                    <ListItemIcon>
                        <IconOl fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Ordered list</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};
export default ContextMenuEditor;
