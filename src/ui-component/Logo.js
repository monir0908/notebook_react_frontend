// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="" width="100" />
         *
         */
        <svg width="32" height="32" viewBox="0 0 76 55" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M41.2 3.4l-26.1 7.5l-4.1 1.2c-3 .9-3.2 2.6-2.4 5.6l11.3 41.1c.8 3 1.6 3.5 4.7 2.6l4.1-1.2l26.1-7.5c3-.9 4.8-4 4-7.1L48.2 7.4c-.8-3.1-4-4.8-7-4"
                fill="#3e4347"
            ></path>
            <path
                d="M39 2.8l-25.8 8.5l-4.1 1.3c-3 1-3.1 2.7-2.2 5.7l13 40.6c1 3 1.8 3.4 4.8 2.4l4.1-1.3l25.8-8.5c3-1 4.7-4.2 3.7-7.2L46.2 6.5c-1-3-4.2-4.6-7.2-3.7"
                fill="#d0d0d0"
            ></path>
            <path d="M37.1 2.4l-25.5 9.4L28.8 60l25.5-9.4c3-1.1 4.5-4.4 3.4-7.4L44.4 5.7c-1-2.9-4.3-4.4-7.3-3.3" fill="#42ade2"></path>
            <path d="M7.6 13.3c-3 1.1-3 2.8-2 5.8L20 59.2c1.1 3 1.9 3.4 4.9 2.3l4-1.5l-17.3-48.2l-4 1.5" fill="#3e4347"></path>
            <path fill="#ffffff" d="M41.5 21.4l-15.8 5.9l-2.2-6.3l15.8-5.8z"></path>
        </svg>
    );
};

export default Logo;
