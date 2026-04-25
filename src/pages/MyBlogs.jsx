import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBlogs, deleteBlog } from '../api';
import Modal from '../components/Modal';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'short',day:'numeric'}) : ''; }

export default function MyBlogs() {
  const [blogs,   setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [delId,   setDelId]   = useState(null);
  const [delTitle,setDelTitle]= useState('');

  useEffect(() => {
    getMyBlogs().then(r => { setBlogs(r.data || []); setLoading(false); }).catch(e => { toast.error(e.message); setLoading(false); });
  }, []);

  const filtered = blogs.filter(b => {
    const mf = filter==='all' || (filter==='published'&&b.published) || (filter==='draft'&&!b.published);
    const mq = !search || b.title.toLowerCase().includes(search.toLowerCase());
    return mf && mq;
  });

  const confirmDelete = async () => {
    try {
      await deleteBlog(delId);
      setBlogs(prev => prev.filter(b => b.id !== delId));
      toast.success('Article deleted');
    } catch(e) { toast.error(e.message); }
    setDelId(null);
  };

  return (
    <div style={{ background:'var(--ivory-200)', minHeight:'100vh' }}>
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'60px clamp(16px,4vw,40px) 80px' }} className="page-fade">

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--green-900)', marginBottom:6 }}>My Articles</h1>
            <p style={{ color:'var(--ink-400)', fontSize:'0.9rem' }}>{filtered.length} article{filtered.length!==1?'s':''} found</p>
          </div>
          <Link to="/write" className="btn btn-primary">+ Write New Article</Link>
        </div>

        {/* Toolbar */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div style={{ display:'flex', gap:8 }}>
            {['all','published','draft'].map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`btn btn-sm ${filter===f?'btn-primary':'btn-outline'}`} style={{ textTransform:'capitalize' }}>{f==='all'?'All':f==='published'?'Published':'Drafts'}</button>
            ))}
          </div>
          <div style={{ position:'relative', minWidth:220 }}>
            <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--ink-300)', pointerEvents:'none' }}>🔍</span>
            <input className="form-control" style={{ paddingLeft:40 }} placeholder="Search my articles…" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="loader-center"><div className="spinner" /></div>
        ) : !filtered.length ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No articles here yet</h3>
            <p style={{ marginBottom:24 }}>Start sharing your ideas with the world.</p>
            <Link to="/write" className="btn btn-primary">Write your first article →</Link>
          </div>
        ) : filtered.map(blog => (
          <div key={blog.id} style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-100)', padding:'22px 26px', display:'grid', gridTemplateColumns:'80px 1fr auto', gap:20, alignItems:'center', marginBottom:14, boxShadow:'var(--shadow-xs)', transition:'all 0.25s' }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.borderColor='var(--green-200)';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-xs)';e.currentTarget.style.borderColor='var(--ink-100)';e.currentTarget.style.transform='translateY(0)'}}>

            {/* Thumb */}
            <div style={{ width:80, height:60, borderRadius:'var(--radius-sm)', overflow:'hidden', background:'linear-gradient(135deg,var(--green-100),var(--green-200))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
              {blog.imageURl ? <img src={blog.imageURl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🌿'}
            </div>

            {/* Info */}
            <div style={{ minWidth:0 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', color:'var(--green-900)', marginBottom:6 }}>
                <Link to={`/blogs/${blog.id}`} style={{ transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--green-700)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--green-900)'}>{blog.title}</Link>
              </h3>
              <p style={{ fontSize:'0.82rem', color:'var(--ink-400)', marginBottom:10, display:'-webkit-box', WebkitLineClamp:1, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {(blog.description||'').replace(/<[^>]+>/g,'').slice(0,100)}…
              </p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:12, alignItems:'center', fontSize:'0.8rem', color:'var(--ink-400)' }}>
                <span style={{ padding:'3px 12px', borderRadius:999, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.05em', background:blog.published?'var(--green-100)':'var(--ink-100)', color:blog.published?'var(--green-700)':'var(--ink-500)' }}>
                  {blog.published?'● Published':'○ Draft'}
                </span>
                <span>📅 {formatDate(blog.createdAt)}</span>
                <span>👁 {blog.viewCount||0}</span>
                <span>❤️ {blog.likeCount||0}</span>
                <StarRating value={blog.averageRating||0} size={12} />
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {(blog.tags||[]).slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:10, flexShrink:0 }}>
              <Link to={`/write/${blog.id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
              <button className="btn btn-danger btn-sm" onClick={()=>{ setDelId(blog.id); setDelTitle(blog.title); }}>🗑</button>
            </div>
          </div>
        ))}

        <style>{`@media(max-width:580px){div[style*="grid-template-columns: 80px"]{grid-template-columns:1fr!important}}`}</style>
      </div>

      {/* Delete confirm modal */}
      <Modal open={!!delId} onClose={()=>setDelId(null)} title="Delete Article">
        <p style={{ color:'var(--ink-500)', marginBottom:28, lineHeight:1.65 }}>
          Are you sure you want to delete <strong>"{delTitle}"</strong>? This action cannot be undone.
        </p>
        <div style={{ display:'flex', gap:12 }}>
          <button className="btn btn-danger" onClick={confirmDelete}>Yes, Delete</button>
          <button className="btn btn-outline" onClick={()=>setDelId(null)}>Cancel</button>
        </div>
      </Modal>
    </div>
  );
}
