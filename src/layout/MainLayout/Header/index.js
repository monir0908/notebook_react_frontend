import PropTypes from 'prop-types';
import React from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Stack, Item, Box, ButtonBase } from '@mui/material';
// project imports
import ButtonSection from './ButtonSection';
// assets
import { IconMenu2 } from '@tabler/icons';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }) => {
    const theme = useTheme();

    return (
        <>
            <Box
                sx={{
                    width: { xs: 284, sm: 323, md: 323, lg: 300, xl: 300 },
                    height: 45,
                    marginLeft: '-23px',
                    paddingLeft: '15px',
                    display: 'flex',
                    [theme.breakpoints.down('md')]: {
                        width: 'auto'
                    }
                }}
            >
                <Stack direction="row" spacing={4}>
                    <ButtonBase
                        sx={{
                            display: { xs: 'block', sm: 'block', md: 'block', lg: 'none', xl: 'none' },
                            flexGrow: 1,
                            pr: 1,
                            borderRadius: '12px',
                            overflow: 'hidden',
                            paddingRight: '24px',
                            marginLeft: '5px'
                        }}
                    >
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
            <ButtonSection />
        </>
    );
};

Header.propTypes = {
    handleLeftDrawerToggle: PropTypes.func
};

export default Header;
