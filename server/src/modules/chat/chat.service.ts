import { ApiError } from '../../utils/ApiError';
import { analyzeRepositoryWithAI } from '../ai/ai.service';
import { AIAnalysis } from '../ai/ai.types';
import { buildRepositoryContext } from '../github/github.service';
import { RepositoryMetadata } from '../github/github.types';
import { getAnalysisHistoryEntry } from '../history/history.service';
import { generateChatCompletion } from './chat.client';
import { buildChatSystemPrompt, CHAT_HISTORY_LIMIT } from './chat.constants';
import { AskChatQuestionInput, ChatAnswerResult, ChatMessage } from './chat.types';

// In-memory only, for the lifetime of this server process - matches the same
// pattern as the existing InMemoryCache-based caches in the github/ai modules.
// Keyed by `${userId}:${repositoryFullName}`.
const chatSessions = new Map<string, ChatMessage[]>();

interface ResolvedRepositoryContext {
  metadata: RepositoryMetadata;
  analysis: AIAnalysis;
}

async function resolveRepositoryContext(
  userId: string,
  input: AskChatQuestionInput,
): Promise<ResolvedRepositoryContext> {
  if (input.repositoryId) {
    const historyEntry = await getAnalysisHistoryEntry(input.repositoryId, userId);
    return {
      metadata: historyEntry.metadata as unknown as RepositoryMetadata,
      analysis: historyEntry.analysis as unknown as AIAnalysis,
    };
  }

  if (input.repositoryUrl) {
    const context = await buildRepositoryContext(input.repositoryUrl);
    const analysis = await analyzeRepositoryWithAI(context);
    return { metadata: context.metadata, analysis };
  }

  throw ApiError.badRequest('Either repositoryId or repositoryUrl is required');
}

function summarizeForChat(metadata: RepositoryMetadata, analysis: AIAnalysis): string {
  return `Name: ${metadata.fullName}
Description: ${metadata.description ?? 'No description provided'}
Primary Language: ${metadata.primaryLanguage ?? 'Unknown'}
Topics: ${metadata.topics.join(', ') || 'None'}
Stars: ${metadata.stars} | Forks: ${metadata.forks} | Open Issues: ${metadata.openIssues}
License: ${metadata.license ?? 'None'}

AI Analysis Summary: ${analysis.summary}
Purpose: ${analysis.purpose}
Technologies: ${analysis.technologies.join(', ') || 'Not specified'}
Frameworks: ${analysis.frameworks.join(', ') || 'Not specified'}
Architecture: ${analysis.architecture}
Folder Structure: ${analysis.folderStructure}
Installation: ${analysis.installation}
Difficulty: ${analysis.difficulty}
Advantages: ${analysis.advantages.join('; ') || 'None listed'}
Disadvantages: ${analysis.disadvantages.join('; ') || 'None listed'}
Best Practices: ${analysis.bestPractices.join('; ') || 'None listed'}
Learning Roadmap: ${analysis.roadmap.join('; ') || 'None listed'}`;
}

function getSessionKey(userId: string, repositoryFullName: string): string {
  return `${userId}:${repositoryFullName.toLowerCase()}`;
}

function appendToSession(sessionKey: string, message: ChatMessage): ChatMessage[] {
  const existing = chatSessions.get(sessionKey) ?? [];
  const updated = [...existing, message].slice(-CHAT_HISTORY_LIMIT);
  chatSessions.set(sessionKey, updated);
  return updated;
}

export async function askChatQuestion(
  userId: string,
  input: AskChatQuestionInput,
): Promise<ChatAnswerResult> {
  const { metadata, analysis } = await resolveRepositoryContext(userId, input);
  const sessionKey = getSessionKey(userId, metadata.fullName);

  const userMessage: ChatMessage = {
    role: 'user',
    content: input.question,
    timestamp: new Date().toISOString(),
  };
  const historyWithUserMessage = appendToSession(sessionKey, userMessage);

  const systemPrompt = buildChatSystemPrompt(summarizeForChat(metadata, analysis));

  const answer = await generateChatCompletion([
    { role: 'system', content: systemPrompt },
    ...historyWithUserMessage.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ]);

  const assistantMessage: ChatMessage = {
    role: 'assistant',
    content: answer,
    timestamp: new Date().toISOString(),
  };
  const finalHistory = appendToSession(sessionKey, assistantMessage);

  return {
    answer,
    repositoryFullName: metadata.fullName,
    history: finalHistory,
  };
}