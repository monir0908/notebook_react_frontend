// material-ui
import { Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { collectionList } from 'store/features/collection/collectionActions';
// project imports
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// assets
import { IconNotebook } from '@tabler/icons';
// constant
const icons = { IconNotebook };

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.auth.userInfo);
    const collection = useSelector((state) => state.collection);

    // useEffect(() => {
    //     const url = `collection/list?creator_id=${userInfo.id}&page=1&page_size=5`;
    //     dispatch(collectionList({ url }));
    //     if (collection.data) {
    //         ////////////////////////////////////// adding item //////////////////
    //         const data = collection.data.data;

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
    // }, []);

    const navItems = menuItem.items.map((item) => {
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
