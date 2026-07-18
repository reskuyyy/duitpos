import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { getAnggaran, tambahAnggaran, hapusAnggaran } from '../storage';
import { colors, formatRupiah } from '../theme';

const inputStyle = {
  width: '100%',
  background: colors.surfaceAlt,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  color: colors.ink,
  padding: '10px 12px',
  fontSize: 15,
  marginTop: 4,
};

export default function Anggaran() {
  const [list, setList] = useState([]);
  const [nama, setNama] = useState('');
  const [batas, setBatas] = useState('');

  useEffect(() => setList(getAnggaran()), []);

  const simpan = () => {
    const n = parseInt(batas.replace(/\D/g, ''), 10);
    if (!nama.trim() || !n || n <= 0) {
      alert('Isi nama pos dan batas anggaran dulu.');
      return;
    }
    tambahAnggaran({ nama: nama.trim(), batas: n });
    setNama('');
    setBatas('');
    setList(getAnggaran());
  };

  const hapus = (id) => {
    if (confirm('Hapus pos anggaran ini?')) setList(hapusAnggaran(id));
  };

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Anggaran & Pos</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 16 }}>Atur batas pengeluaran per kategori</p>

      <Card>
        <label style={{ fontSize: 12, color: colors.inkFaint }}>
          Nama Pos
          <input style={inputStyle} value={nama} onChange={(e) => setNama(e.target.value)} placeholder="cth: Makan" />
        </label>
        <label style={{ fontSize: 12, color: colors.inkFaint, display: 'block', marginTop: 12 }}>
          Batas Bulanan (Rp)
          <input style={inputStyle} inputMode="numeric" value={batas} onChange={(e) => setBatas(e.target.value)} placeholder="0" />
        </label>
        <button
          onClick={simpan}
          style={{ marginTop: 16, width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: colors.accent, color: colors.bg, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          Tambah Pos
        </button>
      </Card>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Pos Anggaran</h2>
      {list.length === 0 && (
        <Card><p style={{ color: colors.inkMuted, margin: 0 }}>Belum ada pos anggaran.</p></Card>
      )}
      {list.map((item) => {
        const pct = item.batas > 0 ? Math.min(item.terpakai / item.batas, 1) : 0;
        const over = item.terpakai > item.batas;
        return (
          <Card key={item.id} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => hapus(item.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{item.nama}</span>
              <span style={{ color: over ? colors.expense : colors.inkMuted }}>
                {formatRupiah(item.terpakai)} / {formatRupiah(item.batas)}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: colors.surfaceAlt, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${pct * 100}%`, height: 6, borderRadius: 3, background: over ? colors.expense : colors.accent }} />
            </div>
            {over && <div style={{ fontSize: 12, color: colors.expense, marginTop: 4 }}>Melebihi batas anggaran</div>}
          </Card>
        );
      })}
      {list.length > 0 && (
        <p style={{ color: colors.inkFaint, fontSize: 12, textAlign: 'center', marginTop: 8 }}>Klik pos untuk hapus</p>
      )}
    </div>
  );
}
