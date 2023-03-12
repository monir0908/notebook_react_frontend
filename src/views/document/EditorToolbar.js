import React from 'react';
import { Quill } from 'react-quill';
import QuillCursors from 'quill-cursors';
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module-react';
import BlotFormatter from 'quill-blot-formatter';
import QuillBetterTable from 'quill-better-table';

// import Size from 'quill/attributors/style/size';

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
        <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
    </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
        <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
        <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
    </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}
function redoChange() {
    this.quill.history.redo();
}

// Add sizes to whitelist and register them
// const Size = Quill.import('formats/size');
// Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
// Quill.register(Size, true);

const fontSizeArr = ['14px', '18px', '22px', '26px'];
const Size = Quill.import('attributors/style/size');
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'lucida'];
Quill.register(Font, true);

// class AnchorPromptModule {
//     constructor(quill, options) {
//         this.quill = quill;
//         this.options = options;
//         this.quill.root.addEventListener('click', this.handleClick.bind(this));
//     }

//     handleClick(event) {
//         const anchor = event.target.closest('a');
//         if (anchor && anchor.rel === 'noopener noreferrer') {

//             //     const newHref = window.prompt('Enter a new URL:', anchor.href);
//             //     if (newHref) {
//             //         anchor.href = newHref;
//             //     }
//         }
//     }
// }

// Quill.register('modules/linkTooltip', AnchorPromptModule);

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
// Quill.register('modules/blotFormatter', BlotFormatter);
// Quill.register(
//     {
//         'modules/better-table': QuillBetterTable
//     },
//     true
// );

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
    // blotFormatter: {},
    // table: true, // disable table module
    // 'better-table': {
    //     operationMenu: {
    //         items: {
    //             unmergeCells: {
    //                 text: 'Another unmerge cells name'
    //             }
    //         }
    //     }
    // },
    // keyboard: {
    //     bindings: QuillBetterTable.keyboardBindings
    // },
    toolbar: {
        container: '#' + props
        // handlers: {
        //     image: function (value) {
        //         consle.log(value);
        //         if (value) {
        //             document.querySelector('#imageUpload').click();
        //         } else {
        //             this.quill.format('image', false);
        //         }
        //     }
        // }
        // handlers: {
        //     undo: undoChange,
        //     redo: redoChange
        // }
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
    'video',
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
                        {/* <select className="ql-size" defaultValue={'small'}>
                            <option value="extra-small">Extra Small</option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select> */}
                        <select className="ql-size" defaultValue={'14px'}>
                            <option value="14px">14px</option>
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
                        {/* <button className="ql-indent" value="-1" />
                        <button className="ql-indent" value="+1" /> */}
                    </span>
                    {/* <span className="ql-formats">
                        <button className="ql-script" value="super" />
                        <button className="ql-script" value="sub" />
                        <button className="ql-blockquote" />
                        <button className="ql-direction" />
                    </span>  */}
                    <span className="ql-formats">
                        {/* <select className="ql-align" />*/}
                        <select className="ql-color" />
                        <select className="ql-background" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link" />
                        <button className="ql-image" />
                        {/*<button className="ql-video" /> */}
                    </span>
                    {/* <span className="ql-formats">
                        <button className="ql-formula" />
                        <button className="ql-code-block" />
                        <button className="ql-clean" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-undo">
                            <CustomUndo />
                        </button>
                        <button className="ql-redo">
                            <CustomRedo />
                        </button>
                    </span> */}
                </div>
            )}
        </>
    );
};
export default QuillToolbar;
