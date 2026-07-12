import { useMemo, useState } from 'react';

interface FolderStructureProps {
  folderStructure: string;
}

interface TreeNode {
  id: string;
  name: string;
  depth: number;
  children: TreeNode[];
}

const TREE_PREFIX_PATTERN = /^[\s│]*(?:├──|└──|\*|-)\s*/;
const INDENT_UNIT_SPACES = 2;

function getIndentDepth(line: string): number {
  const leading = /^[\s│]*/.exec(line)?.[0] ?? '';
  const treeGlyphs = (leading.match(/│/g) ?? []).length;
  const spaceCount = leading.replace(/│/g, ' ').length;
  return treeGlyphs > 0 ? treeGlyphs : Math.floor(spaceCount / INDENT_UNIT_SPACES);
}

function looksLikeTree(lines: string[]): boolean {
  const structuralLines = lines.filter(
    (line) => /^[\s│]*(?:├──|└──|\*|-)\s*/.test(line) && line.trim().length > 0,
  );
  return structuralLines.length >= 2;
}

function buildTree(rawText: string): TreeNode[] | null {
  const lines = rawText
    .split('\n')
    .map((line) => line.replace(/\r$/, ''))
    .filter((line) => line.trim().length > 0);

  if (!looksLikeTree(lines)) {
    return null;
  }

  const root: TreeNode[] = [];
  const stack: TreeNode[] = [];

  lines.forEach((line, index) => {
    const depth = getIndentDepth(line);
    const name = line.replace(TREE_PREFIX_PATTERN, '').trim();

    if (!name) {
      return;
    }

    const node: TreeNode = { id: `node-${index}`, name, depth, children: [] };

    while (stack.length > 0 && stack[stack.length - 1].depth >= depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return root;
}

function isLikelyFolder(name: string): boolean {
  return name.endsWith('/') || !name.includes('.');
}

function TreeItem({ node }: { node: TreeNode }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children.length > 0;
  const folder = isLikelyFolder(node.name);

  return (
    <li>
      <button
        type="button"
        onClick={() => hasChildren && setIsExpanded((prev) => !prev)}
        disabled={!hasChildren}
        className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm transition-colors duration-150 ${
          hasChildren
            ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'
            : 'cursor-default'
        }`}
      >
        {hasChildren ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
            className={`h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-transform duration-200 ${
              isExpanded ? 'rotate-90' : 'rotate-0'
            }`}
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <span className="h-3.5 w-3.5 flex-shrink-0" />
        )}

        <span aria-hidden="true" className="flex-shrink-0 text-base leading-none">
          {folder ? '📁' : '📄'}
        </span>

        <span
          className={`truncate font-mono text-xs ${
            folder
              ? 'font-semibold text-slate-800 dark:text-slate-200'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          {node.name}
        </span>
      </button>

      {hasChildren ? (
        <ul
          className={`ml-4 border-l border-slate-200 pl-2 transition-all duration-200 ease-out dark:border-slate-700 ${
            isExpanded ? 'max-h-[10000px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
          }`}
        >
          {node.children.map((child) => (
            <TreeItem key={child.id} node={child} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FolderStructure({ folderStructure }: FolderStructureProps) {
  const tree = useMemo(() => buildTree(folderStructure), [folderStructure]);

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors duration-300 dark:border-slate-700 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-bold text-slate-900 dark:text-slate-100">
        Folder Structure
      </h2>

      {tree && tree.length > 0 ? (
        <ul className="space-y-0.5">
          {tree.map((node) => (
            <TreeItem key={node.id} node={node} />
          ))}
        </ul>
      ) : (
        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400">
          {folderStructure}
        </p>
      )}
    </div>
  );
}
