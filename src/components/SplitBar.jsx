import { colors } from '../theme';

export default function SplitBar({ masuk, keluar }) {
  const total = masuk + keluar;
  const pctMasuk = total > 0 ? Math.max(masuk / total, 0.02) : 0.5;
  const pctKeluar = total > 0 ? Math.max(keluar / total, 0.02) : 0.5;

  return (
    <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', background: colors.surfaceAlt }}>
      <div style={{ flex: pctMasuk, background: colors.income }} />
      <div style={{ flex: pctKeluar, background: colors.expense }} />
    </div>
  );
}
