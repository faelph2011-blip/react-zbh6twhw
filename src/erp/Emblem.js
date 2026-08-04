import { useId, useState } from "react";
import { logo as logoReal } from "./assets";

// Selo vetorial da Pudins da Lauren — recriação do logo original.
// Cores fixas (estilo adesivo impresso) para ficar igual em tema claro/escuro.
export function Emblem({ size = 44 }) {
  const uid = useId().replace(/:/g, "");
  const top = "top" + uid, bot = "bot" + uid, gb = "gb" + uid, gc = "gc" + uid;
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={gb} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6D69A" /><stop offset="1" stopColor="#E0A45C" />
        </linearGradient>
        <linearGradient id={gc} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C77B3B" /><stop offset="1" stopColor="#A85616" />
        </linearGradient>
        <path id={top} d="M 32,120 A 88,88 0 0 1 208,120" fill="none" />
        <path id={bot} d="M 34,120 A 86,86 0 0 0 206,120" fill="none" />
      </defs>

      <circle cx="120" cy="120" r="117" fill="#FFFCF6" stroke="#7A3F16" strokeWidth="2.4" />
      <circle cx="120" cy="120" r="106" fill="none" stroke="#7A3F16" strokeWidth="1.3" />

      <text fontFamily="Arial, sans-serif" fontSize="9.6" fontWeight="700" letterSpacing="1.1" fill="#7A3F16">
        <textPath href={"#" + top} startOffset="50%" textAnchor="middle">FEITO COM AMOR EM CADA DETALHE</textPath>
      </text>
      <text fontFamily="Arial, sans-serif" fontSize="9.1" fontWeight="700" letterSpacing="0.7" fill="#7A3F16">
        <textPath href={"#" + bot} startOffset="50%" textAnchor="middle">CREMOSO • DELICIOSO • INESQUECÍVEL</textPath>
      </text>

      <path d="M120,66 c-2.4,-3.2 -7,-1.6 -7,2.4 c0,3.2 4,5.6 7,8 c3,-2.4 7,-4.8 7,-8 c0,-4 -4.6,-5.6 -7,-2.4 z" fill="#7A3F16" />

      <ellipse cx="120" cy="120" rx="52" ry="15" fill="#FFFDF9" stroke="#B4682C" strokeWidth="1.1" />
      <ellipse cx="120" cy="119" rx="40" ry="9.5" fill="none" stroke="#E0C69A" strokeWidth="1" />

      <path d="M86,98 C86,113 98,120 120,120 C142,120 154,113 154,98 Z" fill={"url(#" + gb + ")"} />
      <path d="M92,99 c-1,7 -2,10 0,12 c2,-2 2,-6 2,-12 z" fill={"url(#" + gc + ")"} />
      <path d="M120,101 c-2,8 -2,13 0,15 c2,-2 2,-8 1,-15 z" fill={"url(#" + gc + ")"} />
      <path d="M146,99 c1,7 2,10 0,12 c-2,-2 -2,-6 -2,-12 z" fill={"url(#" + gc + ")"} />
      <ellipse cx="120" cy="98" rx="34" ry="9.5" fill={"url(#" + gc + ")"} />
      <ellipse cx="120" cy="97" rx="10" ry="2.8" fill="#8A4A22" />

      <text x="120" y="148" textAnchor="middle" fontFamily="'Dancing Script', cursive" fontSize="27" fontWeight="700" fill="#7A3F16">Pudins da</text>
      <text x="121" y="172" textAnchor="middle" fontFamily="'Dancing Script', cursive" fontSize="31" fontWeight="700" fill="#7A3F16">Lauren</text>

      <path d="M100,183 h13 M127,183 h13" stroke="#7A3F16" strokeWidth="1.1" />
      <path d="M120,180 c-1.5,-2 -4.5,-1 -4.5,1.5 c0,2 2.5,3.5 4.5,5 c2,-1.5 4.5,-3 4.5,-5 c0,-2.5 -3,-3.5 -4.5,-1.5 z" fill="#C8701C" />
    </svg>
  );
}

// Usa o logo real da cliente (foto do rótulo); cai no selo vetorial se falhar.
export function Brand({ size = 44 }) {
  const [ok, setOk] = useState(true);
  if (!ok) return <Emblem size={size} />;
  return (
    <img src={logoReal} alt="Pudins da Lauren" onError={() => setOk(false)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }} />
  );
}
