"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownAnswerProps = {
  content: string;
};

function cleanMarkdown(value: string): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/\\\*\*/g, "**")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/&#x20;|&#32;|&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\\<br\s*\/?>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/^\s*Sources\s*\(\d+\)\s*$/gim, "### Sources")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function MarkdownAnswer({
  content,
}: MarkdownAnswerProps) {
  const markdown = cleanMarkdown(content || "");

  if (!markdown) {
    return (
      <p className="markdown-answer-empty">
        No answer was returned. Please try asking again.
      </p>
    );
  }

  return (
    <article className="markdown-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
