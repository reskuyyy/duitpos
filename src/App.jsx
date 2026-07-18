import { useState } from 'react';
import Ringkasan from './screens/Ringkasan';
import Anggaran from './screens/Anggaran';
import Transaksi from './screens/Transaksi';
import Pengingat from './screens/Pengingat';
import Pengaturan from './screens/Pengaturan';
import { colors } from './theme';

const TABS = [
  { key: 'ringkasan', label: 'Ringkasan', icon: '◔', Comp: Ringkasan },
  { key: 'anggaran', label: 'Anggaran', icon: '◧', Comp: Anggaran },
  { key: 'transaksi', label: 'Catat', icon: '⊕', Comp: Transaksi },
  { key: 'pengingat', label: 'Pengingat', icon: '◎', Comp: Pengingat },
  { key: 'pengaturan', label: 'Pengaturan', icon: '⚙', Comp: Pengaturan },
];

export default function App() {
  const [active, setActive] = useState('ringkasan');
  const Active = TABS.find((t) => t.key === active).Comp;

  return (
    <div
      style={{
        maxWidth: 480,
        margin: '0 auto',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: colors.bg,
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 8 }}>
        <Active />
      </div>

      <nav
        style={{
          display: 'flex',
          borderTop: `1px solid ${colors.border}`,
          background: colors.surface,
          paddingBottom: 'env(safe-area-inset-bottom)',
          position: 'sticky',
          bottom: 0,
        }}
      >
        {TABS.map((t) => {
          const isActive = t.key === active;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                padding: '10px 0 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                color: isActive ? colors.accent : colors.inkFaint,
              }}
            >
              <span style={{ fontSize: 20, lineHeight: 1 }}>{t.icon}</span>
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
