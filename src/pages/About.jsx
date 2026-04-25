import { Link } from 'react-router-dom';

const values = [
  { icon:'🌱', title:'Growth',    desc:'We foster continuous learning and celebrate every writer\'s journey, from first draft to published masterpiece.' },
  { icon:'🤝', title:'Community', desc:'Real connections between real people. We champion authentic relationships over algorithmic engagement.' },
  { icon:'✨', title:'Quality',   desc:'We prioritise depth and craft. Thoughtful, well-researched writing is at the heart of everything we do.' },
  { icon:'🔓', title:'Openness',  desc:'Knowledge should flow freely. We keep our platform accessible and our community welcoming to all voices.' },
];
const team = [
  { name:'Aryan Sharma',  role:'Co-Founder & CEO',    color:'var(--green-700)', bio:'Aryan leads product vision and community growth. Former tech journalist.' },
  { name:'Priya Nair',    role:'Head of Design',       color:'var(--green-600)', bio:'Priya crafts every pixel. Believer in design that\'s beautiful and purposeful.' },
  { name:'Rahul Verma',   role:'Lead Engineer',        color:'var(--green-800)', bio:'Rahul builds the infrastructure that keeps VerdantVoices fast and secure.' },
  { name:'Maya Patel',    role:'Community Manager',    color:'var(--green-500)', bio:'Maya nurtures our writer community and ensures every member feels heard.' },
];

export default function About() {
  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(150deg,var(--green-900) 0%,var(--green-700) 100%)', padding:'140px clamp(16px,5vw,60px) 100px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', fontSize:'20rem', opacity:0.03, top:-60, right:-60, lineHeight:1, pointerEvents:'none' }}>🌿</div>
        <h1 style={{ color:'#fff', fontSize:'clamp(2.4rem,6vw,4rem)', marginBottom:20, position:'relative', zIndex:1 }}>Where Ideas<br/>Find a Home</h1>
        <p style={{ color:'var(--green-200)', fontSize:'1.15rem', maxWidth:620, margin:'0 auto', lineHeight:1.75, position:'relative', zIndex:1 }}>
          VerdantVoices is a thoughtful publishing platform built for writers who care about quality, authenticity, and meaningful connection.
        </p>
      </div>

      {/* Mission */}
      <section style={{ padding:'clamp(64px,8vw,120px) clamp(16px,5vw,60px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', maxWidth:1100, margin:'0 auto' }} className="about-grid">
          <div style={{ borderRadius:'var(--radius-xl)', overflow:'hidden', background:'linear-gradient(135deg,var(--green-100),var(--green-200))', aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'6rem' }}>📖</div>
          <div>
            <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--green-600)', marginBottom:14 }}>Our Mission</div>
            <h2 style={{ marginBottom:18 }}>Giving Every Voice a Stage</h2>
            <p style={{ color:'var(--ink-400)', lineHeight:1.8, marginBottom:16 }}>We believe everyone has a story worth telling. VerdantVoices was founded on the principle that great writing deserves a great home — a platform designed to surface quality over noise.</p>
            <p style={{ color:'var(--ink-400)', lineHeight:1.8, marginBottom:28 }}>Our tools empower writers to focus on what matters most: crafting compelling stories that inform, inspire, and connect people across the globe.</p>
            <Link to="/register" className="btn btn-primary">Join the Community</Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ background:'var(--green-900)', padding:'clamp(64px,8vw,120px) clamp(16px,5vw,60px)', textAlign:'center' }}>
        <h2 style={{ color:'#fff', marginBottom:14 }}>What We Stand For</h2>
        <p style={{ color:'var(--green-300)', marginBottom:60, fontSize:'1.05rem' }}>Our core values guide every decision we make.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:28, maxWidth:1100, margin:'0 auto' }}>
          {values.map(v => (
            <div key={v.title} style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'var(--radius-lg)', padding:'36px 28px', transition:'background 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}>
              <div style={{ fontSize:'2.5rem', marginBottom:18 }}>{v.icon}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.2rem', color:'#fff', marginBottom:12 }}>{v.title}</div>
              <p style={{ color:'var(--green-300)', fontSize:'0.9rem', lineHeight:1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section style={{ padding:'clamp(64px,8vw,120px) clamp(16px,5vw,60px)', background:'var(--green-50)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center', maxWidth:1100, margin:'0 auto', direction:'rtl' }} className="about-grid">
          <div style={{ borderRadius:'var(--radius-xl)', background:'linear-gradient(135deg,var(--green-700),var(--green-900))', aspectRatio:'4/3', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'5rem', direction:'ltr' }}>🌍</div>
          <div style={{ direction:'ltr' }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--green-600)', marginBottom:14 }}>Our Story</div>
            <h2 style={{ marginBottom:18 }}>Born from a Love of Words</h2>
            <p style={{ color:'var(--ink-400)', lineHeight:1.8, marginBottom:16 }}>VerdantVoices started as a small experiment — a place where a group of friends could share long-form essays without the pressure of social media. It grew into something far bigger.</p>
            <p style={{ color:'var(--ink-400)', lineHeight:1.8, marginBottom:28 }}>Today we host writers from across the globe, covering everything from technology and science to poetry and personal essays. Each article is a new leaf in our ever-growing garden of ideas.</p>
            <Link to="/blogs" className="btn btn-outline">Read Our Articles</Link>
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:'clamp(64px,8vw,120px) clamp(16px,5vw,60px)', textAlign:'center' }}>
        <h2 style={{ marginBottom:14 }}>The Team</h2>
        <p style={{ color:'var(--ink-400)', marginBottom:60, fontSize:'1.05rem' }}>Passionate people building the future of thoughtful writing.</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:28, maxWidth:900, margin:'0 auto' }}>
          {team.map(m => (
            <div key={m.name} style={{ background:'#fff', border:'1px solid var(--ink-100)', borderRadius:'var(--radius-lg)', padding:'36px 24px', transition:'all 0.25s', boxShadow:'var(--shadow-xs)' }}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow='var(--shadow-md)';e.currentTarget.style.transform='translateY(-4px)'}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow='var(--shadow-xs)';e.currentTarget.style.transform='translateY(0)'}}>
              <div style={{ width:80, height:80, borderRadius:'50%', background:m.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', fontWeight:700, margin:'0 auto 18px' }}>{m.name.charAt(0)}</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', color:'var(--green-900)', marginBottom:4 }}>{m.name}</div>
              <div style={{ fontSize:'0.82rem', color:'var(--ink-400)', marginBottom:14 }}>{m.role}</div>
              <p style={{ fontSize:'0.85rem', color:'var(--ink-500)', lineHeight:1.6 }}>{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:'80px clamp(16px,5vw,60px)', textAlign:'center', background:'var(--ivory-200)' }}>
        <h2 style={{ fontSize:'clamp(1.8rem,4vw,2.6rem)', marginBottom:16 }}>Ready to Find Your Voice?</h2>
        <p style={{ color:'var(--ink-400)', marginBottom:32, fontSize:'1.05rem' }}>Join thousands of writers sharing their stories on VerdantVoices.</p>
        <div style={{ display:'flex', gap:14, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/contact"  className="btn btn-outline btn-lg">Get in Touch</Link>
        </div>
      </section>
      <style>{`@media(max-width:760px){.about-grid{grid-template-columns:1fr!important;direction:ltr!important}}`}</style>
    </div>
  );
}
