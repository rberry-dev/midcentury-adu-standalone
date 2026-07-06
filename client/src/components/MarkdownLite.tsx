import { Fragment, type ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const pattern =
    /\*\*(.+?)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > i) nodes.push(text.slice(i, match.index));
    if (match[1] !== undefined) {
      nodes.push(<strong key={key++}>{match[1]}</strong>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={key++}>{match[2]}</em>);
    } else if (match[3] !== undefined && match[4] !== undefined) {
      const href = match[4];
      const safe = /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(href);
      if (safe) {
        const external = /^https?:\/\//i.test(href);
        nodes.push(
          <a
            key={key++}
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-[var(--hemma-blue)] underline underline-offset-2 hover:text-[var(--hemma-black)]"
          >
            {match[3]}
          </a>,
        );
      } else {
        nodes.push(match[3]);
      }
    } else if (match[5] !== undefined) {
      nodes.push(
        <code
          key={key++}
          className="font-mono text-[0.92em] bg-[var(--hemma-light)] px-1.5 py-0.5 rounded"
        >
          {match[5]}
        </code>,
      );
    }
    i = match.index + match[0].length;
  }
  if (i < text.length) nodes.push(text.slice(i));
  return nodes;
}

export function MarkdownLite({ source }: { source: string }) {
  const blocks = source.replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className="space-y-5 text-[17px] leading-[1.75] font-light text-[var(--hemma-black)]">
      {blocks.map((raw, idx) => {
        const block = raw.trim();
        if (!block) return null;
        if (block.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-serif text-[22px] font-light text-[var(--hemma-black)] mt-8 mb-2"
            >
              {renderInline(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-serif text-[28px] font-light text-[var(--hemma-black)] mt-10 mb-3"
            >
              {renderInline(block.slice(3))}
            </h2>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-[var(--hemma-blue)] pl-5 italic text-[var(--hemma-mid)] my-6"
            >
              {renderInline(block.slice(2))}
            </blockquote>
          );
        }
        if (/^[-*]\s/.test(block)) {
          const items = block
            .split("\n")
            .map((l) => l.replace(/^[-*]\s+/, "").trim())
            .filter(Boolean);
          return (
            <ul key={idx} className="list-disc pl-6 space-y-1.5">
              {items.map((it, j) => (
                <li key={j}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        }
        const lines = block.split("\n");
        return (
          <p key={idx}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {renderInline(line)}
                {j < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
