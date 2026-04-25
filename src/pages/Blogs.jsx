import { useState, useEffect, useMemo } from 'react';
import { getAllBlogs } from '../api';
import BlogCard from '../components/BlogCard';

export default function Blogs() {
  const [blogs, setBlogs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [sort,   setSort]     = useState('newest');
  const [tag,    setTag]      = useState('all');

  useEffect(() => {
    getAllBlogs().then(r => { setBlogs(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const allTags = useMemo(() => {
    const s = new Set();
    blogs.forEach(b => (b.tags || []).forEach(t => s.add(t)));
    return [...s];
  }, [blogs]);

  const filtered = useMemo(() => {
    let list = blogs.filter(b => {
      const matchTag = tag === 'all' || (b.tags || []).includes(tag);
      const q = search.toLowerCase();
      const matchQ = !q || b.title.toLowerCase().includes(q) || (b.description || '').toLowerCase().includes(q) || (b.userName || '').toLowerCase().includes(q);
      return matchTag && matchQ;
    });
    list.sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === 'likes')  return (b.likeCount || 0) - (a.likeCount || 0);
      if (sort === 'views')  return (b.viewCount || 0) - (a.viewCount || 0);
      if (sort === 'rating') return (b.averageRating || 0) - (a.averageRating || 0);
      return 0;
    });
    return list;
  }, [blogs, search, sort, tag]);

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg,var(--green-900),var(--green-700))', padding:'120px clamp(16px,5vw,60px) 70px', textAlign:'center' }}>
        <h1 style={{ color:'#fff', marginBottom:14 }}>Explore Articles</h1>
        <p style={{ color:'var(--green-200)', fontSize:'1.1rem', maxWidth:520, margin:'0 auto' }}>Discover stories, ideas and insights from our community of writers.</p>
      </div>

      {/* Sticky Toolbar */}
      <div style={{ position:'sticky', top:70, zIndex:100, background:'rgba(250,248,243,0.95)', backdropFilter:'blur(12px)', borderBottom:'1px solid var(--ink-100)', padding:'18px clamp(16px,5vw,60px)', display:'flex', flexWrap:'wrap', gap:14, alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ position:'relative', flex:1, minWidth:200, maxWidth:380 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--ink-300)' }}>🔍</span>
          <input className="form-control" style={{ paddingLeft:40 }} placeholder="Search articles…" value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
          <select className="form-control" style={{ width:'auto', padding:'10px 16px' }} value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="likes">Most Liked</option>
            <option value="views">Most Viewed</option>
            <option value="rating">Highest Rated</option>
          </select>
          <span style={{ fontSize:'0.85rem', color:'var(--ink-400)' }}>{filtered.length} article{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div style={{ padding:'clamp(32px,4vw,60px) clamp(16px,5vw,60px)' }}>
        {/* Tag filters */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:36 }}>
          {['all', ...allTags].map(t => (
            <button key={t} onClick={() => setTag(t)} className={`btn btn-sm ${tag===t ? 'btn-primary' : 'btn-outline'}`}>
              {t === 'all' ? 'All Topics' : t}
            </button>
          ))}
        </div>

        {loading
          ? <div className="loader-center"><div className="spinner" /></div>
          : !filtered.length
            ? <div className="empty-state"><div className="empty-icon">🔍</div><h3>No articles found</h3><p>Try a different search or filter.</p></div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 }}>
                {filtered.map(b => <BlogCard key={b.id} blog={b} />)}
              </div>
        }
      </div>
    </div>
  );
}
