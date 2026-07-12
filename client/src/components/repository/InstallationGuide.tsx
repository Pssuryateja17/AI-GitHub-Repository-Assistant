import { useState } from 'react';

interface InstallationGuideProps {
  installation: string;
}

interface InstallationBlock {
  type: 'text' | 'command';
  content: string;
}

const COMMAND_PREFIX_PATTERN =
  /^(\$\s*)?(npm|npx|yarn|pnpm|git|cd|pip|pip3|python|python3|docker|docker-compose|make|cargo|go|composer|bundle|gem|brew|apt|apt-get|curl|wget|export|source|sudo)\b/i;

function stripFence(line: string): string {
  return line.replace(/^```[\w-]*\s*$/g, '').trim();
}

function parseInstallation(raw: string): InstallationBlock[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: InstallationBlock[] = [];

  let inFence = false;
  let buffer: string[] = [];
  let bufferType: 'text' | 'command' | null = null;

  function flush(): void {
    if (buffer.length === 0) return;
    const content = buffer.join('\n').trim();
    if (content.length > 0) {
      blocks.push({ type: bufferType ?? 'text', content });
    }
    buffer = [];
    bufferType = null;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (/^```/.test(trimmed)) {
      if (inFence) {
        flush();
        inFence = false;
      } else {
        flush();
        inFence = true;
        bufferType = 'command';
      }
      continue;
    }

    if (inFence) {
      buffer.push(stripFence(line));
      continue;
    }

    const isCommandLine =
      /^\$\s*/.test(trimmed) || (COMMAND_PREFIX_PATTERN.test(trimmed) && trimmed.length < 200);

    const lineType: 'text' | 'command' = isCommandLine ? 'command' : 'text';

    if (trimmed.length === 0) {
      flush();
      continue;
    }

    if (bufferType && bufferType !== lineType) {
      flush();
    }

    bufferType = lineType;
    buffer.push(trimmed.replace(/^\$\s*/, ''));
  }

  flush();

  return blocks;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleCopy()}
      aria-label="Copy command"
      className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-200 opacity-0 transition-all duration-150 hover:bg-slate-700 group-hover:opacity-100 dark:bg-slate-700 dark:hover:bg-slate-600"
    >
      {copied ? (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-3.5 w-3.5 text-green-400"
          >
            <path
              fillRule="evenodd"
              d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0Z"
              clipRule="evenodd"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className="h-3.5 w-3.5"
          >
            <path d="M7 3.5A1.5 1.5 0 018.5 2h4A1.5 1.5 0 0114 3.5v1h.5A1.5 1.5 0 0116 6v9a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 016 15V6a1.5 1.5 0 011.5-1.5H7v-1Zm1.5-.5a.5.5 0 00-.5.5v1h4v-1a.5.5 0 00-.5-.5h-3Z" />
            <path d="M4 6.5A1.5 1.5 0 015.5 5H6v10a2 2 0 002 2h5v.5A1.5 1.5 0 0111.5 19h-6A1.5 1.5 0 014 17.5v-11Z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export function InstallationGuide({ installation }: InstallationGuideProps) {
  const blocks = parseInstallation(installation);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5 text-brand-500"
        >
          <path
            fillRule="evenodd"
            d="M2 4.75A2.75 2.75 0 014.75 2h10.5A2.75 2.75 0 0118 4.75v10.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25V4.75Zm5.03 3.47a.75.75 0 010 1.06L5.81 10.5l1.22 1.22a.75.75 0 11-1.06 1.06l-1.75-1.75a.75.75 0 010-1.06l1.75-1.75a.75.75 0 011.06 0Zm3.5 1.06a.75.75 0 111.06-1.06l1.75 1.75a.75.75 0 010 1.06l-1.75 1.75a.75.75 0 11-1.06-1.06l1.22-1.22-1.22-1.22Z"
            clipRule="evenodd"
          />
        </svg>
        Installation
      </h2>

      <div className="flex flex-col gap-3">
        {blocks.map((block, index) =>
          block.type === 'command' ? (
            <div key={index} className="group relative">
              <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 pr-16 text-xs leading-relaxed text-slate-100 shadow-sm dark:bg-black/60">
                <code className="font-mono">{block.content}</code>
              </pre>
              <CopyButton text={block.content} />
            </div>
          ) : (
            <p
              key={index}
              className="whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            >
              {block.content}
            </p>
          ),
        )}
      </div>
    </div>
  );
}
