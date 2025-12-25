interface LuckyWheelProps {
  names: string[];
  rotation: number;
  disabledNames?: Set<string>;
  highlightName?: string | null;
}

const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const RADIUS = 480;

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

export default function LuckyWheel({
  names,
  rotation,
  disabledNames = new Set(),
  highlightName = null,
}: LuckyWheelProps) {
  const sliceAngle = 360 / names.length;

  const dynamicFontSize = Math.max(18, 48 - names.length * 0.4);

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* ===== ROTATING WHEEL ===== */}
      <g
        style={{
          transformOrigin: "50% 50%",
          transform: `rotate(${rotation - 90}deg)`,
          transition: "transform 8.5s cubic-bezier(0.17,0.67,0.12,0.99)",
        }}
      >
        {names.map((name, index) => {
          const startAngle = sliceAngle * index;
          const endAngle = startAngle + sliceAngle;

          const x1 = CENTER + RADIUS * Math.cos((Math.PI * startAngle) / 180);
          const y1 = CENTER + RADIUS * Math.sin((Math.PI * startAngle) / 180);
          const x2 = CENTER + RADIUS * Math.cos((Math.PI * endAngle) / 180);
          const y2 = CENTER + RADIUS * Math.sin((Math.PI * endAngle) / 180);

          const textAngle = startAngle + sliceAngle / 2;
          const textRadius = RADIUS * 0.65;
          const tx =
            CENTER + textRadius * Math.cos((Math.PI * textAngle) / 180);
          const ty =
            CENTER + textRadius * Math.sin((Math.PI * textAngle) / 180);

          const isDisabled = disabledNames.has(name);
          const isHighlight = highlightName === name;

          return (
            <g key={`${name}-${index}`}>
              {/* SLICE */}
              <path
                d={`
                  M ${CENTER} ${CENTER}
                  L ${x1} ${y1}
                  A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}
                  Z
                `}
                fill={`hsl(${index * (360 / names.length)}, 80%, 55%)`}
                style={{
                  opacity: isDisabled ? 0.25 : 1,
                  filter: isHighlight
                    ? "drop-shadow(0 0 1.25rem rgba(255,255,255,0.8))"
                    : "none",
                  transition: "opacity 0.4s ease",
                }}
              />

              {/* TEXT */}
              <text
                x={tx}
                y={ty}
                fill="#fff"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={dynamicFontSize}
                transform={`rotate(${textAngle} ${tx} ${ty})`}
                style={{
                  opacity: isDisabled ? 0.35 : 1,
                  filter: isHighlight
                    ? "drop-shadow(0 0 0.375rem white)"
                    : "none",
                }}
              >
                {truncateText(name, 10)}
              </text>
            </g>
          );
        })}
      </g>

      {/* ===== POINTER (GLASS STYLE) ===== */}
      <g>
        {/* Glow */}
        <polygon
          points={`${CENTER - 26},18 ${CENTER + 26},18 ${CENTER},72`}
          fill="rgba(255,255,255,0.25)"
          style={{ filter: "blur(0.375rem)" }}
        />

        {/* Main pointer */}
        <polygon
          points={`${CENTER - 18},20 ${CENTER + 18},20 ${CENTER},64`}
          fill="rgba(255,255,255,0.9)"
          style={{
            filter: "drop-shadow(0 0.375rem 0.875rem rgba(255,255,255,0.35))",
          }}
        />

        {/* Inner glass highlight */}
        <polygon
          points={`${CENTER - 10},24 ${CENTER + 10},24 ${CENTER},54`}
          fill="rgba(255,255,255,0.55)"
        />
      </g>
    </svg>
  );
}
