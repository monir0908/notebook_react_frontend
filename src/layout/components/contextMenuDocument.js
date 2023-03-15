import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import PublishIcon from '@mui/icons-material/Publish';
import UnpublishedIcon from '@mui/icons-material/Unpublished';

import {
    updateDoc,
    updateDocId,
    updateShareButton,
    updatePublishButton,
    updateUnpublishButton,
    updateDeleteButton,
    resetStateHeader
} from 'store/features/header/headerSlice';

const ContextMenuDocument = (props) => {
    const side = 300;
    const padding = 80;
    const margin = 100;
    const dispatch = useDispatch();
    const { doc_id, doc, share_show, publish_show, unpublish_show, delete_show } = useSelector((state) => state.header);

    // if (doc.doc_status == 1) {
    //     dispatch(updatePublishButton({ isPublishShow: true }));
    //     dispatch(updateUnpublishButton({ isUnpublishShow: false }));
    //     dispatch(updateDeleteButton({ isDeleteShow: true }));
    //     dispatch(updateShareButton({ isDeleteShow: false }));
    // } else if (doc.doc_status == 2) {
    //     dispatch(updatePublishButton({ isPublishShow: false }));
    //     dispatch(updateUnpublishButton({ isUnpublishShow: true }));
    //     dispatch(updateShareButton({ isShareShow: true }));
    //     dispatch(updateDeleteButton({ isDeleteShow: true }));
    // } else if (doc.doc_status == 3 || doc.doc_status == 4) {
    //     dispatch(updatePublishButton({ isPublishShow: false }));
    //     dispatch(updateShareButton({ isShareShow: false }));
    //     dispatch(updateUnpublishButton({ isDeleteShow: false }));
    //     dispatch(updateDeleteButton({ isDeleteShow: false }));
    // }

    // // active menu item on page load
    useEffect(() => {
        if (doc.doc_status == 1) {
            dispatch(updatePublishButton({ isPublishShow: true }));
            dispatch(updateUnpublishButton({ isUnpublishShow: false }));
            dispatch(updateDeleteButton({ isDeleteShow: true }));
            dispatch(updateShareButton({ isShareShow: false }));
        } else if (doc.doc_status == 2) {
            dispatch(updatePublishButton({ isPublishShow: false }));
            dispatch(updateUnpublishButton({ isUnpublishShow: true }));
            dispatch(updateShareButton({ isShareShow: true }));
            dispatch(updateDeleteButton({ isDeleteShow: true }));
        } else if (doc.doc_status == 3 || doc.doc_status == 4) {
            dispatch(updatePublishButton({ isPublishShow: false }));
            dispatch(updateShareButton({ isShareShow: false }));
            dispatch(updateUnpublishButton({ isDeleteShow: false }));
            dispatch(updateDeleteButton({ isDeleteShow: false }));
        }
    }, [doc]);

    return (
        <>
            <Menu
                anchorReference="anchorPosition"
                anchorPosition={props.anchorPosition}
                // anchorPosition={{ top: props.coordinates[1], left: props.coordinates[0] + 10 }}
                anchorOrigin={{
                    vertical: (props.coordinates[1] - (margin + padding)) / side <= 0.5 ? 'top' : 'bottom',
                    horizontal: (props.coordinates[0] - (margin + padding)) / side <= 0.5 ? 'left' : 'right'
                }}
                id="menu-document"
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
                {share_show && (
                    <MenuItem onClick={props.handleShareClick}>
                        <ListItemIcon>
                            <ShareIcon fontSize="1rem" />
                        </ListItemIcon>
                        Share
                    </MenuItem>
                )}
                {publish_show && (
                    <MenuItem onClick={() => props.handlePublishClick(doc)}>
                        <ListItemIcon>
                            <PublishIcon fontSize="small" />
                        </ListItemIcon>
                        Publish
                    </MenuItem>
                )}
                {unpublish_show && (
                    <MenuItem onClick={() => props.handleDocUnpublish(doc)}>
                        <ListItemIcon>
                            <UnpublishedIcon fontSize="small" />
                        </ListItemIcon>
                        Unpublish
                    </MenuItem>
                )}
                <Divider />
                {delete_show && (
                    <MenuItem onClick={props.handleDeleteClick}>
                        <ListItemIcon>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        Delete
                    </MenuItem>
                )}
            </Menu>
        </>
    );
};
export default ContextMenuDocument;
