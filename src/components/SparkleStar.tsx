/**
 * An eight-spike sparkle, not the usual five-point star — reuses the
 * pack-reveal's legendary gold so it reads as this site's mark rather
 * than a generic bullet glyph.
 */
export default function SparkleStar({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden
      className={className}
      style={style}
    >
      <path d="M50 2 56.89 33.37 83.94 16.06 66.63 43.11 98 50 66.63 56.89 83.94 83.94 56.89 66.63 50 98 43.11 66.63 16.06 83.94 33.37 56.89 2 50 33.37 43.11 16.06 16.06 43.11 33.37Z" />
    </svg>
  );
}
