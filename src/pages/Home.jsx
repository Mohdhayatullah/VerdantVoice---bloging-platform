import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllBlogs } from '../api';
import BlogCard from '../components/BlogCard';
import toast from 'react-hot-toast';

export default function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllBlogs().then(r => { setBlogs(r.data || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const featured = blogs[0] || null;
  const rest = blogs.slice(1, 7);

  return (
    <div className="page-fade">
      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center',
        textAlign:'center', padding:'120px clamp(16px,6vw,80px) 80px',
        background:'linear-gradient(155deg,var(--green-900) 0%,var(--green-800) 40%,var(--green-700) 100%)',
        position:'relative', overflow:'hidden',
      }}>
        {/* Blobs */}
        {[
          { w:500, h:500, top:'-100px', left:'-100px', dur:'8s' },
          { w:380, h:380, bottom:'-80px', right:'-60px', dur:'11s', delay:'0s', reverse:true },
          { w:250, h:250, top:'40%', left:'60%', dur:'13s', delay:'2s' },
        ].map((b, i) => (
          <div key={i} style={{
            position:'absolute', borderRadius:'50%', background:'var(--green-400)',
            opacity:0.12, filter:'blur(80px)',
            width:b.w, height:b.h, top:b.top, left:b.left, bottom:b.bottom, right:b.right,
            animation:`blobFloat ${b.dur} ease-in-out infinite ${b.delay||''} ${b.reverse?'reverse':''}`,
          }} />
        ))}
        <style>{`@keyframes blobFloat{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(20px,-20px) scale(1.05)}}`}</style>

        <div style={{ position:'relative', zIndex:1, maxWidth:780 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,0.18)', color:'var(--green-200)', padding:'8px 20px', borderRadius:999, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:28 }}>
            🌿 A Community of Thinkers
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.8rem,7vw,5rem)', color:'#fff', lineHeight:1.1, marginBottom:24, fontStyle:'italic' }}>
            Where <span style={{ color:'var(--green-300)', fontStyle:'normal' }}>Ideas</span><br/>Bloom & Grow
          </h1>
          <p style={{ color:'var(--green-200)', fontSize:'clamp(1rem,2.5vw,1.2rem)', lineHeight:1.75, maxWidth:560, margin:'0 auto 44px' }}>
            VerdantVoices is a thoughtful space for writers and readers to explore, share, and connect through the power of authentic storytelling.
          </p>
          <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/blogs" style={{ background:'#fff', color:'var(--green-800)', padding:'15px 34px', borderRadius:'var(--radius-sm)', fontWeight:700, fontSize:'1rem', transition:'all 0.25s', display:'inline-block' }}
              onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 36px rgba(0,0,0,0.25)'}}
              onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}>
              Explore Articles
            </Link>
            <button onClick={() => navigate(isLoggedIn ? '/write' : '/register')}
              style={{ border:'2px solid rgba(255,255,255,0.35)', color:'#fff', padding:'14px 32px', borderRadius:'var(--radius-sm)', fontWeight:600, fontSize:'1rem', background:'transparent', cursor:'pointer', transition:'all 0.25s' }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.12)';e.currentTarget.style.borderColor='#fff'}}
              onMouseLeave={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'}}>
              Start Writing
            </button>
          </div>
          <div style={{ display:'flex', justifyContent:'center', gap:'clamp(24px,5vw,64px)', marginTop:60, paddingTop:48, borderTop:'1px solid rgba(255,255,255,0.12)' }}>
            {[
              [blogs.length ? `${blogs.length}+` : '—', 'Stories'],
              ['∞', 'Ideas'],
              ['🌍', 'Global'],
            ].map(([num, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'2.2rem', color:'#fff', fontWeight:700 }}>{num}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--green-300)', letterSpacing:'0.06em', textTransform:'uppercase', marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured + Grid ── */}
      <section style={{ padding:'clamp(64px,8vw,120px) clamp(16px,5vw,60px)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:44, flexWrap:'wrap', gap:14 }}>
          <div>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', marginBottom:8 }}>Latest Articles</h2>
            <p style={{ color:'var(--ink-400)', fontSize:'1.05rem' }}>Fresh perspectives from our community of writers.</p>
          </div>
          <Link to="/blogs" className="btn btn-outline btn-sm">View All →</Link>
        </div>

        {/* Featured big card */}
        {featured && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', borderRadius:'var(--radius-xl)', overflow:'hidden', border:'1px solid var(--ink-100)', boxShadow:'var(--shadow-md)', marginBottom:36 }}
            className="featured-card">
            <div style={{ background:'linear-gradient(135deg,var(--green-700),var(--green-900))', minHeight:320, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', overflow:'hidden' }}>
              {featured.imageURl ? <img src={featured.imageURl} alt={featured.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🌿'}
            </div>
            <div style={{ padding:'clamp(28px,4vw,52px)', display:'flex', flexDirection:'column', justifyContent:'center', background:'#fff' }}>
              <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--green-600)', marginBottom:16 }}>✦ Featured Story</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.4rem,3vw,2rem)', marginBottom:16 }}>{featured.title}</h2>
              <p style={{ color:'var(--ink-400)', lineHeight:1.7, marginBottom:24, fontSize:'0.95rem' }}>
                {(featured.description || '').replace(/<[^>]+>/g,'').slice(0,200)}…
              </p>
              <div style={{ display:'flex', gap:14, fontSize:'0.82rem', color:'var(--ink-400)', marginBottom:24, flexWrap:'wrap' }}>
                <span>{featured.userName || 'Anonymous'}</span>
                <span>·</span>
                <span>{featured.likeCount || 0} ❤️</span>
                <span>{featured.viewCount || 0} 👁</span>
              </div>
              <Link to={`/blogs/${featured.id}`} className="btn btn-primary" style={{ alignSelf:'flex-start' }}>Read Article</Link>
            </div>
            <style>{`@media(max-width:700px){.featured-card{grid-template-columns:1fr!important}}`}</style>
          </div>
        )}

        {loading
          ? <div className="loader-center"><div className="spinner" /></div>
          : !rest.length
            ? <div className="empty-state"><div className="empty-icon">📭</div><h3>No articles yet</h3><p>Be the first to write!</p></div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:28 }}>
                {rest.map(b => <BlogCard key={b.id} blog={b} />)}
              </div>
        }
      </section>

      {/* ── Newsletter ── */}
      <div style={{ margin:'0 clamp(16px,5vw,60px) clamp(64px,8vw,120px)', background:'linear-gradient(135deg,var(--green-800),var(--green-900))', borderRadius:'var(--radius-xl)', padding:'clamp(48px,6vw,80px) clamp(24px,6vw,80px)', textAlign:'center' }}>
        <h2 style={{ color:'#fff', marginBottom:14 }}>Stay in the Loop 🌿</h2>
        <p style={{ color:'var(--green-200)', marginBottom:32, fontSize:'1.05rem' }}>Get the best articles delivered to your inbox, weekly.</p>
        <NewsletterForm />
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [done,  setDone]  = useState(false);
  if (done) return <div style={{ color:'var(--green-300)', fontSize:'1rem', fontWeight:600 }}>✓ Subscribed! Thank you 🌿</div>;
  return (
    <div style={{ display:'flex', gap:12, maxWidth:480, margin:'0 auto', flexWrap:'wrap' }}>
      <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="your@email.com"
        style={{ flex:1, minWidth:200, padding:'14px 20px', borderRadius:'var(--radius-sm)', border:'none', fontSize:'0.95rem', outline:'none' }} />
      <button onClick={() => { if(email) { setDone(true); toast.success('Subscribed!'); } }}
        style={{ padding:'14px 28px', background:'var(--green-500)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', fontWeight:700, cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:'0.95rem' }}>
        Subscribe
      </button>
    </div>
  );
}
