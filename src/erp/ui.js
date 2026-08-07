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

// Ícone oficial do WhatsApp (SVG, herda a cor via currentColor)
export const Wa = ({ size = 18, style }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"
    style={{ display: "inline-block", verticalAlign: "-.18em", flexShrink: 0, ...style }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
