import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  { cat:'getting-started', q:'What is VerdantVoices?',         a:'VerdantVoices is a community-driven blogging platform where writers share ideas, stories, and insights. It\'s built for people who care about quality writing and meaningful connection.' },
  { cat:'getting-started', q:'Is VerdantVoices free to use?',  a:'Yes! Creating an account and reading articles is completely free. You can publish unlimited articles, follow writers, and engage with the community at no cost.' },
  { cat:'getting-started', q:'How do I create an account?',    a:'Click the "Join Free" button in the top right corner. Fill in your name, email, and a password — you\'ll be writing in minutes.' },
  { cat:'writing',         q:'How do I publish my first article?',  a:'Once logged in, click the "Write" button in the navbar. Use our rich text editor to craft your article, add tags and a cover image, then hit Publish. Your article will appear instantly.' },
  { cat:'writing',         q:'Can I edit or delete my articles after publishing?', a:'Yes. From your "My Articles" page, click Edit on any article to update it. You can also delete articles permanently — but note this cannot be undone.' },
  { cat:'writing',         q:'What is a draft?',               a:'A draft is an article you\'ve saved but not yet made public. Toggle the "Publish Now" switch off in the editor to save as a draft, then publish it later when ready.' },
  { cat:'writing',         q:'Can I add images to my article?', a:'Absolutely. Upload a cover image when creating your article. Inside the editor, you can also embed images directly into your content using the image button in the toolbar.' },
  { cat:'account',         q:'How do I change my password?',   a:'Go to your Profile page and click "Change Password" in the left menu. Enter your new password twice and save. Make sure it\'s at least 8 characters.' },
  { cat:'account',         q:'Can I update my profile photo?', a:'Yes. On your Profile page, click the pencil icon on your avatar to upload a new photo. Supported formats: JPG, PNG, WebP up to 5MB.' },
  { cat:'account',         q:'How do I delete my account?',    a:'To request account deletion, contact us at hello@verdantvoices.com from your registered email. We\'ll process the request within 48 hours.' },
  { cat:'community',       q:'How does following work?',       a:'When you follow a writer, their new articles appear in your personalised Feed. Visit any article and click "+ Follow" in the sidebar to follow that writer.' },
  { cat:'community',       q:'What is the Feed?',              a:'Your Feed shows the latest articles from writers you follow — a personalised reading experience curated entirely by you, accessible from the navbar.' },
  { cat:'community',       q:'How do I leave a review?',       a:'Scroll to the bottom of any article to find the Reviews section. Select a star rating and write your comment, then click "Post Review". You must be signed in.' },
  { cat:'technical',       q:'Why am I getting a "session expired" error?', a:'Your JWT login session expires after a period of time. Simply sign out and sign back in to get a fresh session. If the issue persists, clear your browser\'s local storage.' },
  { cat:'technical',       q:'What browsers are supported?',   a:'VerdantVoices works on all modern browsers: Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.' },
  { cat:'technical',       q:'My cover image isn\'t uploading.', a:'Make sure your image is under 5MB and is a JPG, PNG, or WebP file. If the problem continues, try a different browser or contact support.' },
];

const catNames = { 'getting-started':'Getting Started', writing:'Writing & Publishing', account:'Account', community:'Community', technical:'Technical' };
const cats = ['all','getting-started','writing','account','community','technical'];

export default function FAQ() {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('all');
  const [openId,   setOpenId]   = useState(null);

  const filtered = useMemo(() => faqs.filter(f => {
    const mc = category === 'all' || f.cat === category;
    const mq = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return mc && mq;
  }), [search, category]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(f => { if(!g[f.cat]) g[f.cat]=[]; g[f.cat].push(f); });
    return g;
  }, [filtered]);

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(145deg,var(--green-900),var(--green-800))', padding:'130px clamp(16px,5vw,60px) 90px', textAlign:'center' }}>
        <h1 style={{ color:'#fff', marginBottom:14 }}>Frequently Asked Questions</h1>
        <p style={{ color:'var(--green-200)', fontSize:'1.1rem', maxWidth:520, margin:'0 auto 36px' }}>Find answers to the most common questions about VerdantVoices.</p>
        <div style={{ maxWidth:480, margin:'0 auto', position:'relative' }}>
          <span style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', fontSize:'1.1rem' }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search questions…"
            style={{ width:'100%', padding:'16px 20px 16px 50px', borderRadius:'var(--radius-md)', border:'none', fontFamily:'var(--font-sans)', fontSize:'1rem', outline:'none', boxShadow:'var(--shadow-md)' }} />
        </div>
      </div>

      <div style={{ maxWidth:820, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,5vw,60px)' }}>
        {/* Category filters */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:48 }}>
          {cats.map(c => (
            <button key={c} onClick={()=>setCategory(c)} className={`btn btn-sm ${category===c?'btn-primary':'btn-outline'}`}>
              {c==='all' ? 'All' : catNames[c]}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        {!filtered.length ? (
          <div className="empty-state"><div className="empty-icon">🤔</div><h3>No results found</h3><p>Try a different search or category.</p></div>
        ) : Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} style={{ marginBottom:48 }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--green-600)', marginBottom:20, paddingBottom:10, borderBottom:'2px solid var(--green-100)' }}>
              {catNames[cat]}
            </div>
            {items.map((item, i) => {
              const key = `${cat}-${i}`;
              const open = openId === key;
              return (
                <div key={key} style={{ border:`1px solid ${open?'var(--green-300)':'var(--ink-100)'}`, borderRadius:'var(--radius-md)', marginBottom:12, overflow:'hidden', transition:'box-shadow 0.2s', boxShadow: open?'var(--shadow-sm)':'none' }}>
                  <button onClick={()=>setOpenId(open?null:key)} style={{ width:'100%', padding:'20px 24px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:16, background: open?'var(--green-50)':'#fff', border:'none', cursor:'pointer', fontFamily:'var(--font-sans)', textAlign:'left', transition:'background 0.2s' }}>
                    <span style={{ fontWeight:600, color:'var(--ink-900)', fontSize:'0.95rem' }}>{item.q}</span>
                    <span style={{ width:28, height:28, borderRadius:'50%', background: open?'var(--green-100)':'var(--ink-100)', color: open?'var(--green-700)':'var(--ink-400)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', flexShrink:0, transition:'all 0.3s', transform: open?'rotate(180deg)':'rotate(0deg)' }}>▾</span>
                  </button>
                  {open && (
                    <div style={{ padding:'0 24px 22px', background:'#fff' }}>
                      <p style={{ color:'var(--ink-500)', lineHeight:1.75, fontSize:'0.92rem' }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* CTA */}
        <div style={{ background:'var(--green-50)', border:'1px solid var(--green-200)', borderRadius:'var(--radius-xl)', padding:48, textAlign:'center', marginTop:60 }}>
          <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green-900)', fontSize:'1.5rem', marginBottom:12 }}>Still have questions?</h3>
          <p style={{ color:'var(--ink-400)', marginBottom:24 }}>Our team is happy to help with anything not covered here.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
