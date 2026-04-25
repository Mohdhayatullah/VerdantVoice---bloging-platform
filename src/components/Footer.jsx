import { Link } from 'react-router-dom';

export default function Footer() {
  const cols = [
    { title: 'Explore',  links: [['/','/'],['Blogs','/blogs'],['Community','/community'],['My Feed','/feed']] },
    { title: 'Company',  links: [['About','/about'],['Contact','/contact'],['FAQ','/faq'],['Careers','#']] },
    { title: 'Legal',    links: [['Privacy','#'],['Terms','#'],['Cookies','#'],['Accessibility','#']] },
  ];
  return (
    <footer style={{ background:'var(--green-900)', color:'var(--green-200)', padding:'clamp(48px,6vw,96px) clamp(16px,5vw,60px) 32px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:48, marginBottom:60, flexWrap:'wrap' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', color:'#fff', fontStyle:'italic', marginBottom:14, fontWeight:600 }}>VerdantVoices</div>
          <p style={{ fontSize:'0.88rem', lineHeight:1.75, color:'var(--green-300)', maxWidth:280 }}>
            A community of thinkers, writers and explorers. Share ideas, inspire minds, and grow together in a lush garden of knowledge.
          </p>
          <div style={{ display:'flex', gap:12, marginTop:20 }}>
            {['𝕏','in','📸','📡'].map((s,i) => (
              <a key={i} href="#" style={{ width:36, height:36, background:'rgba(255,255,255,0.08)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green-200)', fontSize:'0.9rem', transition:'background 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.background='var(--green-700)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}>{s}</a>
            ))}
          </div>
        </div>
        {cols.map(({ title, links }) => (
          <div key={title}>
            <h4 style={{ fontFamily:'var(--font-sans)', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--green-400)', marginBottom:18 }}>{title}</h4>
            <ul style={{ listStyle:'none' }}>
              {links.map(([label, to]) => (
                <li key={label} style={{ marginBottom:10 }}>
                  <Link to={to} style={{ fontSize:'0.88rem', color:'var(--green-200)', transition:'color 0.2s' }}
                    onMouseEnter={e=>e.currentTarget.style.color='#fff'}
                    onMouseLeave={e=>e.currentTarget.style.color='var(--green-200)'}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:28, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:'0.82rem', color:'var(--green-400)' }}>
        <span>© 2025 VerdantVoices. All rights reserved.</span>
        <span>Made with 🌿 for curious minds</span>
      </div>
      <style>{`@media(max-width:760px){footer > div:first-child{grid-template-columns:1fr 1fr!important}}`}</style>
    </footer>
  );
}
