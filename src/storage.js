const KEYS = { TRANSAKSI: 'duitpos:transaksi', ANGGARAN: 'duitpos:anggaran' };

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getTransaksi() {
  return getJSON(KEYS.TRANSAKSI, []);
}

export function tambahTransaksi(tx) {
  const list = getTransaksi();
  const baru = { id: Date.now().toString(), tanggal: new Date().toISOString(), ...tx };
  const next = [baru, ...list];
  setJSON(KEYS.TRANSAKSI, next);
  return next;
}

export function hapusTransaksi(id) {
  const next = getTransaksi().filter((t) => t.id !== id);
  setJSON(KEYS.TRANSAKSI, next);
  return next;
}

export function getAnggaran() {
  return getJSON(KEYS.ANGGARAN, []);
}

export function tambahAnggaran(pos) {
  const list = getAnggaran();
  const baru = { id: Date.now().toString(), terpakai: 0, ...pos };
  const next = [...list, baru];
  setJSON(KEYS.ANGGARAN, next);
  return next;
}

export function hapusAnggaran(id) {
  const next = getAnggaran().filter((p) => p.id !== id);
  setJSON(KEYS.ANGGARAN, next);
  return next;
}

export function tambahPakaiAnggaran(namaKategori, jumlah) {
  const next = getAnggaran().map((p) =>
    p.nama.toLowerCase() === namaKategori.toLowerCase()
      ? { ...p, terpakai: (p.terpakai || 0) + jumlah }
      : p
  );
  setJSON(KEYS.ANGGARAN, next);
  return next;
}

export function resetSemuaData() {
  localStorage.removeItem(KEYS.TRANSAKSI);
  localStorage.removeItem(KEYS.ANGGARAN);
}

export function exportSemuaData() {
  return {
    app: 'DuitPos',
    exportedAt: new Date().toISOString(),
    transaksi: getTransaksi(),
    anggaran: getAnggaran(),
  };
}

export function importSemuaData(data) {
  if (!data || !Array.isArray(data.transaksi) || !Array.isArray(data.anggaran)) {
    throw new Error('Format file backup tidak valid');
  }
  setJSON(KEYS.TRANSAKSI, data.transaksi);
  setJSON(KEYS.ANGGARAN, data.anggaran);
}
