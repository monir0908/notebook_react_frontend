import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
import { IconChevronRight, IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';
import Tooltip from '@mui/material/Tooltip';
import ContextMenuCollection from 'layout/components/contextMenuCollection';
import { documentCreate } from 'store/features/document/documentActions';
import { collectionList, collectionUpdate, collectionDelete } from 'store/features/collection/collectionActions';
import CollectionDialog from 'layout/components/collectionDialog';
import ConfirmationDialog from 'layout/components/confirmationDialog';
// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customization = useSelector((state) => state.customization);
    const userInfo = useSelector((state) => state.auth.userInfo);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [selectedMenu, setSelectedMenu] = useState(null);

    //////////////////////////// context menu //////////////////////////////
    const [anchorEl, setAnchorEl] = useState(null);
    const openContextMenu = Boolean(anchorEl);
    const handleContextMenuClick = (event, menu) => {
        setAnchorEl(event.currentTarget);
        setSelectedMenu(menu);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
    };
    //////////////////////////// edit dialog //////////////////////////////
    const [openCCDialog, setOpenCCDialog] = useState(false);
    const handleCCDialogClickOpen = () => {
        setOpenCCDialog(true);
    };

    const handleCCDialogClose = () => {
        setOpenCCDialog(false);
    };
    const handleCCDialogOk = (values) => {
        dispatch(
            collectionUpdate({
                url: 'collection/update-collection/' + values.collecton_key,
                data: { collection_title: values.collecton_name }
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);

        setOpenCCDialog(false);
    };

    //////////////////////////// context menu //////////////////////////////
    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);
    };

    const { pathname } = useLocation();
    const checkOpenForParent = (child, id) => {
        child.forEach((item) => {
            if (item.url === pathname) {
                setOpen(true);
                setSelected(id);
            }
        });
    };

    const handleAddNewDocClick = (menu) => {
        dispatch(documentCreate({ url: 'document/create', navigate, data: { collection: menu.pk } }));
        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    //////////////////////////////// delete confirmation /////////
    const [openConfirmation, setOpenConfirmation] = useState(false);

    const handleClickOpenConfirmation = () => {
        setOpenConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setOpenConfirmation(false);
    };
    const handleConfirmationDialogOk = (values) => {
        dispatch(
            collectionDelete({
                url: 'collection/delete-collection/' + values.pk,
                navigate
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
        setOpenConfirmation(false);
    };

    // menu collapse for sub-levels
    useEffect(() => {
        setOpen(false);
        setSelected(null);
        if (menu.children) {
            menu.children.forEach((item) => {
                if (item.children?.length) {
                    checkOpenForParent(item.children, menu.id);
                }
                if (item.url === pathname) {
                    setSelected(menu.id);
                    setOpen(true);
                }
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, menu.children]);

    const itemCollectionClicked = (item) => {
        navigate('/collection/' + item.id);
    };

    // menu collapse & item
    const menus = menu.children?.map((item) => {
        switch (item.type) {
            case 'collapse':
                return <NavCollapse key={item.id} menu={item} level={level + 1} />;
            case 'item':
                return <NavItem key={item.id} item={item} level={level + 1} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    const Icon = menu.icon;
    const menuIcon = menu.icon ? (
        <Icon strokeWidth={1.5} size="1.3rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: selected === menu.id ? 8 : 6,
                height: selected === menu.id ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    return (
        <>
            <ListItemButton
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 10}px`
                }}
                selected={selected === menu.id}
            >
                {open ? (
                    <IconChevronDown onClick={handleClick} stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronRight onClick={handleClick} stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
                <ListItemIcon onClick={handleClick} sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>
                    {menuIcon}
                </ListItemIcon>

                <ListItemText
                    onClick={handleClick}
                    primary={
                        <Typography
                            onClick={() => {
                                itemCollectionClicked(menu);
                            }}
                            variant={selected === menu.id ? 'h5' : 'body1'}
                            color="inherit"
                            sx={{ my: 'auto' }}
                        >
                            {menu.title}
                        </Typography>
                    }
                    secondary={
                        menu.caption && (
                            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                {menu.caption}
                            </Typography>
                        )
                    }
                />
                <Tooltip title="New Doc" arrow placement="top">
                    <IconButton
                        onClick={() => handleAddNewDocClick(menu)}
                        size="1rem"
                        aria-label="add"
                        style={{ marginTop: '-5px', marginRight: '-5px', cursor: 'pointer' }}
                    >
                        <IconPlus size="1rem" />
                    </IconButton>
                </Tooltip>
                <IconButton
                    onClick={(event) => handleContextMenuClick(event, menu)}
                    size="1rem"
                    aria-label="option"
                    style={{ float: 'right', marginTop: '-5px', marginRight: '-15px', cursor: 'pointer' }}
                >
                    <IconDots size="1rem" />
                </IconButton>
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List
                    component="div"
                    disablePadding
                    sx={{
                        position: 'relative',
                        '&:after': {
                            content: "''",
                            position: 'absolute',
                            left: '32px',
                            top: 0,
                            height: '100%',
                            width: '1px',
                            opacity: 1,
                            background: theme.palette.primary.light
                        }
                    }}
                >
                    {menus}
                </List>
            </Collapse>

            <ContextMenuCollection
                anchorEl={anchorEl}
                open={openContextMenu}
                handleClose={handleContextMenuClose}
                handleEditClick={handleCCDialogClickOpen}
                handleDeleteClick={handleClickOpenConfirmation}
            />
            <CollectionDialog
                title="Edit the collection"
                description="Edit your collection name."
                saveButtonText="Update"
                data={selectedMenu}
                open={openCCDialog}
                handleClose={handleCCDialogClose}
                handleCCDialogOk={(values) => {
                    handleCCDialogOk(values);
                }}
            />
            <ConfirmationDialog
                title="Delete Collection"
                description="If you delete this collection, associate documents will be deleted. Do you agree with that?"
                open={openConfirmation}
                data={selectedMenu}
                handleClose={handleCloseConfirmation}
                handleOk={(values) => handleConfirmationDialogOk(values)}
            />
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
