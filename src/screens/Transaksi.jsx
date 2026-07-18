import { useEffect, useState } from 'react';
import Card from '../components/Card';
import { getTransaksi, tambahTransaksi, hapusTransaksi, tambahPakaiAnggaran } from '../storage';
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

export default function Transaksi() {
  const [list, setList] = useState([]);
  const [tipe, setTipe] = useState('keluar');
  const [jumlah, setJumlah] = useState('');
  const [kategori, setKategori] = useState('');
  const [catatan, setCatatan] = useState('');

  useEffect(() => setList(getTransaksi()), []);

  const simpan = () => {
    const n = parseInt(jumlah.replace(/\D/g, ''), 10);
    if (!n || n <= 0) {
      alert('Masukkan nominal yang valid ya.');
      return;
    }
    tambahTransaksi({ tipe, jumlah: n, kategori: kategori || 'Umum', catatan });
    if (tipe === 'keluar' && kategori) tambahPakaiAnggaran(kategori, n);
    setJumlah('');
    setKategori('');
    setCatatan('');
    setList(getTransaksi());
  };

  const hapus = (id) => {
    if (confirm('Hapus transaksi ini?')) setList(hapusTransaksi(id));
  };

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Catat Transaksi</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 16 }}>Tambah pemasukan atau pengeluaran</p>

      <Card>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setTipe('masuk')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${tipe === 'masuk' ? colors.income : colors.border}`,
              background: tipe === 'masuk' ? colors.incomeDim : 'transparent',
              color: tipe === 'masuk' ? colors.income : colors.inkMuted,
              fontWeight: 600,
            }}
          >
            Pemasukan
          </button>
          <button
            onClick={() => setTipe('keluar')}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, cursor: 'pointer',
              border: `1px solid ${tipe === 'keluar' ? colors.expense : colors.border}`,
              background: tipe === 'keluar' ? colors.expenseDim : 'transparent',
              color: tipe === 'keluar' ? colors.expense : colors.inkMuted,
              fontWeight: 600,
            }}
          >
            Pengeluaran
          </button>
        </div>

        <label style={{ fontSize: 12, color: colors.inkFaint }}>
          Jumlah (Rp)
          <input style={inputStyle} inputMode="numeric" value={jumlah} onChange={(e) => setJumlah(e.target.value)} placeholder="0" />
        </label>

        <label style={{ fontSize: 12, color: colors.inkFaint, display: 'block', marginTop: 12 }}>
          Kategori
          <input style={inputStyle} value={kategori} onChange={(e) => setKategori(e.target.value)} placeholder="Makan, Transport, Gaji..." />
        </label>

        <label style={{ fontSize: 12, color: colors.inkFaint, display: 'block', marginTop: 12 }}>
          Catatan (opsional)
          <input style={inputStyle} value={catatan} onChange={(e) => setCatatan(e.target.value)} placeholder="Tambahkan catatan" />
        </label>

        <button
          onClick={simpan}
          style={{ marginTop: 16, width: '100%', padding: '12px 0', borderRadius: 8, border: 'none', background: colors.accent, color: colors.bg, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}
        >
          Simpan Transaksi
        </button>
      </Card>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Riwayat</h2>
      {list.length === 0 && (
        <Card><p style={{ color: colors.inkMuted, margin: 0 }}>Belum ada transaksi.</p></Card>
      )}
      {list.map((item) => (
        <Card key={item.id} style={{ marginBottom: 8, cursor: 'pointer' }} onClick={() => hapus(item.id)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div>{item.kategori}</div>
              {item.catatan && <div style={{ color: colors.inkMuted, fontSize: 14 }}>{item.catatan}</div>}
              <div style={{ fontSize: 12, color: colors.inkFaint, marginTop: 2 }}>
                {new Date(item.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: item.tipe === 'masuk' ? colors.income : colors.expense }}>
              {item.tipe === 'masuk' ? '+' : '-'}{formatRupiah(item.jumlah)}
            </div>
          </div>
        </Card>
      ))}
      <p style={{ color: colors.inkFaint, fontSize: 12, textAlign: 'center', marginTop: 8 }}>Klik transaksi untuk hapus</p>
    </div>
  );
}
