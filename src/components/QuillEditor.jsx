import { useEffect, useRef } from 'react';

export default function QuillEditor({ value, onChange, placeholder = 'Tell your story…' }) {
  const containerRef = useRef(null);
  const quillRef     = useRef(null);
  const onChangeRef  = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const Quill = window.Quill;
    if (!Quill) {
      // Load Quill from CDN dynamically
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
      script.onload = () => initQuill();
      document.head.appendChild(script);
    } else {
      initQuill();
    }

    function initQuill() {
      quillRef.current = new window.Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
      });

      if (value) quillRef.current.root.innerHTML = value;

      quillRef.current.on('text-change', () => {
        onChangeRef.current(quillRef.current.root.innerHTML);
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  // Sync external value changes (e.g. edit mode loads existing content)
  useEffect(() => {
    if (quillRef.current && value !== undefined) {
      const curr = quillRef.current.root.innerHTML;
      if (curr !== value && value !== '') {
        quillRef.current.root.innerHTML = value;
      }
    }
  }, [value]);

  return <div ref={containerRef} />;
}
