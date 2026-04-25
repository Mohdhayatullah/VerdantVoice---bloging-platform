export default function StarRating({ value = 0, size = 16, interactive = false, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span style={{ display:'inline-flex', gap:2 }}>
      {stars.map(s => (
        <span key={s}
          onClick={() => interactive && onChange && onChange(s)}
          style={{
            fontSize: size, color: s <= Math.round(value) ? '#f4a017' : 'var(--ink-200)',
            cursor: interactive ? 'pointer' : 'default',
            transition: 'color 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => { if (interactive) e.currentTarget.style.transform = 'scale(1.2)'; }}
          onMouseLeave={e => { if (interactive) e.currentTarget.style.transform = 'scale(1)'; }}
        >★</span>
      ))}
    </span>
  );
}
