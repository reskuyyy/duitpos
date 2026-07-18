import { useEffect, useState } from 'react';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import SplitBar from '../components/SplitBar';
import { getTransaksi, getAnggaran } from '../storage';
import { colors, formatRupiah } from '../theme';

export default function Ringkasan() {
  const [transaksi, setTransaksi] = useState([]);
  const [anggaran, setAnggaran] = useState([]);

  useEffect(() => {
    setTransaksi(getTransaksi());
    setAnggaran(getAnggaran());
  }, []);

  const masuk = transaksi.filter((t) => t.tipe === 'masuk').reduce((a, t) => a + t.jumlah, 0);
  const keluar = transaksi.filter((t) => t.tipe === 'keluar').reduce((a, t) => a + t.jumlah, 0);
  const saldo = masuk - keluar;

  const totalHari7 = (() => {
    const now = Date.now();
    const seminggu = 7 * 24 * 60 * 60 * 1000;
    return transaksi
      .filter((t) => now - new Date(t.tanggal).getTime() <= seminggu && t.tipe === 'keluar')
      .reduce((a, t) => a + t.jumlah, 0);
  })();

  const dataMingguan = (() => {
    const hariLabel = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const hasil = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const besok = new Date(d);
      besok.setDate(d.getDate() + 1);
      const total = transaksi
        .filter((t) => {
          const w = new Date(t.tanggal).getTime();
          return t.tipe === 'keluar' && w >= d.getTime() && w < besok.getTime();
        })
        .reduce((a, t) => a + t.jumlah, 0);
      hasil.push({ label: hariLabel[d.getDay()], value: total });
    }
    return hasil;
  })();

  return (
    <div style={{ padding: 16, paddingBottom: 32 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Ringkasan Keuangan</h1>
      <p style={{ color: colors.inkMuted, marginTop: 4, marginBottom: 24 }}>Total saldo kamu saat ini</p>

      <Card style={{ paddingTop: 24, paddingBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: colors.inkFaint }}>SALDO</span>
        <div style={{ fontSize: 34, fontWeight: 800, color: saldo < 0 ? colors.expense : colors.ink, marginTop: 4, letterSpacing: -0.5 }}>
          {formatRupiah(saldo)}
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: colors.income }}>PEMASUKAN</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.income, marginTop: 2 }}>{formatRupiah(masuk)}</div>
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: colors.expense }}>PENGELUARAN</span>
            <div style={{ fontSize: 18, fontWeight: 700, color: colors.expense, marginTop: 2 }}>{formatRupiah(keluar)}</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <SplitBar masuk={masuk} keluar={keluar} />
        </div>
      </Card>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Anggaran Aktif</h2>
      {anggaran.length === 0 ? (
        <Card><p style={{ color: colors.inkMuted, margin: 0 }}>Belum ada pos anggaran. Buat di tab Anggaran.</p></Card>
      ) : (
        anggaran.slice(0, 3).map((pos) => {
          const pct = pos.batas > 0 ? Math.min(pos.terpakai / pos.batas, 1) : 0;
          return (
            <Card key={pos.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{pos.nama}</span>
                <span style={{ color: colors.inkMuted }}>{formatRupiah(pos.terpakai)} / {formatRupiah(pos.batas)}</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: colors.surfaceAlt, marginTop: 8, overflow: 'hidden' }}>
                <div style={{ width: `${pct * 100}%`, height: 6, borderRadius: 3, background: pct >= 1 ? colors.expense : colors.accent }} />
              </div>
            </Card>
          );
        })
      )}

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Pengeluaran 7 Hari Terakhir</h2>
      <Card>
        <div style={{ fontSize: 20, fontWeight: 700, color: colors.expense, marginBottom: 4 }}>{formatRupiah(totalHari7)}</div>
        <BarChart data={dataMingguan} />
      </Card>
    </div>
  );
}
