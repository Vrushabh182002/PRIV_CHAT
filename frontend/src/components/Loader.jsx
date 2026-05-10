import { useEffect, useRef } from "react";

const Loader = ({ size = 120 }) => {
  const groupRef = useRef(null);
  const pathRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const SVG_NS = "http://www.w3.org/2000/svg";

    const config = {
      particleCount: 86,
      trailSpan: 0.28,
      durationMs: 7800,
      rotationDurationMs: 44000,
      pulseDurationMs: 6800,
      strokeWidth: 4.3,
      searchTurns: 4,
      searchBaseRadius: 8,
      searchRadiusAmp: 8.5,
      searchPulse: 2.4,
      searchScale: 1,
    };

    const group = groupRef.current;
    const path = pathRef.current;

    path.setAttribute("stroke-width", config.strokeWidth);

    // create particles
    particlesRef.current = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("fill", "currentColor");
      group.appendChild(circle);
      return circle;
    });

    function normalizeProgress(progress) {
      return ((progress % 1) + 1) % 1;
    }

    function getDetailScale(time) {
      const pulseProgress =
        (time % config.pulseDurationMs) / config.pulseDurationMs;
      const pulseAngle = pulseProgress * Math.PI * 2;
      return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
    }

    function buildPath(detailScale, steps = 480) {
      return Array.from({ length: steps + 1 }, (_, index) => {
        const t = index / steps;
        const base = t * Math.PI * 2;
        const angle = base * config.searchTurns;

        const radius =
          config.searchBaseRadius +
          (1 - Math.cos(base)) *
            (config.searchRadiusAmp + detailScale * config.searchPulse);

        const x = 50 + Math.cos(angle) * radius * config.searchScale;
        const y = 50 + Math.sin(angle) * radius * config.searchScale;

        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(" ");
    }

    function getParticle(index, progress, detailScale) {
      const t =
        normalizeProgress(
          progress - (index / config.particleCount) * config.trailSpan,
        ) *
        Math.PI *
        2;

      const angle = t * config.searchTurns;

      const radius =
        config.searchBaseRadius +
        (1 - Math.cos(t)) *
          (config.searchRadiusAmp + detailScale * config.searchPulse);

      const x = 50 + Math.cos(angle) * radius;
      const y = 50 + Math.sin(angle) * radius;

      const fade = Math.pow(1 - index / config.particleCount, 0.56);

      return {
        x,
        y,
        r: 0.9 + fade * 2.7,
        opacity: 0.04 + fade * 0.96,
      };
    }

    let animationFrame;
    const start = performance.now();

    function animate(now) {
      const time = now - start;
      const progress = (time % config.durationMs) / config.durationMs;
      const detailScale = getDetailScale(time);

      path.setAttribute("d", buildPath(detailScale));

      particlesRef.current.forEach((node, i) => {
        const p = getParticle(i, progress, detailScale);
        node.setAttribute("cx", p.x);
        node.setAttribute("cy", p.y);
        node.setAttribute("r", p.r);
        node.setAttribute("opacity", p.opacity);
      });

      animationFrame = requestAnimationFrame(animate);
    }

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        style={{ width: size, height: size }}
        className="text-[#c8a97e]"
      >
        <g ref={groupRef}>
          <path
            ref={pathRef}
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.1"
          />
        </g>
      </svg>
    </div>
  );
};

export default Loader;
