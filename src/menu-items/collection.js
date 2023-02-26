// assets
import { IconNotebook } from '@tabler/icons';
// constant
const icons = { IconNotebook };

// ==============================|| COLLECTION MENU ITEMS ||============================== //

const data = [
    {
        id: 1,
        collection_title: 'Collection 1',
        collection_key: '999e12c4-cb83-4f53-ac0e-f735092e2564',
        collection_creator_full_name: 'Saiful Alam',
        documents: [
            {
                id: 1,
                doc_key: 'e7644b32-9f46-43dc-8865-934bb8b54b79',
                doc_title: 'Document 1',
                doc_body: null,
                doc_status: 2
            },
            {
                id: 2,
                doc_key: '440204e3-d10d-4c84-8a23-8574139fdc5b',
                doc_title: 'Document 2',
                doc_body: null,
                doc_status: 2
            },
            {
                id: 3,
                doc_key: '23e50b80-7325-481f-a19a-81c5f3333e30',
                doc_title: 'Document 3',
                doc_body: null,
                doc_status: 2
            }
        ]
    }
];

let collectionMenuItems = [];
data.forEach((element) => {
    let itemChildren = [];
    let initMenuItem = {
        id: '',
        title: '',
        type: '',
        icon: null,
        children: []
    };
    initMenuItem.id = element.collection_key;
    initMenuItem.title = element.collection_title;
    initMenuItem.type = 'collapse';
    initMenuItem.icon = icons.IconNotebook;

    element.documents.forEach((child) => {
        itemChildren.push({
            id: child.doc_key,
            title: child.doc_title,
            type: 'item',
            url: '/document/' + child.doc_key,
            breadcrumbs: false
        });
    });
    initMenuItem.children = itemChildren;
    collectionMenuItems.push(initMenuItem);
});

const collection = {
    id: 'collections',
    title: 'Collections',
    type: 'group',
    children: collectionMenuItems
};

export default collection;
