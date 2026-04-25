import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => {
    logout();
    setDropOpen(false);
    setMobileOpen(false);
    toast.success('Signed out successfully');
    navigate('/');
  };

  const navLinks = [
    { to: '/',          label: 'Home',      end: true },
    { to: '/blogs',     label: 'Explore' },
    { to: '/community', label: 'Community' },
    { to: '/about',     label: 'About' },
    { to: '/contact',   label: 'Contact' },
  ];

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: '70px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 clamp(16px,5vw,60px)',
        background: 'rgba(250,248,243,0.92)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid var(--ink-100)',
        transition: 'box-shadow 0.3s',
        boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, fontFamily:'var(--font-display)', fontSize:'1.55rem', color:'var(--green-800)', fontStyle:'italic', fontWeight:600 }}>
          <span style={{ width:34, height:34, background:'var(--green-700)', borderRadius:'50% 0 50% 50%', display:'flex', alignItems:'center', justifyContent:'center', transform:'rotate(-45deg)', color:'#fff', fontSize:16, flexShrink:0 }}>
            <span style={{ transform:'rotate(45deg)', display:'block' }}>🌿</span>
          </span>
          VerdantVoices
        </Link>

        {/* Desktop Nav */}
        <ul className="hide-mobile" style={{ display:'flex', gap:28, listStyle:'none', alignItems:'center' }}>
          {navLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} style={({ isActive }) => ({
                fontSize: '0.85rem', fontWeight: 600, color: isActive ? 'var(--green-700)' : 'var(--ink-500)',
                letterSpacing: '0.03em', textTransform: 'uppercase', paddingBottom: 2,
                borderBottom: isActive ? '2px solid var(--green-600)' : '2px solid transparent',
                transition: 'all 0.2s',
              })}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {isLoggedIn ? (
            <>
              <Link to="/write" className="btn btn-primary btn-sm hide-mobile" style={{ display:'flex' }}>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v5h5a1 1 0 010 2h-5v5a1 1 0 01-2 0v-5H4a1 1 0 010-2h5V4a1 1 0 011-1z"/></svg>
                Write
              </Link>
              {/* Avatar dropdown */}
              <div ref={dropRef} style={{ position:'relative' }}>
                <div onClick={() => setDropOpen(o => !o)} style={{
                  width: 38, height: 38, borderRadius: '50%',
                  background: user?.imageUrl ? 'transparent' : 'var(--green-700)',
                  color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden',
                  border: '2.5px solid var(--green-400)',
                  transition: 'transform 0.2s',
                  transform: dropOpen ? 'scale(1.05)' : 'scale(1)',
                }}>
                  {user?.imageUrl
                    ? <img src={user.imageUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : initial}
                </div>
                {dropOpen && (
                  <div style={{
                    position:'absolute', top:'calc(100% + 10px)', right:0,
                    background:'#fff', border:'1px solid var(--ink-100)',
                    borderRadius: 'var(--radius-md)', boxShadow:'var(--shadow-lg)',
                    minWidth:190, padding:'8px 0', zIndex:600,
                  }}>
                    {[
                      { to:'/profile',  label:'👤 My Profile' },
                      { to:'/my-blogs', label:'📝 My Articles' },
                      { to:'/feed',     label:'📰 My Feed' },
                    ].map(({ to, label }) => (
                      <Link key={to} to={to} onClick={() => setDropOpen(false)} style={{ display:'block', padding:'10px 18px', fontSize:'0.88rem', color:'var(--ink-500)', transition:'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background='var(--green-50)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        {label}
                      </Link>
                    ))}
                    <div style={{ borderTop:'1px solid var(--ink-100)', margin:'6px 0' }} />
                    <button onClick={handleLogout} style={{ display:'block', width:'100%', padding:'10px 18px', fontSize:'0.88rem', color:'var(--danger)', textAlign:'left', background:'transparent', transition:'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fdf0f0'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="hide-mobile" style={{ display:'flex', gap:10 }}>
              <Link to="/login"    className="btn btn-outline btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
            </div>
          )}

          {/* Hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} style={{ display:'none', flexDirection:'column', gap:5, background:'transparent', padding:4 }} className="hamburger-btn">
            {[0,1,2].map(i => (
              <span key={i} style={{ display:'block', width:22, height:2, background:'var(--ink-700)', borderRadius:2, transition:'all 0.3s',
                transform: mobileOpen ? (i===0 ? 'rotate(45deg) translate(5px,5px)' : i===2 ? 'rotate(-45deg) translate(5px,-5px)' : 'scaleX(0)') : 'none',
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position:'fixed', top:70, left:0, right:0, zIndex:490,
          background:'#fff', borderBottom:'1px solid var(--ink-100)',
          padding:'16px 24px 24px', boxShadow:'var(--shadow-md)',
        }}>
          {navLinks.map(({ to, label, end }) => (
            <Link key={to} to={to} onClick={() => setMobileOpen(false)}
              style={{ display:'block', padding:'12px 0', fontSize:'1rem', color:'var(--ink-700)', borderBottom:'1px solid var(--ink-100)', fontWeight:500 }}>
              {label}
            </Link>
          ))}
          <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:10 }}>
            {isLoggedIn ? (
              <>
                <Link to="/write"    className="btn btn-primary"    onClick={() => setMobileOpen(false)}>✍️ Write Article</Link>
                <Link to="/profile"  className="btn btn-ghost"      onClick={() => setMobileOpen(false)}>👤 My Profile</Link>
                <Link to="/my-blogs" className="btn btn-ghost"      onClick={() => setMobileOpen(false)}>📝 My Articles</Link>
                <Link to="/feed"     className="btn btn-ghost"      onClick={() => setMobileOpen(false)}>📰 My Feed</Link>
                <button              className="btn btn-danger"     onClick={handleLogout}>🚪 Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn btn-outline"    onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn btn-primary"    onClick={() => setMobileOpen(false)}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`.hamburger-btn { display: none !important; } @media(max-width:768px){ .hamburger-btn { display: flex !important; } }`}</style>
    </>
  );
}
