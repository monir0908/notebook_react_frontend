import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const Home = Loadable(lazy(() => import('views/home')));
const Search = Loadable(lazy(() => import('views/search')));
const Drafts = Loadable(lazy(() => import('views/drafts')));
const Trash = Loadable(lazy(() => import('views/trash')));
const Document = Loadable(lazy(() => import('views/document')));
const Collection = Loadable(lazy(() => import('views/collection')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />
            // children: [
            //     {
            //         path: 'default',
            //         element: <DashboardDefault />
            //     }
            // ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-typography',
                    element: <UtilsTypography />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-color',
                    element: <UtilsColor />
                }
            ]
        },
        {
            path: 'utils',
            children: [
                {
                    path: 'util-shadow',
                    element: <UtilsShadow />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'tabler-icons',
                    element: <UtilsTablerIcons />
                }
            ]
        },
        {
            path: 'icons',
            children: [
                {
                    path: 'material-icons',
                    element: <UtilsMaterialIcons />
                }
            ]
        },
        {
            path: 'sample-page',
            element: <SamplePage />
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
            path: 'drafts',
            element: <Drafts />
        },
        {
            path: 'trash',
            element: <Trash />
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
