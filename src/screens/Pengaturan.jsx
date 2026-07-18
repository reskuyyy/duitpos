import { useRef, useState } from 'react';
import Card from '../components/Card';
import { resetSemuaData, exportSemuaData, importSemuaData } from '../storage';
import { colors } from '../theme';

export default function Pengaturan() {
  const fileInputRef = useRef(null);
  const [pesan, setPesan] = useState('');

  const reset = () => {
    if (confirm('Semua transaksi dan anggaran akan dihapus permanen dari browser ini. Lanjut?')) {
      resetSemuaData();
      alert('Semua data sudah dihapus.');
      window.location.reload();
    }
  };

  const exportData = () => {
    const data = exportSemuaData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const tanggal = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `duitpos-backup-${tanggal}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const pilihFileImport = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!confirm('Import akan MENIMPA semua data yang ada sekarang dengan isi file backup ini. Lanjut?')) {
          return;
        }
        importSemuaData(data);
        setPesan('Data berhasil di-import!');
        setTimeout(() => window.location.reload(), 800);
      } catch (err) {
        alert('Gagal import: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Pengaturan Aplikasi</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 24 }}>Fase 3 — direncanakan</p>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Export & Backup</h2>
      <Card>
        <p style={{ margin: 0, color: colors.inkMuted, fontSize: 14 }}>
          Data DuitPos cuma tersimpan di browser ini. Export ke file secara rutin biar aman
          kalau ganti HP, install ulang, atau clear data Safari.
        </p>
        <button
          onClick={exportData}
          style={{ marginTop: 12, width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: colors.accent, color: colors.bg, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          ⬇ Export Data (.json)
        </button>
        <button
          onClick={pilihFileImport}
          style={{ marginTop: 8, width: '100%', padding: '12px 0', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.ink, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          ⬆ Import dari File Backup
        </button>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleFile} style={{ display: 'none' }} />
        {pesan && <p style={{ color: colors.income, fontSize: 13, marginTop: 8, marginBottom: 0 }}>{pesan}</p>}
      </Card>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Lainnya</h2>
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
          <span style={{ flex: 1, color: colors.expense }}>Hapus Semua Data</span>
          <span style={{ fontSize: 12, color: colors.inkFaint }}>Permanen</span>
        </div>
      </Card>
    </div>
  );
}
