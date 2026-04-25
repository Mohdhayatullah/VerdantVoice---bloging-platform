import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBlogById, likeBlog, unlikeBlog, getLikeCount, followUser, unfollowUser, getFollowersCount, getFollowingCount, getFeedbackByBlog, createFeedback, deleteBlog } from '../api';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

function formatDate(d) { if(!d) return ''; return new Date(d).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}); }

export default function BlogDetail() {
  const { id }       = useParams();
  const { user, isLoggedIn } = useAuth();
  const navigate     = useNavigate();

  const [blog,     setBlog]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [liked,    setLiked]    = useState(false);
  const [likes,    setLikes]    = useState(0);
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following2,setFollowing2]= useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [rating,   setRating]   = useState(0);
  const [comment,  setComment]  = useState('');
  const [fbLoading,setFbLoading]= useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBlogById(id, user?.id);
        const b = res.data;
        setBlog(b);
        setLikes(b.likeCount || 0);
        document.title = `${b.title} — VerdantVoices`;
        if (b.userId) {
          const [fc, fw] = await Promise.all([getFollowersCount(b.userId), getFollowingCount(b.userId)]);
          setFollowers(fc.data); setFollowing2(fw.data);
        }
        loadFeedbacks();
      } catch(e) { toast.error(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]); // eslint-disable-line

  const loadFeedbacks = async () => {
    try { const r = await getFeedbackByBlog(id); setFeedbacks(r.data || []); } catch(_) {}
  };

  const toggleLike = async () => {
    if (!isLoggedIn) { toast.error('Sign in to like articles'); return; }
    try {
      if (liked) { await unlikeBlog(id, user.id); setLiked(false); setLikes(l => l-1); }
      else        { await likeBlog(id, user.id);   setLiked(true);  setLikes(l => l+1); }
    } catch(e) { toast.error(e.message); }
  };

  const toggleFollow = async () => {
    if (!isLoggedIn) { navigate('/login'); return; }
    try {
      if (following) { await unfollowUser(blog.userId); setFollowing(false); setFollowers(f=>f-1); toast.success('Unfollowed'); }
      else            { await followUser(blog.userId);   setFollowing(true);  setFollowers(f=>f+1); toast.success('Following! 🌿'); }
    } catch(e) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this article permanently?')) return;
    try { await deleteBlog(id); toast.success('Article deleted'); navigate('/my-blogs'); }
    catch(e) { toast.error(e.message); }
  };

  const submitFeedback = async () => {
    if (!rating) { toast.error('Please select a rating'); return; }
    if (!comment.trim()) { toast.error('Please write a comment'); return; }
    setFbLoading(true);
    try {
      await createFeedback(id, rating, comment);
      toast.success('Review posted! 🌿'); setComment(''); setRating(0); loadFeedbacks();
    } catch(e) { toast.error(e.message); }
    finally { setFbLoading(false); }
  };

  const share = () => {
    if (navigator.share) navigator.share({ title: blog.title, url: window.location.href });
    else { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }
  };

  if (loading) return <div className="loader-center"><div className="spinner" /></div>;
  if (!blog)   return <div className="empty-state"><div className="empty-icon">😕</div><h3>Article not found</h3><Link to="/blogs" className="btn btn-primary" style={{marginTop:20}}>← Back to Blogs</Link></div>;

  const isOwner = user && blog.userId && user.id === blog.userId;
  const canFollow = isLoggedIn && blog.userId && !isOwner;

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(160deg,var(--green-900),var(--green-800))', padding:'100px clamp(16px,5vw,60px) 60px', color:'#fff' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
            {(blog.tags||[]).map(t => <span key={t} style={{ background:'rgba(255,255,255,0.15)', color:'var(--green-200)', borderRadius:999, padding:'4px 14px', fontSize:'0.75rem', fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>{t}</span>)}
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,3rem)', color:'#fff', marginBottom:24, lineHeight:1.2 }}>{blog.title}</h1>
          <div style={{ display:'flex', flexWrap:'wrap', gap:20, alignItems:'center', fontSize:'0.88rem', color:'var(--green-200)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--green-500)', color:'#fff', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.95rem' }}>
                {(blog.userName||'A').charAt(0).toUpperCase()}
              </div>
              <div><div style={{ fontWeight:600, color:'#fff' }}>{blog.userName||'Anonymous'}</div><div style={{ fontSize:'0.78rem' }}>{formatDate(blog.createdAt)}</div></div>
            </div>
            <span>👁 {blog.viewCount||0} views</span>
            <span>❤️ {likes} likes</span>
            <StarRating value={blog.averageRating||0} size={14} />
            <span style={{ fontSize:'0.82rem' }}>({(blog.averageRating||0).toFixed(1)})</span>
          </div>
        </div>
      </div>

      {blog.imageURl && <img src={blog.imageURl} alt={blog.title} style={{ width:'100%', maxHeight:500, objectFit:'cover' }} />}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:48, maxWidth:1100, margin:'0 auto', padding:'60px clamp(16px,5vw,60px)' }} className="detail-layout">
        {/* Main */}
        <div>
          {/* Action bar */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', padding:'20px 0', borderTop:'1px solid var(--ink-100)', borderBottom:'1px solid var(--ink-100)', marginBottom:36 }}>
            <button onClick={toggleLike} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:999, border:`1.5px solid ${liked?'#e74c3c':'var(--ink-200)'}`, background:liked?'#fff0f0':'#fff', color:liked?'#e74c3c':'var(--ink-500)', cursor:'pointer', fontWeight:600, fontFamily:'var(--font-sans)', fontSize:'0.9rem', transition:'all 0.2s' }}>
              ❤️ {likes} {liked ? 'Liked' : 'Like'}
            </button>
            <button onClick={share} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 22px', borderRadius:999, border:'1.5px solid var(--ink-200)', background:'#fff', color:'var(--ink-500)', cursor:'pointer', fontFamily:'var(--font-sans)', fontSize:'0.9rem', transition:'all 0.2s' }}>
              🔗 Share
            </button>
            {isOwner && (
              <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
                <Link to={`/write/${id}`} className="btn btn-outline btn-sm">✏️ Edit</Link>
                <button onClick={handleDelete} className="btn btn-danger btn-sm">🗑 Delete</button>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ fontSize:'1.05rem', lineHeight:1.85, color:'var(--ink-700)' }}
            dangerouslySetInnerHTML={{ __html: blog.description || '' }} />

          {/* Feedback */}
          <div style={{ marginTop:56 }}>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--green-900)', marginBottom:28 }}>Reviews & Feedback</h3>

            {isLoggedIn ? (
              <div style={{ background:'var(--green-50)', border:'1px solid var(--green-200)', borderRadius:'var(--radius-lg)', padding:28, marginBottom:32 }}>
                <h4 style={{ fontSize:'0.9rem', color:'var(--green-800)', marginBottom:14, fontFamily:'var(--font-sans)' }}>Share your thoughts</h4>
                <div style={{ marginBottom:16 }}>
                  <StarRating value={rating} size={28} interactive onChange={setRating} />
                </div>
                <textarea className="form-control" rows="4" placeholder="Write your review…" value={comment} onChange={e=>setComment(e.target.value)} />
                <button className="btn btn-primary" style={{ marginTop:14 }} onClick={submitFeedback} disabled={fbLoading}>
                  {fbLoading ? 'Posting…' : 'Post Review'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'24px', background:'var(--green-50)', borderRadius:'var(--radius-md)', marginBottom:28 }}>
                <Link to="/login" className="btn btn-outline btn-sm">Sign in to leave a review</Link>
              </div>
            )}

            {feedbacks.length === 0
              ? <p style={{ color:'var(--ink-400)', fontSize:'0.9rem' }}>No reviews yet. Be the first!</p>
              : feedbacks.map(fb => (
                  <div key={fb.id} style={{ background:'#fff', border:'1px solid var(--ink-100)', borderRadius:'var(--radius-md)', padding:22, marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                      <div>
                        <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink-800)' }}>{fb.user?.fullName || 'Anonymous'}</div>
                        <StarRating value={fb.rating} size={13} />
                      </div>
                      <span style={{ fontSize:'0.78rem', color:'var(--ink-400)' }}>{formatDate(fb.createdAt)}</span>
                    </div>
                    <p style={{ color:'var(--ink-500)', fontSize:'0.92rem', lineHeight:1.65 }}>{fb.comment}</p>
                  </div>
                ))
            }
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ position:'sticky', top:90, height:'fit-content' }}>
          <div style={{ background:'#fff', border:'1px solid var(--ink-100)', borderRadius:'var(--radius-lg)', padding:24, marginBottom:24, boxShadow:'var(--shadow-xs)' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:18 }}>Article Stats</div>
            {[['👁 Views', blog.viewCount||0],['❤️ Likes', likes],['📅 Published', formatDate(blog.createdAt)]].map(([l,v]) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--ink-100)', fontSize:'0.88rem' }}>
                <span style={{ color:'var(--ink-400)' }}>{l}</span>
                <span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', fontSize:'0.88rem' }}>
              <span style={{ color:'var(--ink-400)' }}>⭐ Rating</span>
              <span style={{ fontWeight:600 }}>{(blog.averageRating||0).toFixed(1)}/5</span>
            </div>
          </div>

          <div style={{ background:'#fff', border:'1px solid var(--ink-100)', borderRadius:'var(--radius-lg)', padding:24, boxShadow:'var(--shadow-xs)' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-400)', marginBottom:18 }}>About the Author</div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--green-700)', color:'#fff', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>
                {(blog.userName||'A').charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'var(--ink)' }}>{blog.userName||'Anonymous'}</div>
                <div style={{ fontSize:'0.78rem', color:'var(--ink-400)' }}>Writer</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginBottom:16 }}>
              {[[followers,'Followers'],[following2,'Following']].map(([n,l]) => (
                <div key={l} style={{ flex:1, textAlign:'center', padding:'10px 6px', background:'var(--green-50)', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ fontWeight:700, color:'var(--green-800)', fontSize:'1.1rem' }}>{n}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--ink-400)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
                </div>
              ))}
            </div>
            {canFollow && (
              <button onClick={toggleFollow} className={`btn btn-sm ${following?'btn-primary':'btn-outline'}`} style={{ width:'100%' }}>
                {following ? '✓ Following' : '+ Follow'}
              </button>
            )}
          </div>
        </aside>
      </div>
      <style>{`@media(max-width:860px){.detail-layout{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
