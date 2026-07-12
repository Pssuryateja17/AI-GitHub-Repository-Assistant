import { Fragment, ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

type InlineToken =
  | { type: 'text'; value: string }
  | { type: 'bold'; value: string }
  | { type: 'italic'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; label: string; href: string };

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const pattern = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      tokens.push({ type: 'bold', value: match[2] });
    } else if (match[3]) {
      tokens.push({ type: 'italic', value: match[4] });
    } else if (match[5]) {
      tokens.push({ type: 'code', value: match[6] });
    } else if (match[7]) {
      tokens.push({ type: 'link', label: match[8], href: match[9] });
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return tokens;
}

function renderInline(text: string): ReactNode[] {
  return tokenizeInline(text).map((token, index) => {
    const key = `${token.type}-${index}`;

    switch (token.type) {
      case 'bold':
        return (
          <strong key={key} className="font-semibold text-slate-900 dark:text-slate-100">
            {token.value}
          </strong>
        );
      case 'italic':
        return (
          <em key={key} className="italic">
            {token.value}
          </em>
        );
      case 'code':
        return (
          <code
            key={key}
            className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-brand-700 dark:bg-slate-800 dark:text-brand-300"
          >
            {token.value}
          </code>
        );
      case 'link':
        return (
          <a
            key={key}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 underline underline-offset-2 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
          >
            {token.label}
          </a>
        );
      case 'text':
      default:
        return <Fragment key={key}>{token.value}</Fragment>;
    }
  });
}

interface Block {
  type: 'heading' | 'paragraph' | 'code' | 'ul' | 'ol' | 'blockquote' | 'hr';
  level?: number;
  text?: string;
  items?: string[];
  language?: string;
  code?: string;
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];

  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().length === 0) {
      i += 1;
      continue;
    }

    const codeFenceMatch = /^```(\w*)\s*$/.exec(line.trim());
    if (codeFenceMatch) {
      const language = codeFenceMatch[1] || 'text';
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !/^```\s*$/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i += 1;
      }
      i += 1;
      blocks.push({ type: 'code', language, code: codeLines.join('\n') });
      continue;
    }

    const headingMatch = /^(#{1,6})\s+(.*)$/.exec(line);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2].trim() });
      i += 1;
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      blocks.push({ type: 'hr' });
      i += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''));
        i += 1;
      }
      blocks.push({ type: 'blockquote', text: quoteLines.join(' ') });
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, '').trim());
        i += 1;
      }
      blocks.push({ type: 'ul', items });
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim());
        i += 1;
      }
      blocks.push({ type: 'ol', items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !/^```/.test(lines[i].trim()) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i])
    ) {
      paragraphLines.push(lines[i]);
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ').trim() });
  }

  return blocks;
}

const HEADING_STYLES: Record<number, string> = {
  1: 'text-2xl font-bold mt-6 mb-3',
  2: 'text-xl font-bold mt-5 mb-2.5',
  3: 'text-lg font-semibold mt-4 mb-2',
  4: 'text-base font-semibold mt-3 mb-1.5',
  5: 'text-sm font-semibold mt-3 mb-1',
  6: 'text-sm font-semibold mt-2 mb-1',
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseBlocks(content);

  return (
    <div
      className={`max-w-none text-sm leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300 ${
        className ?? ''
      }`}
    >
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case 'heading': {
            const level = block.level ?? 1;
            const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag
                key={key}
                className={`${HEADING_STYLES[level]} text-slate-900 dark:text-slate-100`}
              >
                {renderInline(block.text ?? '')}
              </HeadingTag>
            );
          }
          case 'paragraph':
            return (
              <p key={key} className="mb-3">
                {renderInline(block.text ?? '')}
              </p>
            );
          case 'ul':
            return (
              <ul key={key} className="mb-3 list-disc space-y-1 pl-6">
                {(block.items ?? []).map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>{renderInline(item)}</li>
                ))}
              </ul>
            );
          case 'ol':
            return (
              <ol key={key} className="mb-3 list-decimal space-y-1 pl-6">
                {(block.items ?? []).map((item, itemIndex) => (
                  <li key={`${key}-item-${itemIndex}`}>{renderInline(item)}</li>
                ))}
              </ol>
            );
          case 'blockquote':
            return (
              <blockquote
                key={key}
                className="mb-3 border-l-4 border-brand-300 bg-slate-50 py-2 pl-4 italic text-slate-600 dark:border-brand-700 dark:bg-slate-800/60 dark:text-slate-400"
              >
                {renderInline(block.text ?? '')}
              </blockquote>
            );
          case 'code':
            return (
              <pre
                key={key}
                className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs leading-relaxed text-slate-100 shadow-sm dark:bg-black/60"
              >
                <code className={`font-mono language-${block.language ?? 'text'}`}>
                  {block.code}
                </code>
              </pre>
            );
          case 'hr':
            return <hr key={key} className="my-5 border-slate-200 dark:border-slate-700" />;
          default:
            return null;
        }
      })}
    </div>
  );
}
