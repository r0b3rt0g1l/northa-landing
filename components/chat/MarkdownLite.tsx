import { Fragment } from "react";

/**
 * Markdown mínimo para las respuestas de Nort: párrafos, listas, **negritas**
 * y [ligas](url). Construye elementos de React (nunca HTML crudo), así que el
 * texto del modelo no puede inyectar marcado.
 */
function inline(text: string, keyBase: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <strong key={`${keyBase}-b${i++}`} className="font-semibold text-ink">
          {m[1]}
        </strong>,
      );
    } else if (m[2] && m[3]) {
      const url = m[3];
      const safe = /^(https?:\/\/|\/|mailto:|tel:)/.test(url);
      out.push(
        safe ? (
          <a
            key={`${keyBase}-a${i++}`}
            href={url}
            className="text-accent-ink underline underline-offset-2"
            {...(url.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {m[2]}
          </a>
        ) : (
          m[2]
        ),
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function MarkdownLite({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => /^\s*([-*•]|\d+\.)\s+/.test(l));
        if (isList) {
          const ordered = /^\s*\d+\./.test(lines[0]);
          const Tag = ordered ? "ol" : "ul";
          return (
            <Tag key={bi} className={ordered ? "ml-4 list-decimal space-y-1" : "ml-4 list-disc space-y-1 marker:text-accent"}>
              {lines.map((l, li) => (
                <li key={li}>{inline(l.replace(/^\s*([-*•]|\d+\.)\s+/, ""), `${bi}-${li}`)}</li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {inline(l, `${bi}-${li}`)}
                {li < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}
