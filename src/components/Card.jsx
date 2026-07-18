import { colors } from '../theme';

export default function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: 14,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
