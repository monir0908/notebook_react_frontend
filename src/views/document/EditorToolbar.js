import React from 'react';
import { Quill } from 'react-quill';
import QuillCursors from 'quill-cursors';
import { ImageDrop } from 'quill-image-drop-module';
import { ImageActions } from 'quill-image-actions-align';
import { ImageFormats } from '@xeger/quill-image-formats';
import DeleteIcon from '@mui/icons-material/Delete';

// xeger
const fontSizeArr = ['16px', '18px', '22px', '26px'];
const Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

let icons = Quill.import('ui/icons');
icons['background'] = '<i class="fa-solid fa-fill-drip"></i>';

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'lucida'];
Quill.register(Font, true);

const ColorClass = Quill.import('attributors/class/color');
ColorClass.whitelist = [
    '#092625',
    '#D22D2C',
    '#01927B',
    '#3487D1',
    '#FFFFFF',
    '#849392',
    '#2FA85C',
    '#F1A300',
    '#F5ED5B',
    '#E6E9E9',
    '#FFCFD4',
    '#DFF2EF',
    '#F5FFF2',
    '#FDFDE5'
]; // Add your desired colors here
Quill.register(ColorClass, true);

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

Quill.register('modules/cursors', QuillCursors);
Quill.register('modules/linkTooltip', LinkTooltip);
Quill.register('modules/imageDrop', imageDrop);
Quill.register('modules/imageActions', ImageActions);
Quill.register('modules/imageFormats', ImageFormats);

// Modules object for setting up the Quill editor
export const modules = (props) => ({
    cursors: {
        hideDelayMs: 5000,
        hideSpeedMs: 0,
        selectionChangeSource: null,
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
                        <select defaultValue={'DEFAULT'} className="ql-header">
                            <option value="1">Heading 1</option>
                            <option value="2">Heading 2</option>
                            <option value="3">Heading 3</option>
                            <option value="DEFAULT">Normal</option>
                        </select>
                    </span>
                    <span className="ql-formats">
                        <button className="ql-bold" />
                        <button className="ql-italic" />
                        <button className="ql-underline" />
                        <button className="ql-strike" />
                    </span>
                    <span className="ql-formats">
                        <select className="ql-color">
                            <option value="#092625"></option>
                            <option value="#D22D2C"></option>
                            <option value="#01927B"></option>
                            <option value="#3487D1"></option>
                            <option value="#FFFFFF"></option>
                            <option value="#849392"></option>
                            <option value="#2FA85C"></option>
                            <option value="#F1A300"></option>
                        </select>
                        <select className="ql-background">
                            <option value="#092625"></option>
                            <option value="#849392"></option>
                            <option value="#D22D2C"></option>
                            <option value="#01927B"></option>
                            <option value="#2FA85C"></option>
                            <option value="#F5ED5B"></option>
                            <option value="#FFFFFF"></option>
                            <option value="#E6E9E9"></option>
                            <option value="#FFCFD4"></option>
                            <option value="#DFF2EF"></option>
                            <option value="#F5FFF2"></option>
                            <option value="#FDFDE5"></option>
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
                        <button className="ql-link" />
                        <button className="ql-image" />
                    </span>
                </div>
            )}
        </>
    );
};
export default QuillToolbar;
