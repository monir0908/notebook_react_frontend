import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const Home = Loadable(lazy(() => import('views/home')));
const Search = Loadable(lazy(() => import('views/search')));
const Drafts = Loadable(lazy(() => import('views/drafts')));
const Trash = Loadable(lazy(() => import('views/trash')));
const Document = Loadable(lazy(() => import('views/document')));
const Collection = Loadable(lazy(() => import('views/collection')));
const SharedWithMe = Loadable(lazy(() => import('views/shared-with-me')));
const AccountSettings = Loadable(lazy(() => import('views/account-settings')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: 'home',
            element: <Home />
        },
        {
            path: 'search',
            element: <Search />
        },
        {
            path: 'search/:searchText',
            element: <Search />
        },
        {
            path: 'drafts',
            element: <Drafts />
        },
        {
            path: 'trash',
            element: <Trash />
        },
        {
            path: 'shared-with-me',
            element: <SharedWithMe />
        },
        {
            path: 'account-settings',
            element: <AccountSettings />
        },
        {
            path: 'document/:documentKey',
            element: <Document />
        },
        {
            path: 'collection/:collectionKey',
            element: <Collection />
        }
    ]
};

export default MainRoutes;
