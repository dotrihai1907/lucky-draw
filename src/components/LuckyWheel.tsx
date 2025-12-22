interface LuckyWheelProps {
  names: string[];
  rotation: number;
}

/**
 * SVG config
 */
const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const RADIUS = 480;

export default function LuckyWheel({ names, rotation }: LuckyWheelProps) {
  // Angle per slice
  const sliceAngle = 360 / names.length;

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      style={{ width: "100%", height: "100%" }}
    >
      {/* ================= WHEEL (ROTATES) ================= */}
      <g
        transform={`rotate(${rotation - 90} ${CENTER} ${CENTER})`}
        style={{
          transition: "transform 4.5s cubic-bezier(0.17,0.67,0.12,0.99)",
        }}
      >
        {names.map((name, index) => {
          // Slice angles
          const startAngle = sliceAngle * index;
          const endAngle = startAngle + sliceAngle;

          // Arc points
          const x1 = CENTER + RADIUS * Math.cos((Math.PI * startAngle) / 180);
          const y1 = CENTER + RADIUS * Math.sin((Math.PI * startAngle) / 180);

          const x2 = CENTER + RADIUS * Math.cos((Math.PI * endAngle) / 180);
          const y2 = CENTER + RADIUS * Math.sin((Math.PI * endAngle) / 180);

          // Text position (center of slice)
          const textAngle = startAngle + sliceAngle / 2;
          const textRadius = RADIUS * 0.65;

          const tx =
            CENTER + textRadius * Math.cos((Math.PI * textAngle) / 180);
          const ty =
            CENTER + textRadius * Math.sin((Math.PI * textAngle) / 180);

          return (
            <g key={name}>
              {/* Slice */}
              <path
                d={`
                  M ${CENTER} ${CENTER}
                  L ${x1} ${y1}
                  A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2}
                  Z
                `}
                fill={`hsl(${index * (360 / names.length)}, 80%, 55%)`}
              />

              {/* Label */}
              <text
                x={tx}
                y={ty}
                fill="#fff"
                fontSize="32"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textAngle} ${tx} ${ty})`}
              >
                {name}
              </text>
            </g>
          );
        })}
      </g>

      {/* ================= POINTER (FIXED, TOUCHING WHEEL) ================= */}
      {/* White border */}
      <polygon
        points={`${CENTER - 20},20 ${CENTER + 20},20 ${CENTER},60`}
        fill="#ffffff"
      />

      {/* Red arrow */}
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
