import { useEffect, useMemo, useState } from 'react';
import Card from '../components/Card';
import BarChart from '../components/BarChart';
import SplitBar from '../components/SplitBar';
import MonthNav from '../components/MonthNav';
import SwipeTabs from '../components/SwipeTabs';
import { getTransaksi, getAnggaran } from '../storage';
import { colors, formatRupiah } from '../theme';

const TABS = [
  { key: 'anggaran', label: 'Anggaran' },
  { key: 'masuk', label: 'Pemasukan' },
  { key: 'keluar', label: 'Pengeluaran' },
];

export default function Ringkasan() {
  const [transaksi, setTransaksi] = useState([]);
  const [anggaran, setAnggaran] = useState([]);
  const [bulan, setBulan] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [tab, setTab] = useState('anggaran');

  useEffect(() => {
    setTransaksi(getTransaksi());
    setAnggaran(getAnggaran());
  }, []);

  const masuk = transaksi.filter((t) => t.tipe === 'masuk').reduce((a, t) => a + t.jumlah, 0);
  const keluar = transaksi.filter((t) => t.tipe === 'keluar').reduce((a, t) => a + t.jumlah, 0);
  const saldo = masuk - keluar;

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

  // --- Data khusus bulan yang lagi dipilih ---
  const txBulanIni = useMemo(() => {
    const awal = bulan.getTime();
    const akhir = new Date(bulan);
    akhir.setMonth(akhir.getMonth() + 1);
    return transaksi.filter((t) => {
      const w = new Date(t.tanggal).getTime();
      return w >= awal && w < akhir.getTime();
    });
  }, [transaksi, bulan]);

  const masukBulanIni = txBulanIni.filter((t) => t.tipe === 'masuk');
  const keluarBulanIni = txBulanIni.filter((t) => t.tipe === 'keluar');
  const totalMasukBulanIni = masukBulanIni.reduce((a, t) => a + t.jumlah, 0);
  const totalKeluarBulanIni = keluarBulanIni.reduce((a, t) => a + t.jumlah, 0);

  const breakdownKategori = (list) => {
    const map = {};
    list.forEach((t) => {
      map[t.kategori] = (map[t.kategori] || 0) + t.jumlah;
    });
    return Object.entries(map)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah);
  };

  const breakdownMasuk = breakdownKategori(masukBulanIni);
  const breakdownKeluar = breakdownKategori(keluarBulanIni);

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

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Pengeluaran 7 Hari Terakhir</h2>
      <Card>
        <BarChart data={dataMingguan} />
      </Card>

      <h2 style={{ fontSize: 18, fontWeight: 700, marginTop: 24, marginBottom: 8 }}>Ringkasan Bulanan</h2>
      <Card>
        <MonthNav bulan={bulan} onChange={setBulan} />
        <SwipeTabs tabs={TABS} active={tab} onChange={setTab}>
          {tab === 'anggaran' && (
            <div>
              {anggaran.length === 0 ? (
                <p style={{ color: colors.inkMuted, margin: 0, fontSize: 14 }}>Belum ada pos anggaran. Buat di tab Anggaran.</p>
              ) : (
                anggaran.map((pos) => {
                  const terpakaiBulanIni = keluarBulanIni
                    .filter((t) => t.kategori.toLowerCase() === pos.nama.toLowerCase())
                    .reduce((a, t) => a + t.jumlah, 0);
                  const pct = pos.batas > 0 ? Math.min(terpakaiBulanIni / pos.batas, 1) : 0;
                  const over = terpakaiBulanIni > pos.batas;
                  return (
                    <div key={pos.id} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                        <span>{pos.nama}</span>
                        <span style={{ color: over ? colors.expense : colors.inkMuted }}>
                          {formatRupiah(terpakaiBulanIni)} / {formatRupiah(pos.batas)}
                        </span>
                      </div>
                      <div style={{ height: 6, borderRadius: 3, background: colors.surfaceAlt, marginTop: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${pct * 100}%`, height: 6, borderRadius: 3, background: over ? colors.expense : colors.accent }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {tab === 'masuk' && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.income, marginBottom: 12 }}>
                {formatRupiah(totalMasukBulanIni)}
              </div>
              {breakdownMasuk.length === 0 ? (
                <p style={{ color: colors.inkMuted, margin: 0, fontSize: 14 }}>Belum ada pemasukan bulan ini.</p>
              ) : (
                breakdownMasuk.map((b) => (
                  <div key={b.kategori} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>
                    <span>{b.kategori}</span>
                    <span style={{ color: colors.income, fontWeight: 600 }}>{formatRupiah(b.jumlah)}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'keluar' && (
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.expense, marginBottom: 12 }}>
                {formatRupiah(totalKeluarBulanIni)}
              </div>
              {breakdownKeluar.length === 0 ? (
                <p style={{ color: colors.inkMuted, margin: 0, fontSize: 14 }}>Belum ada pengeluaran bulan ini.</p>
              ) : (
                breakdownKeluar.map((b) => (
                  <div key={b.kategori} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${colors.border}`, fontSize: 14 }}>
                    <span>{b.kategori}</span>
                    <span style={{ color: colors.expense, fontWeight: 600 }}>{formatRupiah(b.jumlah)}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </SwipeTabs>
      </Card>
    </div>
  );
}
