import type { Block } from "@/content/posts";

/** Renders typed content blocks (used by blog posts and legal pages). */
export function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose-iss">
      {blocks.map((b, i) => {
        if (b.type === "ul") return <ul key={i}>{b.items.map((it, k) => <li key={k}>{it}</li>)}</ul>;
        if (b.type === "ol") return <ol key={i}>{b.items.map((it, k) => <li key={k}>{it}</li>)}</ol>;
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
