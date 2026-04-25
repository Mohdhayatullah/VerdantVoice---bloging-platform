import { useState } from 'react';
import toast from 'react-hot-toast';

const subjects = ['General Inquiry','Technical Support','Partnership','Feedback'];
const methods = [
  { icon:'📧', label:'Email Us',     value:'hello@verdantvoices.com' },
  { icon:'💬', label:'Live Chat',    value:'Mon–Fri, 9am–6pm IST' },
  { icon:'🐦', label:'Twitter / X',  value:'@VerdantVoices' },
  { icon:'📍', label:'Office',       value:'Chandigarh, India 🇮🇳' },
];

export default function Contact() {
  const [form,    setForm]    = useState({ first:'', last:'', email:'', message:'' });
  const [subject, setSubject] = useState('General Inquiry');
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({...p,[field]:e.target.value})) });

  const submit = (e) => {
    e.preventDefault(); setError('');
    if (!form.first || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    if (!form.email.includes('@')) { setError('Please enter a valid email.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); toast.success('Message sent! We\'ll reply within 24h 🌿'); }, 1200);
  };

  return (
    <div className="page-fade">
      {/* Hero */}
      <div style={{ background:'linear-gradient(145deg,var(--green-900),var(--green-700))', padding:'130px clamp(16px,5vw,60px) 90px', textAlign:'center' }}>
        <h1 style={{ color:'#fff', marginBottom:14 }}>Get in Touch</h1>
        <p style={{ color:'var(--green-200)', fontSize:'1.1rem', maxWidth:500, margin:'0 auto' }}>Have a question, idea, or just want to say hello? We'd love to hear from you.</p>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(64px,8vw,100px) clamp(16px,5vw,60px)' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:56, alignItems:'start' }} className="contact-grid">

          {/* Info */}
          <div>
            <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', marginBottom:16 }}>We're Here for You</h3>
            <p style={{ color:'var(--ink-400)', lineHeight:1.8, marginBottom:36 }}>Whether you're a writer with questions, a reader with feedback, or a partner with an idea — our team is ready to help.</p>
            {methods.map(m => (
              <div key={m.label} style={{ display:'flex', gap:16, alignItems:'flex-start', marginBottom:20, padding:18, border:'1px solid var(--ink-100)', borderRadius:'var(--radius-md)', transition:'all 0.2s', cursor:'default' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--green-300)';e.currentTarget.style.background='var(--green-50)'}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--ink-100)';e.currentTarget.style.background='transparent'}}>
                <div style={{ width:44, height:44, borderRadius:'var(--radius-sm)', background:'var(--green-100)', color:'var(--green-700)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{m.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'0.88rem', color:'var(--ink-800)', marginBottom:4 }}>{m.label}</div>
                  <div style={{ fontSize:'0.88rem', color:'var(--ink-500)' }}>{m.value}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:36, padding:24, background:'var(--green-50)', borderRadius:'var(--radius-lg)', border:'1px solid var(--green-200)' }}>
              <div style={{ fontWeight:700, color:'var(--green-800)', marginBottom:8 }}>⏱ Response Time</div>
              <p style={{ color:'var(--ink-500)', fontSize:'0.88rem', lineHeight:1.6, margin:0 }}>We typically respond within 24 hours on business days. For urgent issues, tweet us for the fastest response.</p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', border:'1px solid var(--ink-100)', padding:44, boxShadow:'var(--shadow-md)' }}>
            {done ? (
              <div style={{ textAlign:'center', padding:'40px 20px' }}>
                <div style={{ fontSize:'4rem', marginBottom:20 }}>🎉</div>
                <h3 style={{ fontFamily:'var(--font-display)', color:'var(--green-900)', fontSize:'1.6rem', marginBottom:12 }}>Message Sent!</h3>
                <p style={{ color:'var(--ink-400)', marginBottom:28 }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
                <button className="btn btn-outline" onClick={()=>{setDone(false);setForm({first:'',last:'',email:'',message:''});}}>Send Another</button>
              </div>
            ) : (
              <>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--green-900)', marginBottom:28 }}>Send a Message</h3>
                {error && <div className="alert alert-error">{error}</div>}
                <form onSubmit={submit}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <div className="form-group"><label className="form-label">First Name *</label><input className="form-control" placeholder="Jane" {...f('first')} /></div>
                    <div className="form-group"><label className="form-label">Last Name</label><input className="form-control" placeholder="Doe" {...f('last')} /></div>
                  </div>
                  <div className="form-group"><label className="form-label">Email *</label><input className="form-control" type="email" placeholder="you@example.com" {...f('email')} /></div>
                  <div className="form-group">
                    <label className="form-label" style={{ marginBottom:10 }}>Subject</label>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {subjects.map(s => (
                        <button key={s} type="button" onClick={()=>setSubject(s)} className={`btn btn-sm ${subject===s?'btn-primary':'btn-outline'}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">Message *</label><textarea className="form-control" rows="6" placeholder="Tell us what's on your mind…" style={{ minHeight:140 }} {...f('message')} /></div>
                  <button type="submit" className="btn btn-primary btn-lg" style={{ width:'100%' }} disabled={loading}>{loading?'Sending…':'Send Message 🌿'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:760px){.contact-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
