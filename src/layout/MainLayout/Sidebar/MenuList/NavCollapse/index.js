import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import IconButton from '@mui/material/IconButton';
import { IconChevronDown, IconChevronUp, IconPlus, IconDots } from '@tabler/icons';
import Tooltip from '@mui/material/Tooltip';
import ContextMenu from './contextMenu';

// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
    const theme = useTheme();
    const customization = useSelector((state) => state.customization);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    //////////////////////////// context menu //////////////////////////////
    // const side = 300;
    // const padding = 80;
    // const margin = 100;
    // const [coordinates, setCoordinates] = useState([0, 0]);
    const [anchorEl, setAnchorEl] = useState(null);
    const openContextMenu = Boolean(anchorEl);
    const handleContextMenuClick = (event) => {
        // if (
        //     event.pageX >= padding + margin &&
        //     event.pageX <= side + padding + margin &&
        //     event.pageY >= padding + margin &&
        //     event.pageY <= side + padding + margin
        // ) {
        //     setCoordinates([event.pageX, event.pageY]);
        // }
        setAnchorEl(event.currentTarget);
    };
    const handleContextMenuClose = () => {
        setAnchorEl(null);
    };
    //////////////////////////// context menu //////////////////////////////
    const handleClick = () => {
        setOpen(!open);
        setSelected(!selected ? menu.id : null);

        console.log(menu);
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
                    <IconChevronUp stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                ) : (
                    <IconChevronDown stroke={1.5} size="1rem" style={{ marginTop: 'auto', marginBottom: 'auto' }} />
                )}
                <ListItemIcon sx={{ my: 'auto', minWidth: !menu.icon ? 18 : 36 }}>{menuIcon}</ListItemIcon>
                <ListItemText
                    primary={
                        <Typography
                            onClick={handleClick}
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
                    <IconButton size="1rem" aria-label="add" style={{ marginTop: '-5px', marginRight: '-5px', cursor: 'pointer' }}>
                        <IconPlus size="1rem" />
                    </IconButton>
                </Tooltip>
                <IconButton
                    onClick={handleContextMenuClick}
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

            <ContextMenu
                // coordinates={coordinates}
                type="collection"
                anchorEl={anchorEl}
                open={openContextMenu}
                handleClose={handleContextMenuClose}
            />
        </>
    );
};

NavCollapse.propTypes = {
    menu: PropTypes.object,
    level: PropTypes.number
};

export default NavCollapse;
