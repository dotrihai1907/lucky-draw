/* eslint-disable react-hooks/purity */
interface GalaxySparklesProps {
  count?: number;
  color?: string;
  maxSize?: number;
}

export default function GalaxySparkles({
  count = 70,
  color = "white",
  maxSize = 4,
}: GalaxySparklesProps) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {[...Array(count)].map((_, i) => {
        const sizePx = 1 + Math.random() * maxSize;
        const sizeRem = sizePx * 0.0625; // convert px → rem
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 4;
        const duration = 2.8 + Math.random() * 3;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: `${top}%`,
              width: `${sizeRem}rem`,
              height: `${sizeRem}rem`,
              borderRadius: "50%",
              background: color,
              opacity: 0.15,
              filter: `blur(${(sizePx / 1.3) * 0.0625}rem)`,
              animation: `sparkleFade ${duration}s ${delay}s infinite ease-in-out`,
            }}
          />
        );
      })}
    </div>
  );
}
