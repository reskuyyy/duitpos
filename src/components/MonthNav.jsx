import { colors } from '../theme';

const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export default function MonthNav({ bulan, onChange }) {
  const geser = (delta) => {
    const d = new Date(bulan);
    d.setMonth(d.getMonth() + delta);
    onChange(d);
  };

  const isBulanIni = (() => {
    const now = new Date();
    return bulan.getMonth() === now.getMonth() && bulan.getFullYear() === now.getFullYear();
  })();

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <button onClick={() => geser(-1)} style={navBtnStyle}>‹</button>
      <span style={{ fontWeight: 700, fontSize: 15 }}>
        {NAMA_BULAN[bulan.getMonth()]} {bulan.getFullYear()}
        {isBulanIni && <span style={{ color: colors.accent, fontSize: 11, marginLeft: 6 }}>Bulan Ini</span>}
      </span>
      <button onClick={() => geser(1)} style={navBtnStyle} disabled={isBulanIni}>›</button>
    </div>
  );
}

const navBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: `1px solid ${colors.border}`,
  background: colors.surfaceAlt,
  color: colors.ink,
  fontSize: 18,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
