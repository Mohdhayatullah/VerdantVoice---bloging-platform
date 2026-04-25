import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFeed } from '../api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) : ''; }

export default function Feed() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeed()
      .then(r => { setPosts(r.data || []); setLoading(false); })
      .catch(e => { toast.error(e.message); setLoading(false); });
  }, []);

  return (
    <div style={{ background:'var(--ivory-200)', minHeight:'100vh' }}>
      <div style={{ maxWidth:820, margin:'0 auto', padding:'60px clamp(16px,4vw,40px) 80px' }} className="page-fade">
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', color:'var(--green-900)', marginBottom:6 }}>📰 My Feed</h1>
          <p style={{ color:'var(--ink-400)' }}>Articles from writers you follow.</p>
        </div>

        {loading ? (
          <div className="loader-center"><div className="spinner" /></div>
        ) : !posts.length ? (
          <div style={{ textAlign:'center', padding:'80px 24px', background:'#fff', borderRadius:'var(--radius-xl)', border:'1px solid var(--ink-100)' }}>
            <div style={{ fontSize:'4rem', marginBottom:20 }}>🌱</div>
            <h3 style={{ fontFamily:'var(--font-display)', color:'var(--ink-600)', fontSize:'1.6rem', marginBottom:12 }}>Your feed is empty</h3>
            <p style={{ color:'var(--ink-400)', marginBottom:28 }}>Follow writers you love to see their articles here.</p>
            <Link to="/community" className="btn btn-primary">Discover Writers</Link>
          </div>
        ) : posts.map(post => (
          <article key={post.id} style={{ background:'#fff', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-100)', padding:28, marginBottom:20, display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'start', boxShadow:'var(--shadow-xs)', transition:'all 0.25s' }}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.borderColor='var(--green-200)';e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-xs)';e.currentTarget.style.borderColor='var(--ink-100)';e.currentTarget.style.transform='translateY(0)'}}>
            <div>
              {/* Author */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--green-700)', color:'#fff', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.82rem', flexShrink:0 }}>
                  {(post.userName||'A').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:'0.88rem', color:'var(--ink-800)' }}>{post.userName||'Anonymous'}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--ink-400)' }}>{formatDate(post.createdAt)}</div>
                </div>
              </div>
              {/* Title */}
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.25rem', color:'var(--green-900)', marginBottom:10, lineHeight:1.3 }}>
                <Link to={`/blogs/${post.id}`} style={{ transition:'color 0.2s' }}
                  onMouseEnter={e=>e.currentTarget.style.color='var(--green-700)'}
                  onMouseLeave={e=>e.currentTarget.style.color='var(--green-900)'}>{post.title}</Link>
              </h2>
              {/* Excerpt */}
              <p style={{ fontSize:'0.88rem', color:'var(--ink-500)', lineHeight:1.7, marginBottom:16, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {(post.description||'').replace(/<[^>]+>/g,'').slice(0,200)}…
              </p>
              {/* Stats */}
              <div style={{ display:'flex', gap:14, fontSize:'0.8rem', color:'var(--ink-400)', flexWrap:'wrap', alignItems:'center' }}>
                <span>❤️ {post.likeCount||0}</span>
                <span>👁 {post.viewCount||0}</span>
                <StarRating value={post.averageRating||0} size={13} />
                {(post.tags||[]).slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {/* Thumb */}
            <div style={{ width:110, height:80, borderRadius:'var(--radius-md)', overflow:'hidden', background:'linear-gradient(135deg,var(--green-100),var(--green-200))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>
              {post.imageURl ? <img src={post.imageURl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🌿'}
            </div>
            <style>{`@media(max-width:540px){article[style]{grid-template-columns:1fr!important}}`}</style>
          </article>
        ))}
      </div>
    </div>
  );
}
