import PropTypes from 'prop-types';
import { forwardRef, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material';

// project imports
import { MENU_OPEN, SET_MENU } from 'store/actions';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
import { IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';
import Tooltip from '@mui/material/Tooltip';
import ContextMenuDocument from 'layout/components/contextMenuDocument';
import { documentUpdate } from 'store/features/document/documentActions';
import { collectionList } from 'store/features/collection/collectionActions';
import ConfirmationDialog from 'layout/components/confirmationDialog';
// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customization = useSelector((state) => state.customization);
    const matchesSM = useMediaQuery(theme.breakpoints.down('lg'));
    const userInfo = useSelector((state) => state.auth.userInfo);
    //////////////////////////// context menu //////////////////////////////
    const side = 300;
    const padding = 80;
    const margin = 100;
    const [coordinatesItem, setCoordinatesItem] = useState([0, 0]);
    const [anchorElItem, setAnchorElItem] = useState(null);
    const openContextMenuItem = Boolean(anchorElItem);
    const handleContextMenuClick = (event) => {
        if (
            event.pageX >= padding + margin &&
            event.pageX <= side + padding + margin &&
            event.pageY >= padding + margin &&
            event.pageY <= side + padding + margin
        ) {
            setCoordinatesItem([event.pageX, event.pageY]);
        }
        setAnchorElItem(event.currentTarget);
    };
    const handleContextMenuItemClose = () => {
        setAnchorElItem(null);
    };
    //////////////////////////// context menu //////////////////////////////

    const Icon = item.icon;
    const itemIcon = item?.icon ? (
        <Icon stroke={1.5} size="1.3rem" />
    ) : (
        <FiberManualRecordIcon
            sx={{
                width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
                height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
            }}
            fontSize={level > 0 ? 'inherit' : 'medium'}
        />
    );

    let itemTarget = '_self';
    if (item.target) {
        itemTarget = '_blank';
    }

    let listItemProps = {
        component: forwardRef((props, ref) => <Link ref={ref} {...props} to={item.url} target={itemTarget} />)
    };
    if (item?.external) {
        listItemProps = { component: 'a', href: item.url, target: itemTarget };
    }

    const itemHandler = (id) => {
        dispatch({ type: MENU_OPEN, id });
        if (matchesSM) dispatch({ type: SET_MENU, opened: false });
    };

    // active menu item on page load
    useEffect(() => {
        const currentIndex = document.location.pathname
            .toString()
            .split('/')
            .findIndex((id) => id === item.id);
        if (currentIndex > -1) {
            dispatch({ type: MENU_OPEN, id: item.id });
        }
        // eslint-disable-next-line
    }, []);

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
            documentUpdate({
                url: 'document/update-status/' + values.id,
                navigate,
                data: {
                    doc_status: 3
                },
                extraData: {
                    status: 'delete',
                    col_key: values.col_key,
                    doc_url: values.url
                }
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
        setOpenConfirmation(false);
    };

    const handleDocPublish = (values) => {
        dispatch(
            documentUpdate({
                url: 'document/update-status/' + values.id,
                navigate,
                data: {
                    doc_status: 2
                },
                extraData: {
                    status: 'publish',
                    col_key: values.col_key,
                    doc_url: values.url
                }
            })
        );

        setTimeout(() => {
            const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
            dispatch(collectionList({ url }));
        }, 500);
    };

    return (
        <>
            <ListItemButton
                {...listItemProps}
                disabled={item.disabled}
                sx={{
                    borderRadius: `${customization.borderRadius}px`,
                    mb: 0.5,
                    alignItems: 'flex-start',
                    backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
                    py: level > 1 ? 1 : 1.25,
                    pl: `${level * 24}px`
                }}
                selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
                onClick={() => itemHandler(item.id)}
            >
                <ListItemIcon sx={{ my: 'auto', minWidth: !item?.icon ? 18 : 36 }}>{itemIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography variant={customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1'} color="inherit">
                            {item.title}
                        </Typography>
                    }
                    secondary={
                        item.caption && (
                            <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                {item.caption}
                            </Typography>
                        )
                    }
                />
                {item.chip && (
                    <Chip
                        color={item.chip.color}
                        variant={item.chip.variant}
                        size={item.chip.size}
                        label={item.chip.label}
                        avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
                    />
                )}
                {item.dynamic && (
                    <div>
                        <IconButton
                            onClick={handleContextMenuClick}
                            size="1rem"
                            aria-label="option"
                            style={{ float: 'right', marginTop: '-5px', marginRight: '-15px', cursor: 'pointer' }}
                        >
                            <IconDots size="1rem" />
                        </IconButton>
                    </div>
                )}
            </ListItemButton>
            <ContextMenuDocument
                coordinates={coordinatesItem}
                anchorEl={anchorElItem}
                open={openContextMenuItem}
                handleClose={handleContextMenuItemClose}
                handleDeleteClick={handleClickOpenConfirmation}
                handlePublishClick={() => handleDocPublish(item)}
            />

            <ConfirmationDialog
                title="Delete Decument"
                description="If you delete this document,it will be moved to trash . Are you agree with that?"
                open={openConfirmation}
                data={item}
                handleClose={handleCloseConfirmation}
                handleOk={(values) => handleConfirmationDialogOk(values)}
            />
        </>
    );
};

NavItem.propTypes = {
    item: PropTypes.object,
    level: PropTypes.number
};

export default NavItem;
