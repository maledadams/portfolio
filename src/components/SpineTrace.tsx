"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

type Node = { y: number };

const X_RAIL = 28;
const JOG = 22;

/**
 * One continuous trace down the page's left margin. It jogs out at every
 * element marked [data-spine] and draws itself as the visitor scrolls,
 * driven by scroll progress (no raw scroll listeners).
 */
export default function SpineTrace() {
  const [height, setHeight] = useState(0);
  const [nodes, setNodes] = useState<Node[]>([]);
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  useEffect(() => {
    const measure = () => {
      const doc = document.documentElement;
      setHeight(doc.scrollHeight);
      const found = Array.from(
        document.querySelectorAll<HTMLElement>("[data-spine]"),
      ).map((el) => {
        const rect = el.getBoundingClientRect();
        return { y: rect.top + window.scrollY + rect.height / 2 };
      });
      found.sort((a, b) => a.y - b.y);
      setNodes(found);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [pathname]);

  if (height === 0) return null;

  let d = `M ${X_RAIL} 0`;
  for (const node of nodes) {
    d += ` L ${X_RAIL} ${node.y - JOG}`;
    d += ` L ${X_RAIL + JOG} ${node.y}`;
    d += ` L ${X_RAIL} ${node.y + JOG}`;
  }
  d += ` L ${X_RAIL} ${height}`;

  return (
    <svg
      className="pointer-events-none absolute left-0 top-0 -z-[5] hidden md:block"
      width="80"
      height={height}
      viewBox={`0 0 80 ${height}`}
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d={d}
        stroke="var(--color-cyan)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        style={reduce ? undefined : { pathLength: progress }}
        pathLength={reduce ? undefined : 1}
      />
      {nodes.map((node, i) => (
        <rect
          key={i}
          x={X_RAIL + JOG - 3.5}
          y={node.y - 3.5}
          width="7"
          height="7"
          transform={`rotate(45 ${X_RAIL + JOG} ${node.y})`}
          stroke="var(--color-cyan)"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
