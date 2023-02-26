import React from 'react';
import { Quill } from 'react-quill';

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
const Size = Quill.import('formats/size');
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
Quill.register(Size, true);

// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'Inter', 'lucida'];
Quill.register(Font, true);

// Quill.register('modules/linkTooltip', (quill) => {
//     console.log(quill);
//     quill.container.addEventListener('click', (evt) => {
//         console.log(evt);
//         if (evt.target.tagName === 'A' && (quill.options.readOnly || evt.offsetY < -5)) {
//             window.open(evt.target.href)?.focus();
//         }
//     });
// });

// const Link = Quill.import('formats/link');

// class ClickableLink extends Link {
//     create(value) {
//         const node = super.create(value);
//         node.setAttribute('href', Link.sanitize(value));
//         node.setAttribute('target', '_blank');
//         node.setAttribute('contenteditable', 'false');

//         return node;
//     }
// }

// Quill.register('formats/link', ClickableLink, true);

// var Link = Quill.import('formats/link');

// class MyLink extends Link {
//     static create(value) {
//         let node = super.create(value);
//         value = this.sanitize(value);
//         if (!value.startsWith('http')) {
//             value = 'http://' + value;
//         }
//         node.setAttribute('href', value);
//         return node;
//     }
// }

// Quill.register(MyLink);

// // Define the custom module
// class LinkClickModule {
//     constructor(quill, options) {
//         this.quill = quill;
//         this.options = options;
//         this.quill.on('click', 'a', this.handleClick.bind(this));
//     }

//     handleClick(link) {
//         window.open(link.href, '_blank');
//     }
// }

// // Register the custom module
// Quill.register('modules/link_click', LinkClickModule);

// new Quill('#editor-container', {
//     modules: {
//         link_click: true
//     }
// });

// Quill.register('modules/linkTooltip', (quill) => {
//     quill.container.addEventListener('click', (evt) => {
//         if (evt.target.tagName === 'A' && (quill.options.readOnly || evt.offsetY < -5)) {
//             window.open(evt.target.href)?.focus();
//         }
//     });
// });

class LinkClickModule {
    constructor(quill, options) {
        this.quill = quill;
        this.options = options;
        this.quill.on('click', 'a', this.handleClick.bind(this));
    }

    handleClick() {
        quill.container.addEventListener('click', (evt) => {
            if (evt.target.tagName === 'A' && (quill.options.readOnly || evt.offsetY < -5)) {
                window.open(evt.target.href)?.focus();
            }
        });
    }
}

Quill.register('modules/linkTooltip', LinkClickModule);
// Modules object for setting up the Quill editor
export const modules = (props) => ({
    linkTooltip: true,
    cursors: true,
    // cursors: {
    //   id: 1,
    //   name: "User 1",
    //   color: "green",
    //   range: { index:0, length:5 }
    // },
    toolbar: {
        container: '#' + props,
        handlers: {
            undo: undoChange,
            redo: redoChange
        }
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true
    }
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
                        {/* <select className="ql-font">
                            <option value="arial"> Arial </option>
                            <option value="comic-sans">Comic Sans</option>
                            <option value="courier-new">Courier New</option>
                            <option value="georgia">Georgia</option>
                            <option value="helvetica">Helvetica</option>
                            <option value="Inter" selected>
                                Inter
                            </option>
                            <option value="lucida">Lucida</option>
                        </select> */}
                        {/* <select className="ql-size">
                            <option value="extra-small">Extra Small</option>
                            <option value="small">Small</option>
                            <option value="medium" selected>
                                Medium
                            </option>
                            <option value="large">Large</option>
                        </select> */}
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
                    {/* <span className="ql-formats">
                        <button className="ql-list" value="ordered" />
                        <button className="ql-list" value="bullet" />
                        <button className="ql-indent" value="-1" />
                        <button className="ql-indent" value="+1" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-script" value="super" />
                        <button className="ql-script" value="sub" />
                        <button className="ql-blockquote" />
                        <button className="ql-direction" />
                    </span> */}
                    <span className="ql-formats">
                        {/* <select className="ql-align" />
                        <select className="ql-color" /> */}
                        <select className="ql-background" />
                    </span>
                    <span className="ql-formats">
                        <button className="ql-link" />
                        {/* <button className="ql-image" />
                        <button className="ql-video" /> */}
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
