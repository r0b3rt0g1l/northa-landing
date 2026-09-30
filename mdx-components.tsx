import type { MDXComponents } from "mdx/types";

/**
 * Componentes globales de MDX (obligatorio para @next/mdx en el App Router).
 * El estilo tipográfico vive en `.prose-northa` (app/globals.css).
 */
const components: MDXComponents = {
  a: ({ href = "", children, ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>
        {children}
      </a>
    );
  },
};

export function useMDXComponents(): MDXComponents {
  return components;
}
