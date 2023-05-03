import React from 'react';
import { Quill } from 'react-quill';
import QuillCursors from 'quill-cursors';
import { ImageDrop } from 'quill-image-drop-module';
import { ImageActions } from '@xeger/quill-image-actions';
import { ImageFormats } from '@xeger/quill-image-formats';

// xeger
const fontSizeArr = ['16px', '18px', '22px', '26px'];
const Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'lucida'];
Quill.register(Font, true);

class LinkTooltip {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.quill.root.addEventListener('click', this.handleClick.bind(this));
    }
    handleClick(evt) {
        if (evt.target.tagName === 'A' && (this.quill.options.readOnly || evt.offsetY < 100)) {
            window.open(evt.target.href)?.focus();
        }
    }
}

class imageDrop extends ImageDrop {
    handlePaste(evt) {
        // Handle paste events as usual
        super.handlePaste(evt);
    }

    handleDrop(evt) {
        const clipboard = evt.dataTransfer || evt.clipboardData;
        const type = clipboard.types ? clipboard.types[0] : null;
        const file = clipboard.files ? clipboard.files[0] : null;

        if (type === 'Files' && file && file.type.match('^image/')) {
            // Handle image drop events
            super.handleDrop(evt);
        }
    }
}

// const BubbleTheme = Quill.import('themes/bubble');

// class ExtendBubbleTheme extends BubbleTheme {
//     constructor(quill, options) {
//         super(quill, options);

//         quill.on('selection-change', (range) => {
//             if (range) {
//                 //quill.theme.tooltip.show();
//                 console.log(range);
//                 console.log(quill.getBounds(range));

//                 //     {
//                 //     bottom: 21,
//                 //     height: 17,
//                 //     left: 15,
//                 //     right: 71.046875,
//                 //     top: 0,
//                 //     width: 56.046875
//                 // }
//                 quill.theme.tooltip.position(quill.getBounds(range));
//             }
//         });
//     }
// }

// Quill.register('themes/bubble', ExtendBubbleTheme);

Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/linkTooltip', LinkTooltip);
Quill.register('modules/imageDrop', imageDrop);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

// Modules object for setting up the Quill editor
export const modules = (props) => ({
    cursors: {
        transformOnTextChange: true
    },
    toolbar: {
        container: '#' + props
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    },

    linkTooltip: true,
    imageDrop: true,
    imageActions: {},
    imageFormats: {}
});

// Formats objects for setting up the Quill editor
export const formats = [
    'table',
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
    'clear',
    'alt',
    'height',
    'width',
    'style',
    'direction',
    'float',
    'strike',
    'script',
    'blockquote',
    'background',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'color',
    'clean'
];

// Quill Toolbar component
export const QuillToolbar = (props) => {
    return (
        <>
            {props.toolbarId !== undefined && (
                <div id={props.toolbarId}>
                    <span className="ql-formats">
                        <button className="ql-bold" />
                        <button className="ql-italic" />
                        <button className="ql-underline" />
                        <button className="ql-strike" />
                    </span>
                    <span className="ql-formats">
                        <select className="ql-font" defaultValue={'arial'}>
                            <option value="arial"> Arial </option>
                            <option value="comic-sans">Comic Sans</option>
                            <option value="courier-new">Courier New</option>
                            <option value="georgia">Georgia</option>
                            <option value="lucida">Lucida</option>
                        </select>
                        <select className="ql-size" defaultValue={'16px'}>
                            <option value="16px">16px</option>
                            <option value="18px">18px</option>
                            <option value="22px">22px</option>
                            <option value="26px">26px</option>
                        </select>
                        <select defaultValue={'DEFAULT'} className="ql-header">
                            <option value="1">Heading 1</option>
                            <option value="2">Heading 2</option>
                            <option value="3">Heading 3</option>
                            <option value="DEFAULT">Normal</option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-align" value="" />
                        <button className="ql-align" value="center" />
                        <button className="ql-align" value="right" />
                        <button className="ql-align" value="justify" />
                    </span>
                    <span className="ql-formats">
                        <select className="ql-color" />
                        <select className="ql-background" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link" />
                        <button className="ql-image" />
                    </span>
                </div>
            )}
        </>
    );
};
export default QuillToolbar;
