import type { Social } from "@/content/site";

const paths: Record<Social["label"], React.ReactNode> = {
  LinkedIn: <path d="M5 3a2 2 0 110 4 2 2 0 010-4zM3.5 9h3v12h-3zM9 9h3v1.7c.5-1 1.8-2 3.7-2 3.5 0 4.3 2.3 4.3 5.3V21h-3v-6c0-1.5-.3-3-2.2-3S12 13.4 12 15v6H9z" />,
  Instagram: <path fillRule="evenodd" d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3zm5 3.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zM17.5 5.5a1 1 0 110 2 1 1 0 010-2z" />,
  X: <path d="M3 3h5l4.5 6.2L17.5 3H21l-7 8.5L21.5 21h-5l-5-6.8L5.5 21H2l7.7-9.2z" />,
  GitHub: <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 015 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0012 2z" />,
  Dribbble: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.8 9.8c6 .4 11.6-1.2 15.6-5.2M6 19.5c3-5.6 8-8 15.4-6.6M8.8 2.8c3 3.6 6 10 7 18" />
    </>
  ),
};

/** Social icons. Placeholders (href null) render as labelled images, real ones as links. */
export function SocialIcons({ items, className }: { items: Social[]; className?: string }) {
  return (
    <>
      {items.map((s) => {
        const svg = (
          <svg viewBox="0 0 24 24" style={s.label === "Dribbble" ? { fill: "none", stroke: "currentColor", strokeWidth: 1.6 } : undefined} aria-hidden="true">
            {paths[s.label]}
          </svg>
        );
        return s.href ? (
          <a key={s.label} href={s.href} className={className} aria-label={s.label} target="_blank" rel="noopener noreferrer">
            {svg}
          </a>
        ) : (
          <span key={s.label} role="img" aria-label={`${s.label} (coming soon)`} className={className}>
            {svg}
          </span>
        );
      })}
    </>
  );
}
