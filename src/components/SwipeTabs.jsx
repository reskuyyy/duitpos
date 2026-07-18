import { useRef, useState } from 'react';
import { colors } from '../theme';

export default function SwipeTabs({ tabs, active, onChange, children }) {
  const touchX = useRef(null);

  const handleTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchX.current;
    const idx = tabs.findIndex((t) => t.key === active);
    if (diff < -50 && idx < tabs.length - 1) onChange(tabs[idx + 1].key);
    if (diff > 50 && idx > 0) onChange(tabs[idx - 1].key);
    touchX.current = null;
  };

  return (
    <div>
      <div style={{ display: 'flex', background: colors.surfaceAlt, borderRadius: 10, padding: 3, marginBottom: 12 }}>
        {tabs.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 7,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                background: isActive ? colors.surface : 'transparent',
                color: isActive ? colors.ink : colors.inkFaint,
                transition: 'background 0.15s',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {children}
      </div>
    </div>
  );
}
