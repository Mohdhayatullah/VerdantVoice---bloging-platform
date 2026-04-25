import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ fullName:'', email:'', password:'', confirm:'', phoneNumber:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    const { fullName, email, password, confirm, phoneNumber } = form;
    if (!fullName || !email || !password) { setError('Please fill in all required fields.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      await registerApi({ fullName, email, password, phoneNumber });
      toast.success('Account created! Please sign in 🌿');
      navigate('/login');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const f = (field) => ({ value: form[field], onChange: e => setForm(p => ({ ...p, [field]: e.target.value })) });

  return (
    <div style={{ minHeight:'100vh', background:'var(--green-50)', display:'flex', alignItems:'center', justifyContent:'center', padding:'90px 16px 60px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', maxWidth:920, width:'100%', background:'#fff', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }} className="auth-grid">

        {/* Left panel */}
        <div style={{ background:'linear-gradient(160deg,var(--green-700),var(--green-900))', padding:'60px 48px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontSize:'3rem', marginBottom:24 }}>✍️</div>
          <h2 style={{ color:'#fff', fontSize:'2rem', marginBottom:16 }}>Join Our Community</h2>
          <p style={{ color:'var(--green-200)', lineHeight:1.75, marginBottom:32 }}>Start sharing your voice with thousands of curious readers.</p>
          <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:14 }}>
            {['Publish unlimited articles','Like, follow favourite writers','Get a personalised feed','Track views, likes & ratings'].map(p => (
              <li key={p} style={{ display:'flex', gap:12, color:'var(--green-100)', fontSize:'0.9rem' }}>
                <span style={{ color:'var(--green-400)', flexShrink:0 }}>✓</span>{p}
              </li>
            ))}
          </ul>
        </div>

        {/* Right form */}
        <div style={{ padding:'52px 48px', overflowY:'auto' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--green-800)', fontStyle:'italic', marginBottom:28, fontWeight:600 }}>VerdantVoices</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', marginBottom:6 }}>Create Account</h1>
          <p style={{ color:'var(--ink-400)', fontSize:'0.9rem', marginBottom:32 }}>Join free and start writing today.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handle}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-control" placeholder="Jane Doe" {...f('fullName')} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-control" type="tel" placeholder="+91 00000 00000" {...f('phoneNumber')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-control" type="email" placeholder="you@example.com" {...f('email')} />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position:'relative' }}>
                <input className="form-control" type={showPwd?'text':'password'} placeholder="Min 8 characters" style={{ paddingRight:44 }} {...f('password')} />
                <button type="button" onClick={()=>setShowPwd(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', color:'var(--ink-400)', border:'none', cursor:'pointer' }}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input className="form-control" type={showPwd?'text':'password'} placeholder="Repeat password" {...f('confirm')} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:20, fontSize:'0.78rem', color:'var(--ink-400)', lineHeight:1.5 }}>
            By registering you agree to our <a href="#" style={{ color:'var(--green-700)' }}>Terms</a> and <a href="#" style={{ color:'var(--green-700)' }}>Privacy Policy</a>.
          </p>
          <p style={{ textAlign:'center', marginTop:12, fontSize:'0.88rem', color:'var(--ink-400)' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--green-700)', fontWeight:700 }}>Sign in →</Link>
          </p>
        </div>
      </div>
      <style>{`@media(max-width:640px){.auth-grid{grid-template-columns:1fr!important}.auth-grid>div:first-child{display:none!important}}`}</style>
    </div>
  );
}
