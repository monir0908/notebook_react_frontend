import React from 'react';
import { Quill } from 'react-quill';
import QuillCursors from 'quill-cursors';
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';

const fontSizeArr = ['15px', '18px', '22px', '26px'];
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
Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/linkTooltip', LinkTooltip);
Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

// Modules object for setting up the Quill editor
export const modules = (props) => ({
    cursors: {
        transformOnTextChange: true
    },
    imageDrop: true,
    imageResize: {
        parchment: Quill.import('parchment'),
        handleStyles: {
            displaySize: true,
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
        },
        modules: ['Resize', 'DisplaySize', 'Toolbar']
    },

    toolbar: {
        container: '#' + props
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    },
    linkTooltip: true
});

// Formats objects for setting up the Quill editor
export const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'align',
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
    'code-block'
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
                        <select className="ql-size" defaultValue={'15px'}>
                            <option value="15px">15px</option>
                            <option value="18px">18px</option>
                            <option value="22px">22px</option>
                            <option value="26px">26px</option>
                        </select>
                        <select defaultValue={'DEFAULT'} className="ql-header">
                            <option value="1">Heading 1</option>
                            <option value="2">Heading 2</option>
                            <option value="3">Heading 3</option>
                            <option value="4">Heading 4</option>
                            <option value="5">Heading 5</option>
                            <option value="6">Heading 6</option>
                            <option value="DEFAULT">Normal</option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
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
