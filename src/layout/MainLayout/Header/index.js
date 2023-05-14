import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Stack, Item, Box, ButtonBase } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import ButtonSection from './ButtonSection';
// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();
    const [isDocPage, setIsDocPage] = useState(false);
    let currentUrl = location.pathname;
    const urlArr = currentUrl.split('/');
    useEffect(() => {
        if (urlArr[1] == 'document') {
            setIsDocPage(true);
        } else {
            setIsDocPage(false);
        }
    });
    return (
        <>
            {/* logo & toggler button */}
            <Box
                sx={{
                    width: 275,
                    height: 73,
                    // marginTop: isDocPage ? '-5px' : '0px',
                    marginLeft: '-23px',
                    paddingLeft: '15px',
                    display: 'flex',
                    background: 'linear-gradient(to bottom, white, #eef2f6 )',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Stack direction="row" spacing={6}>
                    <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1, pr: 1 }}>
                        <LogoSection />
                    </Box>
                    <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden', pr: 1, marginLeft: '25px' }}>
                        <Avatar
                            variant="rounded"
                            sx={{
                                ...theme.typography.commonAvatar,
                                ...theme.typography.mediumAvatar,
                                transition: 'all .2s ease-in-out',
                                background: theme.palette.secondary.light,
                                color: theme.palette.secondary.dark,
                                '&:hover': {
                                    background: theme.palette.secondary.dark,
                                    color: theme.palette.secondary.light
                                }
                            }}
                            onClick={handleLeftDrawerToggle}
                            color="inherit"
                        >
                            <IconMenu2 stroke={1.5} size="1.3rem" />
                        </Avatar>
                    </ButtonBase>
                </Stack>
            </Box>

            {/* header search */}
            {/* <SearchSection /> */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ flexGrow: 1 }} />

            {/* notification & profile */}
            {/* <NotificationSection /> */}
            <ButtonSection />
            {/* <ProfileSection /> */}
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
