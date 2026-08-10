const symbols = [
  // Simple geometric marks, the way a real drawing legend keys materials.
  <rect key="s0" x="5" y="5" width="14" height="14" />,
  <circle key="s1" cx="12" cy="12" r="7.5" />,
  <path key="s2" d="M12 4.5 19.5 19.5 4.5 19.5 Z" />,
  <path key="s3" d="M5 19 19 5 M5 12 12 5 M12 19 19 12" />,
  <path key="s4" d="M12 4.5 V19.5 M4.5 12 H19.5" />,
  <path key="s5" d="M12 4.5 19.5 12 12 19.5 4.5 12 Z" />,
];

type Item = { term: string; detail: string };

export default function Legend({ items }: { items: Item[] }) {
  return (
    <ul className="grid grid-cols-1 border-t border-line lg:grid-cols-2 lg:gap-x-12">
      {items.map((item, i) => (
        <li
          key={item.term}
          className="flex items-center gap-4 border-b border-line py-4"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 fill-none stroke-cyan"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            {symbols[i % symbols.length]}
          </svg>
          <span className="flex-1 text-sm text-ink sm:text-base">
            {item.term}
          </span>
          <span className="font-mono text-[11px] tracking-wide text-dim">
            {item.detail}
          </span>
        </li>
      ))}
    </ul>
  );
}
