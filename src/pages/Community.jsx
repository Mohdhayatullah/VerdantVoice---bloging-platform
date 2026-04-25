import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllBlogs, followUser, unfollowUser } from '../api';
import toast from 'react-hot-toast';

export default function Community() {
  const { isLoggedIn, user } = useAuth();
  const [blogs,    setBlogs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [followed, setFollowed] = useState(new Set());

  useEffect(() => {
    getAllBlogs().then(r => { setBlogs(r.data||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const writers = useMemo(() => {
    const map = {};
    blogs.forEach(b => {
      if (!b.userId) return;
      if (!map[b.userId]) map[b.userId] = { id:b.userId, name:b.userName||'Anonymous', blogs:[], likes:0, views:0, tags:new Set() };
      map[b.userId].blogs.push(b);
      map[b.userId].likes += b.likeCount||0;
      map[b.userId].views += b.viewCount||0;
      (b.tags||[]).forEach(t=>map[b.userId].tags.add(t));
    });
    return Object.values(map).sort((a,b)=>b.likes-a.likes);
  }, [blogs]);

  const filtered = writers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  const trending = [...blogs].sort((a,b)=>(b.viewCount||0)-(a.viewCount||0)).slice(0,5);

  const allTags = useMemo(() => {
    const cnt = {};
    blogs.forEach(b=>(b.tags||[]).forEach(t=>{cnt[t]=(cnt[t]||0)+1;}));
    return Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,16);
  }, [blogs]);

  const toggleFollow = async (wId) => {
    if (!isLoggedIn) { toast.error('Sign in to follow writers'); return; }
    const isF = followed.has(wId);
    try {
      if (isF) { await unfollowUser(wId); setFollowed(s=>{const n=new Set(s);n.delete(wId);return n;}); toast.success('Unfollowed'); }
      else      { await followUser(wId);   setFollowed(s=>new Set([...s,wId]));                           toast.success('Following! 🌿'); }
    } catch(e) { toast.error(e.message); }
  };

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(145deg,var(--green-900),var(--green-700))', padding:'130px clamp(16px,5vw,60px) 80px', textAlign:'center' }}>
        <h1 style={{ color:'#fff', marginBottom:14 }}>Our Community</h1>
        <p style={{ color:'var(--green-200)', fontSize:'1.1rem', maxWidth:560, margin:'0 auto 36px' }}>Connect with passionate writers and curious readers from around the world.</p>
        <div style={{ display:'flex', justifyContent:'center', gap:'clamp(24px,5vw,80px)', background:'rgba(255,255,255,0.08)', borderRadius:'var(--radius-xl)', padding:28, maxWidth:560, margin:'0 auto' }}>
          {[[blogs.length+'+','Articles'],['🌍','Global'],['∞','Ideas']].map(([n,l])=>(
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'2.4rem', color:'#fff', fontWeight:700 }}>{n}</div>
              <div style={{ fontSize:'0.78rem', color:'var(--green-300)', textTransform:'uppercase', letterSpacing:'0.08em', marginTop:4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(48px,6vw,96px) clamp(16px,5vw,60px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:40 }} className="community-grid">

          {/* Writers */}
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-400)' }}>Featured Writers</div>
              <div style={{ position:'relative', minWidth:200 }}>
                <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--ink-300)', pointerEvents:'none' }}>🔍</span>
                <input className="form-control" style={{ paddingLeft:40 }} placeholder="Search writers…" value={search} onChange={e=>setSearch(e.target.value)} />
              </div>
            </div>

            {loading ? <div className="loader-center"><div className="spinner"/></div>
            : !filtered.length ? <div className="empty-state"><div className="empty-icon">👥</div><h3>No writers found</h3></div>
            : filtered.map(w => {
              const isOwn = user && user.id === w.id;
              const isF   = followed.has(w.id);
              return (
                <div key={w.id} style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-100)', padding:'20px 24px', display:'flex', gap:16, alignItems:'flex-start', marginBottom:14, boxShadow:'var(--shadow-xs)', transition:'all 0.25s' }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.borderColor='var(--green-200)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-xs)';e.currentTarget.style.borderColor='var(--ink-100)';e.currentTarget.style.transform='translateY(0)'}}>
                  <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--green-700)', color:'#fff', fontSize:'1.2rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, color:'var(--ink)', marginBottom:4 }}>{w.name}</div>
                    <div style={{ fontSize:'0.8rem', color:'var(--ink-400)', marginBottom:8 }}>{w.blogs.length} article{w.blogs.length!==1?'s':''}</div>
                    <div style={{ display:'flex', gap:14, fontSize:'0.78rem', color:'var(--ink-400)', flexWrap:'wrap' }}>
                      <span>❤️ {w.likes} likes</span>
                      <span>👁 {w.views} views</span>
                    </div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                      {[...w.tags].slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  {!isOwn && (
                    <button onClick={()=>toggleFollow(w.id)} className={`btn btn-sm ${isF?'btn-primary':'btn-outline'}`} style={{ flexShrink:0 }}>
                      {isF ? '✓ Following' : '+ Follow'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div style={{ position:'sticky', top:90, height:'fit-content', display:'flex', flexDirection:'column', gap:24 }}>
            {/* Trending */}
            <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-100)', padding:26, boxShadow:'var(--shadow-xs)' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:18 }}>🔥 Trending Articles</div>
              {trending.length === 0 ? <p style={{ color:'var(--ink-400)', fontSize:'0.85rem' }}>No articles yet.</p>
              : trending.map((b,i) => (
                <div key={b.id} style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'12px 0', borderBottom: i<trending.length-1?'1px solid var(--ink-100)':'none' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--green-200)', fontWeight:700, width:28, flexShrink:0 }}>{i+1}</div>
                  <div>
                    <Link to={`/blogs/${b.id}`} style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--ink-800)', lineHeight:1.35, transition:'color 0.2s' }}
                      onMouseEnter={e=>e.currentTarget.style.color='var(--green-700)'}
                      onMouseLeave={e=>e.currentTarget.style.color='var(--ink-800)'}>{b.title}</Link>
                    <div style={{ fontSize:'0.75rem', color:'var(--ink-400)', marginTop:4 }}>👁 {b.viewCount||0} · ❤️ {b.likeCount||0}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hot tags */}
            <div style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-100)', padding:26, boxShadow:'var(--shadow-xs)' }}>
              <div style={{ fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:18 }}>🏷 Popular Tags</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {allTags.length === 0 ? <p style={{ color:'var(--ink-400)', fontSize:'0.85rem' }}>No tags yet.</p>
                : allTags.map(([t,c]) => (
                  <Link key={t} to={`/blogs?tag=${t}`} style={{ padding:'6px 16px', borderRadius:999, background:'var(--green-50)', color:'var(--green-700)', border:'1px solid var(--green-200)', fontSize:'0.78rem', fontWeight:600, transition:'all 0.2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.background='var(--green-700)';e.currentTarget.style.color='#fff'}}
                    onMouseLeave={e=>{e.currentTarget.style.background='var(--green-50)';e.currentTarget.style.color='var(--green-700)'}}>
                    {t} <span style={{ opacity:0.6 }}>({c})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background:'linear-gradient(135deg,var(--green-800),var(--green-900))', borderRadius:'var(--radius-lg)', padding:28, textAlign:'center' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✍️</div>
              <h3 style={{ color:'#fff', fontFamily:'var(--font-display)', marginBottom:10, fontSize:'1.3rem' }}>Start Writing Today</h3>
              <p style={{ color:'var(--green-200)', fontSize:'0.88rem', marginBottom:20 }}>Share your ideas with thousands of readers.</p>
              <Link to="/write" className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }}>Write an Article</Link>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:860px){.community-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
