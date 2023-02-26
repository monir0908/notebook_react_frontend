// assets
import { IconBrandChrome, IconHelp, IconHome, IconSearch, IconPencil } from '@tabler/icons';

// constant
const icons = { IconHome, IconSearch, IconPencil, IconBrandChrome, IconHelp };

// ==============================|| TOP MENU ITEMS ||============================== //

const top = {
    id: 'top-menu',
    type: 'group',
    children: [
        {
            id: 'home-page',
            title: 'Home',
            type: 'item',
            url: '/home',
            icon: icons.IconHome,
            breadcrumbs: true
        },
        {
            id: 'search-page',
            title: 'Search',
            type: 'item',
            url: '/search',
            icon: icons.IconSearch,
            breadcrumbs: true
        },
        {
            id: 'drafts-page',
            title: 'Drafts',
            type: 'item',
            url: '/drafts',
            icon: icons.IconPencil,
            breadcrumbs: true
        }
        // {
        //     id: 'documentation',
        //     title: 'Documentation',
        //     type: 'item',
        //     url: 'https://codedthemes.gitbook.io/berry/',
        //     icon: icons.IconHelp,
        //     external: true,
        //     target: true
        // }
    ]
};

export default top;
