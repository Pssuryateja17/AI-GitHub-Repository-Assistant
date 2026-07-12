export const CHAT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
export const CHAT_RATE_LIMIT_MAX = 60;

// Number of prior messages (user + assistant combined) kept per session and
// replayed as conversational context on each new question.
export const CHAT_HISTORY_LIMIT = 20;

export const CHAT_QUESTION_MAX_LENGTH = 2000;

export function buildChatSystemPrompt(repositoryContextSummary: string): string {
  return `You are a helpful assistant that answers questions ONLY about the specific GitHub repository described below. You must not answer questions unrelated to this repository - if asked something unrelated, politely explain that you can only discuss this repository and ask the user to rephrase their question about it.

Base your answers strictly on the repository information provided below. If the answer isn't contained in this information, say you don't have enough information from the analysis to answer confidently, rather than guessing.

Repository information:
${repositoryContextSummary}`;
}