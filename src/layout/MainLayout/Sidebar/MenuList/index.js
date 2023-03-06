// material-ui
import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import NavGroup from './NavGroup';
//import menuItem from 'menu-items';

// assets
import { IconNotebook, IconHome, IconSearch, IconPencil, IconTrash } from '@tabler/icons';
// constant
const icons = { IconNotebook, IconHome, IconSearch, IconPencil, IconTrash };

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const collection = useSelector((state) => state.collection.data);
    let menuItem = [];
    const menuItemTop = {
        id: 'top-menu',
        type: 'group',
        children: [
            {
                id: 'home-page',
                title: 'Home',
                type: 'item',
                url: '/home',
                icon: icons.IconHome,
                breadcrumbs: true,
                dynamic: false
            },
            {
                id: 'search-page',
                title: 'Search',
                type: 'item',
                url: '/search',
                icon: icons.IconSearch,
                breadcrumbs: true,
                dynamic: false
            },
            {
                id: 'drafts-page',
                title: 'Drafts',
                type: 'item',
                url: '/drafts',
                icon: icons.IconPencil,
                breadcrumbs: true,
                dynamic: false
            },
            {
                id: 'trash-page',
                title: 'Trash',
                type: 'item',
                url: '/trash',
                icon: icons.IconTrash,
                breadcrumbs: true,
                dynamic: false
            }
        ]
    };
    menuItem.push(menuItemTop);
    // eslint-disable-next-line react/prop-types

    ////////////////////////////////////// adding item //////////////////
    let data = collection;

    let collectionMenuItems = [];
    data.forEach((element) => {
        let itemChildren = [];
        let initMenuItem = {
            id: '',
            pk: '',
            title: '',
            type: '',
            icon: null,
            children: []
        };
        initMenuItem.id = element.collection_key;
        initMenuItem.pk = element.id;
        initMenuItem.title = element.collection_title;
        initMenuItem.type = 'collapse';
        initMenuItem.icon = icons.IconNotebook;

        element.documents.forEach((child) => {
            // if (child.doc_status == 1 || child.doc_status == 2) {
            itemChildren.push({
                id: child.doc_key,
                col_key: element.collection_key,
                pk: child.id,
                title: child.doc_title,
                type: 'item',
                url: '/document/' + child.doc_key,
                breadcrumbs: false,
                dynamic: true,
                doc_status: child.doc_status
            });
            // }
        });
        initMenuItem.children = itemChildren;
        collectionMenuItems.push(initMenuItem);
    });

    const collectionMenu = {
        id: 'collections',
        title: 'Collections',
        type: 'group',
        children: collectionMenuItems
    };

    menuItem.splice(1, 0, collectionMenu);

    // useEffect(() => {
    //     console.log(collection);
    //     if (collection.length > 0) {
    //         ////////////////////////////////////// adding item //////////////////
    //         let data = collection;
    //         let collectionMenuItems = [];
    //         data.forEach((element) => {
    //             let itemChildren = [];
    //             let initMenuItem = {
    //                 id: '',
    //                 title: '',
    //                 type: '',
    //                 icon: null,
    //                 children: []
    //             };
    //             initMenuItem.id = element.collection_key;
    //             initMenuItem.title = element.collection_title;
    //             initMenuItem.type = 'collapse';
    //             initMenuItem.icon = icons.IconNotebook;
    //             element.documents.forEach((child) => {
    //                 itemChildren.push({
    //                     id: child.doc_key,
    //                     title: child.doc_title,
    //                     type: 'item',
    //                     url: '/document/' + child.doc_key,
    //                     breadcrumbs: false
    //                 });
    //             });
    //             initMenuItem.children = itemChildren;
    //             collectionMenuItems.push(initMenuItem);
    //         });
    //         const collectionMenu = {
    //             id: 'collections',
    //             title: 'Collections',
    //             type: 'group',
    //             children: collectionMenuItems
    //         };
    //         menuItem.items.splice(1, 0, collectionMenu);
    //     }
    // }, [collection]);

    const navItems = menuItem.map((item) => {
        switch (item.type) {
            case 'group':
                return <NavGroup key={item.id} item={item} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return <>{navItems}</>;
};

export default MenuList;
