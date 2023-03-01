import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Divider, List, Typography } from '@mui/material';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IconPlus } from '@tabler/icons';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList, collectionCreate } from 'store/features/collection/collectionActions';
// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const handleCreateCollection = async () => {
        dispatch(collectionCreate({ url: 'collection/create' }));

        const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=100`;
        dispatch(collectionList({ url }));
    };

    // menu list collapse & items
    const items = item.children?.map((menu) => {
        switch (menu.type) {
            case 'collapse':
                return <NavCollapse key={menu.id} menu={menu} level={1} />;
            case 'item':
                return <NavItem key={menu.id} item={menu} level={1} />;
            default:
                return (
                    <Typography key={menu.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return (
        <>
            <List
                subheader={
                    item.title && (
                        <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
                            {item.title}{' '}
                            <Tooltip title="Add Collection" arrow placement="top">
                                <IconButton
                                    onClick={handleCreateCollection}
                                    aria-label="add"
                                    size="small"
                                    style={{ float: 'right', marginTop: '-5px', marginRight: '5px', cursor: 'pointer' }}
                                >
                                    <IconPlus fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                            {/* <IconPlus
                                onClick={handleCreateCollection}
                                stroke={2.5}
                                size="1.5rem"
                                style={{ float: 'right', marginRight: '5px', cursor: 'pointer' }}
                            /> */}
                            {item.caption && (
                                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                                    {item.caption}
                                </Typography>
                            )}
                        </Typography>
                    )
                }
            >
                {items}
            </List>

            {/* group divider */}
            <Divider sx={{ mt: 0.25, mb: 1.25 }} />
        </>
    );
};

NavGroup.propTypes = {
    item: PropTypes.object
};

export default NavGroup;
