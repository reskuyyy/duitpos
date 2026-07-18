import Card from '../components/Card';
import { colors } from '../theme';

export default function Pengingat() {
  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Pengingat & Notifikasi</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 24 }}>Fase 3 — direncanakan</p>
      <Card style={{ textAlign: 'center', padding: '32px 16px' }}>
        <p style={{ margin: 0 }}>Notifikasi batas anggaran & pengaturan pengingat akan hadir di sini.</p>
        <p style={{ fontSize: 12, color: colors.inkFaint, marginTop: 8 }}>
          Notifikasi web butuh izin browser dan kurang reliable di iOS dibanding versi native.
        </p>
      </Card>
    </div>
  );
}
