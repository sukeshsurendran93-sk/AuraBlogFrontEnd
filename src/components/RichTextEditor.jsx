import { useDispatch, useSelector } from 'react-redux';
import { setEditorField } from '../store/slices/editorSlice';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useRef } from 'react';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'link', 'image',
];

export default function RichTextEditor() {
    const dispatch = useDispatch();
    const { content } = useSelector((state) => state.editor);
    const quillRef = useRef(null);

    return (
        <div className="quill-dark">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={(value) => dispatch(setEditorField({ field: 'content', value }))}
                modules={modules}
                formats={formats}
                placeholder="Start your story here..."
                className="bg-transparent dark:text-white rounded-xl"
            />
        </div>
    );
}