import Card from '../components/Card';
import { resetSemuaData } from '../storage';
import { colors } from '../theme';

export default function Pengaturan() {
  const reset = () => {
    if (confirm('Semua transaksi dan anggaran akan dihapus permanen dari browser ini. Lanjut?')) {
      resetSemuaData();
      alert('Semua data sudah dihapus.');
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Pengaturan Aplikasi</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 24 }}>Fase 3 — direncanakan</p>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
          <span style={{ flex: 1 }}>Preferensi Tampilan</span>
          <span style={{ fontSize: 12, color: colors.inkFaint }}>Segera hadir</span>
        </div>
        <div style={{ height: 1, background: colors.border, margin: '4px 0' }} />
        <div
          onClick={reset}
          style={{ display: 'flex', alignItems: 'center', padding: '8px 0', cursor: 'pointer' }}
        >
          <span style={{ flex: 1, color: colors.expense }}>Kelola Data</span>
          <span style={{ fontSize: 12, color: colors.inkFaint }}>Hapus semua data</span>
        </div>
      </Card>
      <p style={{ color: colors.inkFaint, fontSize: 12, marginTop: 16 }}>
        Data disimpan di browser ini (localStorage) — tiap device/browser punya datanya sendiri, belum ada sinkronisasi.
      </p>
    </div>
  );
}
