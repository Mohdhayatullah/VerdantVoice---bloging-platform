import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', color:'var(--green-900)' }}>{title}</h3>
          <button onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'var(--ink-100)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink-500)', fontSize:'1rem' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
