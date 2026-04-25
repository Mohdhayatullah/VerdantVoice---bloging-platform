import { Link } from 'react-router-dom';
import StarRating from './StarRating';

export default function BlogCard({ blog }) {
  const excerpt = (blog.description || '').replace(/<[^>]+>/g, '').slice(0, 130) + '…';
  return (
    <article className="card" style={{ display:'flex', flexDirection:'column' }}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.imageURl
          ? <img src={blog.imageURl} alt={blog.title} style={{ width:'100%', aspectRatio:'16/9', objectFit:'cover' }} />
          : <div style={{ width:'100%', aspectRatio:'16/9', background:'linear-gradient(135deg,var(--green-100),var(--green-200))', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem' }}>🌿</div>
        }
      </Link>
      <div style={{ padding:'22px', display:'flex', flexDirection:'column', flex:1 }}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12 }}>
          {(blog.tags || []).slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <Link to={`/blogs/${blog.id}`}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--green-900)', marginBottom:10, lineHeight:1.3,
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
            transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='var(--green-700)'}
            onMouseLeave={e=>e.currentTarget.style.color='var(--green-900)'}>
            {blog.title}
          </h3>
        </Link>
        <p style={{ fontSize:'0.85rem', color:'var(--ink-400)', lineHeight:1.65, marginBottom:18,
          display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {excerpt}
        </p>
        <div style={{ marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, fontSize:'0.78rem', color:'var(--ink-400)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--green-700)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700 }}>
              {(blog.userName || 'A').charAt(0).toUpperCase()}
            </div>
            <span style={{ fontWeight:500, color:'var(--ink-600)' }}>{blog.userName || 'Anonymous'}</span>
          </div>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span>❤️ {blog.likeCount || 0}</span>
            <span>👁 {blog.viewCount || 0}</span>
            <StarRating value={blog.averageRating || 0} size={12} />
          </div>
        </div>
      </div>
    </article>
  );
}
