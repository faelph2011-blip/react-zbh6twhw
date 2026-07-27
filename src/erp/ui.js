// ============================================================
// UI KIT — componentes reutilizáveis do Design System
// ============================================================
import { useEffect } from "react";

export const Card = ({ children, className = "", style }) => (
  <div className={"card " + className} style={style}>{children}</div>
);

export const KPI = ({ ic, label, value, unit, tag, tagCls = "t-org" }) => (
  <div className="card">
    <div className="kpi-ic">{ic}</div>
    <div className="k">{label}</div>
    <div className="v">
      {value} {unit && <small>{unit}</small>}
    </div>
    {tag && <div style={{ marginTop: 8 }}><span className={"tag " + tagCls}>{tag}</span></div>}
  </div>
);

export const Tag = ({ children, cls = "t-mut" }) => (
  <span className={"tag " + cls}>{children}</span>
);

export const Btn = ({ children, variant = "", onClick, disabled, className = "" }) => (
  <button
    className={`btn ${variant} ${className}`.trim()}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export const Bar = ({ value, max = 100 }) => (
  <div className="bar">
    <i style={{ width: Math.min(100, (value / max) * 100) + "%" }} />
  </div>
);

export const Empty = ({ children }) => <div className="empty">{children}</div>;

export const Section = ({ title, right, children, className = "" }) => (
  <div className={"card " + className}>
    <div className="hdr" style={{ marginBottom: 12 }}>
      <h2 style={{ margin: 0 }}>{title}</h2>
      {right}
    </div>
    {children}
  </div>
);

export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="hdr" style={{ marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          <button className="iconbtn" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// mini gráfico de barras (SVG, sem dependências)
export function Sparkbars({ data, color = "var(--brand)", height = 90 }) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox={`0 0 ${data.length * 22} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      {data.map((v, i) => {
        const h = (v / max) * (height - 10);
        return (
          <rect key={i} x={i * 22 + 4} y={height - h} width={14} height={h} rx={4} fill={color} opacity={0.55 + (v / max) * 0.45} />
        );
      })}
    </svg>
  );
}

// gráfico de rosca simples (donut) para composição
export function Donut({ segments, size = 120 }) {
  const total = segments.reduce((t, s) => t + s.v, 0) || 1;
  let acc = 0;
  const r = 45, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--elev)" strokeWidth="14" />
      {segments.map((s, i) => {
        const frac = s.v / total;
        const dash = frac * c;
        const el = (
          <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={s.color} strokeWidth="14"
            strokeDasharray={`${dash} ${c - dash}`} strokeDashoffset={-acc * c}
            transform="rotate(-90 60 60)" strokeLinecap="round" />
        );
        acc += frac;
        return el;
      })}
    </svg>
  );
}
