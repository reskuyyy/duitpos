import { colors } from '../theme';

const CHART_HEIGHT = 110;

export default function BarChart({ data, barColor = colors.expense }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: CHART_HEIGHT + 24, paddingTop: 8 }}>
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * CHART_HEIGHT, d.value > 0 ? 4 : 0);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ height: CHART_HEIGHT, width: 18, display: 'flex', alignItems: 'flex-end', background: colors.surfaceAlt, borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ width: '100%', height: h, background: barColor, borderRadius: 6 }} />
            </div>
            <span style={{ fontSize: 11, color: colors.inkFaint, marginTop: 4 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
