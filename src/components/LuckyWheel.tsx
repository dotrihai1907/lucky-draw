interface LuckyWheelProps {
  names: string[];
  rotation: number;
  highlightedIndex?: number | null;
}

const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const RADIUS = 480;

export default function LuckyWheel({
  names,
  rotation,
  highlightedIndex,
}: LuckyWheelProps) {
  const sliceAngle = 360 / names.length;

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
          transition: "transform 7s cubic-bezier(0.17,0.67,0.12,0.99)",
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

          const isWinner = index === highlightedIndex;

          return (
            <g key={`${name}-${index}`}>
              {/* Slice */}
              <path
                d={`
                  M ${CENTER} ${CENTER}
                  L ${x1} ${y1}
                  A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}
                  Z
                `}
                fill={`hsl(${index * (360 / names.length)}, 80%, 55%)`}
                style={{
                  filter: isWinner
                    ? "drop-shadow(0 0 18px rgba(255,255,255,0.9))"
                    : "none",
                  transform: isWinner ? "scale(1.02)" : "scale(1)",
                  transformOrigin: "50% 50%",
                  transition: "all 0.4s ease",
                }}
              />

              {/* Label */}
              <text
                x={tx}
                y={ty}
                fill="#fff"
                fontSize="32"
                fontWeight={isWinner ? "800" : "600"}
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textAngle} ${tx} ${ty})`}
                style={{
                  filter: isWinner
                    ? "drop-shadow(0 0 6px rgba(255,255,255,1))"
                    : "none",
                }}
              >
                {name}
              </text>
            </g>
          );
        })}
      </g>

      {/* ===== POINTER ===== */}
      <polygon
        points={`${CENTER - 20},20 ${CENTER + 20},20 ${CENTER},60`}
        fill="#ffffff"
      />
      <polygon
        points={`${CENTER - 14},26 ${CENTER + 14},26 ${CENTER},56`}
        fill="#ff3b3b"
        style={{
          filter: "drop-shadow(0 0 6px rgba(255,0,0,0.8))",
        }}
      />
    </svg>
  );
}
