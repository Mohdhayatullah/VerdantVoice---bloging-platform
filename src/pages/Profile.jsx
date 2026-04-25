import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, changePassword, getMyBlogs, getFollowersCount, getFollowingCount } from '../api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const fileRef  = useRef(null);
  const [panel,  setPanel]  = useState('edit');
  const [form,   setForm]   = useState({ fullName:'', email:'', phoneNumber:'' });
  const [pwdForm,setPwdForm]= useState({ newPass:'', confirm:'' });
  const [avatar, setAvatar] = useState(null);
  const [preview,setPreview]= useState('');
  const [stats,  setStats]  = useState({ blogs:0, followers:0, following:0 });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const [pwdErr, setPwdErr] = useState('');

  useEffect(() => {
    if (user) {
      setForm({ fullName: user.fullName||'', email: user.email||'', phoneNumber: user.phoneNumber||'' });
      setPreview(user.imageUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getMyBlogs(),
      getFollowersCount(user.id),
      getFollowingCount(user.id),
    ]).then(([b, fc, fw]) => {
      setStats({ blogs: b.data?.length || 0, followers: fc.data || 0, following: fw.data || 0 });
    }).catch(() => {});
  }, [user]);

  const handleAvatarChange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    if (f.size > 5*1024*1024) { toast.error('Image must be under 5MB'); return; }
    setAvatar(f); setPreview(URL.createObjectURL(f));
  };

  const saveProfile = async (e) => {
    e.preventDefault(); setError('');
    if (!form.fullName || !form.email) { setError('Name and email are required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('data', JSON.stringify(form));
      if (avatar) fd.append('file', avatar);
      await updateProfile(fd);
      await refreshUser();
      setAvatar(null);
      toast.success('✓ Profile updated!');
    } catch(e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const savePassword = async (e) => {
    e.preventDefault(); setPwdErr('');
    if (!pwdForm.newPass || !pwdForm.confirm) { setPwdErr('Please fill both fields.'); return; }
    if (pwdForm.newPass !== pwdForm.confirm)   { setPwdErr('Passwords do not match.');  return; }
    if (pwdForm.newPass.length < 8)            { setPwdErr('Password must be at least 8 characters.'); return; }
    setSaving(true);
    try {
      await changePassword(pwdForm.newPass);
      toast.success('Password updated!');
      setPwdForm({ newPass:'', confirm:'' });
    } catch(e) { setPwdErr(e.message); }
    finally { setSaving(false); }
  };

  const initial = user?.fullName?.charAt(0).toUpperCase() || 'U';

  const menuItems = [
    { key:'edit',     icon:'✏️', label:'Edit Profile' },
    { key:'password', icon:'🔑', label:'Change Password' },
  ];

  return (
    <div style={{ background:'var(--ivory-200)', minHeight:'100vh', padding:'40px clamp(16px,4vw,40px) 80px' }}>
      <div style={{ maxWidth:980, margin:'0 auto', display:'grid', gridTemplateColumns:'300px 1fr', gap:32 }} className="profile-layout page-fade">

        {/* ── Sidebar Card ── */}
        <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', overflow:'hidden', boxShadow:'var(--shadow-sm)', height:'fit-content', position:'sticky', top:90 }}>
          <div style={{ height:110, background:'linear-gradient(135deg,var(--green-700),var(--green-900))' }} />
          <div style={{ padding:'0 28px 32px' }}>
            {/* Avatar */}
            <div style={{ marginTop:-44, marginBottom:16, position:'relative', width:'fit-content' }}>
              <div style={{ width:88, height:88, borderRadius:'50%', border:'4px solid #fff', background:'var(--green-700)', color:'#fff', fontSize:'2rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', boxShadow:'var(--shadow-sm)', cursor:'pointer' }}
                onClick={() => fileRef.current?.click()}>
                {preview ? <img src={preview} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : initial}
              </div>
              <button onClick={() => fileRef.current?.click()} style={{ position:'absolute', bottom:2, right:2, width:26, height:26, borderRadius:'50%', background:'var(--green-700)', color:'#fff', border:'2px solid #fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', cursor:'pointer' }}>✏</button>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
            </div>

            <div style={{ fontFamily:'var(--font-display)', fontSize:'1.4rem', color:'var(--green-900)', marginBottom:4 }}>{user?.fullName || 'User'}</div>
            <div style={{ fontSize:'0.85rem', color:'var(--ink-400)', marginBottom:20 }}>{user?.email}</div>

            {/* Stats */}
            <div style={{ display:'flex', border:'1px solid var(--ink-100)', borderRadius:'var(--radius-md)', overflow:'hidden', marginBottom:24 }}>
              {[['Articles',stats.blogs],['Followers',stats.followers],['Following',stats.following]].map(([l,n],i,a) => (
                <div key={l} style={{ flex:1, textAlign:'center', padding:'14px 6px', borderRight: i<a.length-1 ? '1px solid var(--ink-100)' : 'none' }}>
                  <div style={{ fontWeight:700, fontSize:'1.15rem', color:'var(--green-800)' }}>{n}</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--ink-400)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{l}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <ul style={{ listStyle:'none' }}>
              {menuItems.map(({ key, icon, label }) => (
                <li key={key}>
                  <button onClick={()=>setPanel(key)} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', color: panel===key ? 'var(--green-700)' : 'var(--ink-500)', background: panel===key ? 'var(--green-50)' : 'transparent', fontFamily:'var(--font-sans)', fontSize:'0.9rem', fontWeight:600, width:'100%', textAlign:'left', cursor:'pointer', transition:'all 0.2s', marginBottom:4, border:'none' }}>
                    {icon} {label}
                  </button>
                </li>
              ))}
              <li><Link to="/my-blogs" style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', color:'var(--ink-500)', fontSize:'0.9rem', fontWeight:600, transition:'all 0.2s' }}>📝 My Articles</Link></li>
              <li><Link to="/feed"     style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', color:'var(--ink-500)', fontSize:'0.9rem', fontWeight:600, transition:'all 0.2s' }}>📰 My Feed</Link></li>
              <li>
                <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 14px', borderRadius:'var(--radius-sm)', color:'var(--danger)', background:'transparent', fontFamily:'var(--font-sans)', fontSize:'0.9rem', fontWeight:600, width:'100%', textAlign:'left', cursor:'pointer', transition:'all 0.2s', marginTop:4, border:'none' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fdf0f0'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  🚪 Sign Out
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Right Panels ── */}
        <div>
          {panel === 'edit' && (
            <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', padding:40, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>Edit Profile</h2>
                <span style={{ background:'var(--green-50)', color:'var(--green-700)', border:'1px solid var(--green-200)', borderRadius:999, padding:'4px 14px', fontSize:'0.75rem', fontWeight:700 }}>Personal Info</span>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <form onSubmit={saveProfile}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-control" value={form.fullName} onChange={e=>setForm(p=>({...p,fullName:e.target.value}))} placeholder="Jane Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input className="form-control" type="tel" value={form.phoneNumber} onChange={e=>setForm(p=>({...p,phoneNumber:e.target.value}))} placeholder="+91 00000 00000" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input className="form-control" type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@example.com" />
                </div>
                <div style={{ display:'flex', gap:12, marginTop:8 }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Save Changes'}</button>
                  <button type="button" className="btn btn-ghost" onClick={()=>refreshUser()}>Reset</button>
                </div>
              </form>
            </div>
          )}

          {panel === 'password' && (
            <div style={{ background:'#fff', borderRadius:'var(--radius-xl)', padding:40, boxShadow:'var(--shadow-sm)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem' }}>Change Password</h2>
                <span style={{ background:'var(--ink-100)', color:'var(--ink-500)', border:'1px solid var(--ink-200)', borderRadius:999, padding:'4px 14px', fontSize:'0.75rem', fontWeight:700 }}>Security</span>
              </div>
              {pwdErr && <div className="alert alert-error">{pwdErr}</div>}
              <form onSubmit={savePassword}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" value={pwdForm.newPass} onChange={e=>setPwdForm(p=>({...p,newPass:e.target.value}))} placeholder="Min 8 characters" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input className="form-control" type="password" value={pwdForm.confirm} onChange={e=>setPwdForm(p=>({...p,confirm:e.target.value}))} placeholder="Repeat new password" />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Updating…':'Update Password'}</button>
              </form>
            </div>
          )}
        </div>
      </div>
      <style>{`@media(max-width:760px){.profile-layout{grid-template-columns:1fr!important}.profile-layout>div:first-child{position:static!important}}`}</style>
    </div>
  );
}
