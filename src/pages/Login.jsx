import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi, getProfile } from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [params]   = useSearchParams();
  const [form, setForm]   = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const res  = await loginApi(form);
      const token = res.data?.token;
      if (!token) throw new Error(res.data?.message || 'Login failed — no token');
      login(token);
      const profileRes = await getProfile();
      login(token, profileRes.data);
      toast.success('Welcome back! 🌿');
      navigate(params.get('return') || '/');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--green-50)', display:'flex', alignItems:'center', justifyContent:'center', padding:'90px 16px 60px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', maxWidth:880, width:'100%', background:'#fff', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-lg)' }} className="auth-grid">

        {/* Left panel */}
        <div style={{ background:'linear-gradient(160deg,var(--green-800),var(--green-900))', padding:'60px 48px', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', width:350, height:350, background:'rgba(255,255,255,0.05)', borderRadius:'50%', bottom:-80, right:-80 }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ fontSize:'3rem', marginBottom:24 }}>🌿</div>
            <h2 style={{ color:'#fff', fontSize:'2rem', marginBottom:16 }}>Welcome Back</h2>
            <p style={{ color:'var(--green-200)', lineHeight:1.75, marginBottom:36 }}>Sign in to continue your journey through ideas, stories, and insights.</p>
            <blockquote style={{ borderLeft:'3px solid var(--green-400)', paddingLeft:18, color:'var(--green-200)', fontStyle:'italic', fontSize:'0.95rem', lineHeight:1.7 }}>
              "A reader lives a thousand lives before he dies."
            </blockquote>
          </div>
        </div>

        {/* Right form */}
        <div style={{ padding:'60px 48px' }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--green-800)', fontStyle:'italic', marginBottom:32, fontWeight:600 }}>VerdantVoices</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'1.9rem', marginBottom:6 }}>Sign In</h1>
          <p style={{ color:'var(--ink-400)', fontSize:'0.9rem', marginBottom:32 }}>Enter your credentials to access your account.</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handle}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-control" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <input className="form-control" type={showPwd?'text':'password'} placeholder="••••••••" style={{ paddingRight:44 }} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
                <button type="button" onClick={()=>setShowPwd(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'transparent', color:'var(--ink-400)', fontSize:'1rem', border:'none', cursor:'pointer' }}>
                  {showPwd ? '🙈' : '👁'}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width:'100%', justifyContent:'center' }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:24, fontSize:'0.88rem', color:'var(--ink-400)' }}>
            Don't have an account? <Link to="/register" style={{ color:'var(--green-700)', fontWeight:700 }}>Create one free →</Link>
          </p>
        </div>
      </div>
      <style>{`@media(max-width:640px){.auth-grid{grid-template-columns:1fr!important}.auth-grid>div:first-child{display:none!important}}`}</style>
    </div>
  );
}
