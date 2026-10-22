/** The prism-cube emblem (logos/emblem-prism-cube.svg) as a component. */
export function PrismCube({ id, className }: { id: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CF0FF" />
          <stop offset="1" stopColor="#00D9FF" />
        </linearGradient>
        <linearGradient id={`${id}-lf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8A82FF" />
          <stop offset="1" stopColor="#5146E0" />
        </linearGradient>
        <linearGradient id={`${id}-rt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E9BFF" />
          <stop offset="1" stopColor="#2A5BE0" />
        </linearGradient>
      </defs>
      <path d="M100 18 172 59 100 100 28 59Z" fill={`url(#${id}-top)`} />
      <path d="M28 59 100 100V182L28 141Z" fill={`url(#${id}-lf)`} />
      <path d="M172 59V141L100 182V100Z" fill={`url(#${id}-rt)`} />
      <path d="M141.8 59.8 100 36 79.8 47.5 120.2 70.5 100 82 58.2 58.2" fill="none" stroke="#080B12" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M64 100V143.5" fill="none" stroke="#F8FAFC" strokeWidth="10" strokeLinecap="round" />
      <path d="M172 59V141L100 182V100Z" fill="#000" fillOpacity=".12" />
      <path d="M100 18 172 59V141L100 182 28 141V59Z M28 59 100 100 172 59 M100 100V182" fill="none" stroke="#fff" strokeOpacity=".3" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <b style={{ fontWeight: "inherit" }}>
      ISSolution<span>Agency</span>
    </b>
  );
}
