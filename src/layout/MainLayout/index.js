import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { AppBar, Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';

// project imports
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Customization from '../Customization';
import navigation from 'menu-items';
import { drawerWidth } from 'store/constant';
import { SET_MENU, SET_LOADER } from 'store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';
import BlockUI from 'ui-component/block-ui/block-ui';
// styles
const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
        [theme.breakpoints.up('md')]: {
            marginLeft: -(drawerWidth - 20),
            width: `calc(100% - ${drawerWidth}px)`
        },
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px',
            width: `calc(100% - ${drawerWidth}px)`,
            padding: '16px',
            marginRight: '10px'
        }
    }),
    ...(open && {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: `calc(100% - ${drawerWidth}px)`,
        [theme.breakpoints.down('md')]: {
            marginLeft: '20px'
        },
        [theme.breakpoints.down('sm')]: {
            marginLeft: '10px'
        }
    })
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));
    // const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    // Handle left drawer
    const leftDrawerOpened = useSelector((state) => state.customization.opened);
    const loader = useSelector((state) => state.customization.loader);
    const dispatch = useDispatch();
    const handleLeftDrawerToggle = () => {
        dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
    };

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />

                {/* drawer */}
                <Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened} drawerToggle={handleLeftDrawerToggle} />

                {/* main content */}
                <Main theme={theme} open={leftDrawerOpened} sx={{ backgroundColor: '#fff' }}>
                    {/* header */}
                    <AppBar
                        enableColorOnDark
                        position="fixed"
                        color="inherit"
                        elevation={0}
                        sx={{
                            bgcolor: theme.palette.background.default,
                            transition: leftDrawerOpened ? theme.transitions.create('width') : 'none'
                        }}
                    >
                        <Toolbar
                            sx={{
                                paddingTop: 0,
                                paddingRight: '12px !important',
                                borderBottom: '.5px solid  #DAE1E9'
                            }}
                        >
                            <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
                        </Toolbar>
                    </AppBar>

                    <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign />
                    <Outlet />
                </Main>
                {/* <Customization /> */}
            </Box>
            <BlockUI blocking={loader} />
        </>
    );
};

export default MainLayout;
