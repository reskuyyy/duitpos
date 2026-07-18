export const colors = {
  bg: '#0F1319',
  surface: '#171D26',
  surfaceAlt: '#1E2530',
  border: '#2A3341',

  ink: '#EDEFF2',
  inkMuted: '#8B93A3',
  inkFaint: '#5B6473',

  income: '#4ADE9C',
  incomeDim: '#1E3A2E',
  expense: '#F2685C',
  expenseDim: '#3A2320',

  accent: '#E8B75E',
};

export function formatRupiah(n) {
  const num = Math.round(Number(n) || 0);
  const sign = num < 0 ? '-' : '';
  const abs = Math.abs(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp${abs}`;
}
