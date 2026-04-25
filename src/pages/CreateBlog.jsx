import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createBlog, updateBlog, getBlogById } from '../api';
import toast from 'react-hot-toast';

export default function CreateBlog() {
  const { id }      = useParams();
  const isEdit      = !!id;
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const quillRef    = useRef(null);
  const editorRef   = useRef(null);

  const [title,     setTitle]     = useState('');
  const [slug,      setSlug]      = useState('');
  const [tags,      setTags]      = useState([]);
  const [tagInput,  setTagInput]  = useState('');
  const [published, setPublished] = useState(true);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPrev, setCoverPrev] = useState('');
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState('');
  const [content,   setContent]   = useState('');

  /* ── Init Quill ── */
  useEffect(() => {
    const loadQuill = () => {
      if (!window.Quill) {
        const s = document.createElement('script');
        s.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js';
        s.onload = initEditor;
        document.head.appendChild(s);
      } else { initEditor(); }
    };

    function initEditor() {
      if (quillRef.current || !editorRef.current) return;
      quillRef.current = new window.Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Tell your story…',
        modules: {
          toolbar: [
            [{ header: [1,2,3,false] }],
            ['bold','italic','underline','strike'],
            ['blockquote','code-block'],
            [{ list:'ordered' },{ list:'bullet' }],
            ['link','image'],
            [{ color:[] },{ background:[] }],
            ['clean'],
          ],
        },
      });
      quillRef.current.on('text-change', () => {
        setContent(quillRef.current.root.innerHTML);
      });
    }
    loadQuill();
  }, []);

  /* ── Load existing blog for edit ── */
  useEffect(() => {
    if (!isEdit) return;
    getBlogById(id).then(r => {
      const b = r.data;
      setTitle(b.title || '');
      setSlug(b.slug || '');
      setTags(b.tags || []);
      setPublished(b.published !== false);
      setContent(b.description || '');
      if (b.imageURl) setCoverPrev(b.imageURl);
      // Set Quill content once editor is ready
      const trySet = () => {
        if (quillRef.current) { quillRef.current.root.innerHTML = b.description || ''; }
        else setTimeout(trySet, 100);
      };
      trySet();
    }).catch(e => toast.error(e.message));
  }, [id]); // eslint-disable-line

  /* ── Auto slug ── */
  const handleTitleChange = (v) => {
    setTitle(v);
    if (!isEdit) setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''));
  };

  /* ── Tags ── */
  const addTag = (raw) => {
    const t = raw.trim().toLowerCase().replace(/[^a-z0-9\-]/g,'');
    if (t && !tags.includes(t) && tags.length < 8) setTags(prev => [...prev, t]);
  };
  const handleTagKey = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); setTagInput(''); }
    if (e.key === 'Backspace' && !tagInput && tags.length) setTags(t => t.slice(0,-1));
  };

  /* ── Cover ── */
  const handleCover = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 5*1024*1024) { toast.error('Image must be under 5MB'); return; }
    setCoverFile(f);
    setCoverPrev(URL.createObjectURL(f));
  };

  /* ── Submit ── */
  const submit = async (pub) => {
    setError('');
    if (!title.trim()) { setError('Title is required.'); return; }
    const text = quillRef.current ? quillRef.current.getText().trim() : '';
    if (!text || text.length < 10) { setError('Please write some content.'); return; }

    setSaving(true);
    try {
      const dto = { title, slug, tags, published: pub, userId: user?.id, userName: user?.fullName, description: quillRef.current?.root.innerHTML || '' };
      const fd  = new FormData();
      fd.append('data', JSON.stringify(dto));
      if (coverFile) fd.append('file', coverFile);

      if (isEdit) await updateBlog(id, fd);
      else        await createBlog(fd);

      toast.success(pub ? '🌿 Article published!' : '📝 Saved as draft');
      navigate('/my-blogs');
    } catch(e) { setError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ background:'var(--ivory-200)', minHeight:'100vh' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px clamp(16px,4vw,40px) 80px', display:'grid', gridTemplateColumns:'1fr 320px', gap:36, alignItems:'start' }} className="write-layout">

        {/* ── Main ── */}
        <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', padding:'44px', boxShadow:'var(--shadow-sm)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:14 }}>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', color:'var(--green-900)' }}>
              {isEdit ? 'Edit Article' : 'Write a New Article'}
            </h1>
            {isEdit && <span style={{ background:'var(--green-50)', color:'var(--green-700)', border:'1px solid var(--green-200)', borderRadius:999, padding:'5px 14px', fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.06em' }}>✏️ EDITING</span>}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Title */}
          <div className="form-group">
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Your article title…"
              maxLength={200}
              style={{ width:'100%', fontFamily:'var(--font-display)', fontSize:'1.9rem', border:'none', outline:'none', color:'var(--green-900)', borderBottom:'2px solid var(--ink-200)', paddingBottom:16, marginBottom:4, transition:'border-color 0.2s', background:'transparent' }}
              onFocus={e => e.target.style.borderBottomColor='var(--green-500)'}
              onBlur={e  => e.target.style.borderBottomColor='var(--ink-200)'}
            />
            <div style={{ textAlign:'right', fontSize:'0.75rem', color:'var(--ink-300)' }}>{title.length}/200</div>
          </div>

          {/* Quill Editor */}
          <div className="form-group" style={{ marginTop:24 }}>
            <label className="form-label">Content</label>
            <div ref={editorRef} />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:22 }}>

          {/* Cover */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', padding:26, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:16 }}>Cover Image</div>
            {coverPrev ? (
              <div style={{ borderRadius:'var(--radius-md)', overflow:'hidden', border:'1px solid var(--green-200)' }}>
                <img src={coverPrev} alt="preview" style={{ width:'100%', height:160, objectFit:'cover' }} />
                <button onClick={() => { setCoverFile(null); setCoverPrev(''); }} style={{ width:'100%', padding:'8px', background:'var(--ink-100)', border:'none', cursor:'pointer', fontSize:'0.8rem', color:'var(--ink-500)', fontFamily:'var(--font-sans)' }}>
                  ✕ Remove image
                </button>
              </div>
            ) : (
              <label style={{ display:'block', border:'2px dashed var(--ink-200)', borderRadius:'var(--radius-md)', padding:'28px 16px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', color:'var(--ink-400)' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green-400)';e.currentTarget.style.background='var(--green-50)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--ink-200)';e.currentTarget.style.background='transparent'}}>
                <div style={{ fontSize:'2rem', marginBottom:8 }}>🖼</div>
                <div style={{ fontWeight:600, fontSize:'0.85rem', marginBottom:4 }}>Click to upload cover</div>
                <div style={{ fontSize:'0.75rem' }}>JPG, PNG, WebP — max 5MB</div>
                <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleCover} />
              </label>
            )}
          </div>

          {/* Tags */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', padding:26, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:16 }}>Tags</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8, padding:'10px 14px', border:'1.5px solid var(--ink-200)', borderRadius:'var(--radius-sm)', cursor:'text', minHeight:48 }}
              onClick={e => e.currentTarget.querySelector('input')?.focus()}>
              {tags.map(t => (
                <span key={t} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--green-100)', color:'var(--green-800)', borderRadius:999, padding:'3px 10px 3px 14px', fontSize:'0.8rem', fontWeight:600 }}>
                  {t}
                  <button onClick={() => setTags(prev => prev.filter(x => x !== t))} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--green-600)', fontSize:'1rem', lineHeight:1, padding:0 }}>×</button>
                </span>
              ))}
              <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={handleTagKey}
                placeholder={tags.length < 8 ? 'Add tag + Enter…' : ''}
                style={{ border:'none', outline:'none', fontSize:'0.88rem', minWidth:100, flex:1, background:'transparent', fontFamily:'var(--font-sans)' }} />
            </div>
            <p style={{ fontSize:'0.75rem', color:'var(--ink-400)', marginTop:8 }}>Press Enter or comma to add. Max 8 tags.</p>
          </div>

          {/* Slug */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', padding:26, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:16 }}>URL Slug</div>
            <input className="form-control" value={slug} onChange={e=>setSlug(e.target.value)} placeholder="auto-generated-from-title" />
            <p style={{ fontSize:'0.75rem', color:'var(--ink-400)', marginTop:8 }}>Leave blank to auto-generate.</p>
          </div>

          {/* Publish */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', padding:26, boxShadow:'var(--shadow-sm)' }}>
            <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:20 }}>Visibility</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
              <span style={{ fontSize:'0.9rem', color:'var(--ink-700)', fontWeight:500 }}>Publish Now</span>
              <label style={{ position:'relative', display:'inline-block', width:48, height:26, cursor:'pointer' }}>
                <input type="checkbox" checked={published} onChange={e=>setPublished(e.target.checked)} style={{ opacity:0, width:0, height:0 }} />
                <span style={{ position:'absolute', inset:0, background:published?'var(--green-600)':'var(--ink-300)', borderRadius:999, transition:'0.3s' }}>
                  <span style={{ position:'absolute', width:20, height:20, background:'#fff', borderRadius:'50%', top:3, left:published?25:3, transition:'0.3s', boxShadow:'0 1px 4px rgba(0,0,0,0.2)' }} />
                </span>
              </label>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width:'100%' }} disabled={saving} onClick={() => submit(published)}>
              {saving ? 'Saving…' : published ? '🌿 Publish Article' : '📝 Save Draft'}
            </button>
            <button className="btn btn-outline" style={{ width:'100%', marginTop:10 }} disabled={saving} onClick={() => submit(false)}>
              Save as Draft
            </button>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.write-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
