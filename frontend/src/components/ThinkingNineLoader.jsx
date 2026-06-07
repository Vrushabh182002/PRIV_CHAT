import { useEffect, useRef } from "react";

const ThinkingNineLoader = ({ size = 120, color = "#c8a97e" }) => {
  const groupRef = useRef(null);
  const pathRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const SVG_NS = "http://www.w3.org/2000/svg";

    const config = {
      rotate: true,
      particleCount: 68,
      trailSpan: 0.39,
      durationMs: 4700,
      rotationDurationMs: 30000,
      pulseDurationMs: 4200,
      strokeWidth: 5.5,

      baseRadius: 7,
      detailAmplitude: 3,
      petalCount: 9,
      curveScale: 3.9,
    };

    const group = groupRef.current;
    const path = pathRef.current;

    path.setAttribute("stroke-width", config.strokeWidth);

    particlesRef.current = Array.from({ length: config.particleCount }, () => {
      const circle = document.createElementNS(SVG_NS, "circle");

      circle.setAttribute("fill", "currentColor");

      group.appendChild(circle);

      return circle;
    });

    const normalizeProgress = (progress) => ((progress % 1) + 1) % 1;

    const getDetailScale = (time) => {
      const pulseProgress =
        (time % config.pulseDurationMs) / config.pulseDurationMs;

      const pulseAngle = pulseProgress * Math.PI * 2;

      return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
    };

    const getRotation = (time) => {
      if (!config.rotate) return 0;

      return (
        -((time % config.rotationDurationMs) / config.rotationDurationMs) * 360
      );
    };

    const getPoint = (progress, detailScale) => {
      const t = progress * Math.PI * 2;

      const petals = Math.round(config.petalCount);

      const x =
        config.baseRadius * Math.cos(t) -
        config.detailAmplitude * detailScale * Math.cos(petals * t);

      const y =
        config.baseRadius * Math.sin(t) -
        config.detailAmplitude * detailScale * Math.sin(petals * t);

      return {
        x: 50 + x * config.curveScale,
        y: 50 + y * config.curveScale,
      };
    };

    const buildPath = (detailScale, steps = 480) => {
      return Array.from({ length: steps + 1 }, (_, index) => {
        const point = getPoint(index / steps, detailScale);

        return `${index === 0 ? "M" : "L"} ${point.x.toFixed(
          2,
        )} ${point.y.toFixed(2)}`;
      }).join(" ");
    };

    const getParticle = (index, progress, detailScale) => {
      const tailOffset = index / (config.particleCount - 1);

      const point = getPoint(
        normalizeProgress(progress - tailOffset * config.trailSpan),
        detailScale,
      );

      const fade = Math.pow(1 - tailOffset, 0.56);

      return {
        x: point.x,
        y: point.y,
        radius: 0.9 + fade * 2.7,
        opacity: 0.04 + fade * 0.96,
      };
    };

    let animationFrame;
    const startedAt = performance.now();

    const render = (now) => {
      const time = now - startedAt;

      const progress = (time % config.durationMs) / config.durationMs;

      const detailScale = getDetailScale(time);

      group.setAttribute("transform", `rotate(${getRotation(time)} 50 50)`);

      path.setAttribute("d", buildPath(detailScale));

      particlesRef.current.forEach((node, index) => {
        const particle = getParticle(index, progress, detailScale);

        node.setAttribute("cx", particle.x.toFixed(2));

        node.setAttribute("cy", particle.y.toFixed(2));

        node.setAttribute("r", particle.radius.toFixed(2));

        node.setAttribute("opacity", particle.opacity.toFixed(3));
      });

      animationFrame = requestAnimationFrame(render);
    };

    animationFrame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrame);

      particlesRef.current.forEach((node) => node.remove());

      particlesRef.current = [];
    };
  }, []);

  return (
    <div className="flex items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        style={{
          width: size,
          height: size,
          color,
        }}
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

export default ThinkingNineLoader;