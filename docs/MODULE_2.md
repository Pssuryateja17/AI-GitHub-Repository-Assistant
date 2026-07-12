# Module 2 — GitHub Repository Analyzer & Comparator

## 1. Frontend Folder Structure

```
client/src/
├── api/
│   ├── authApi.ts                  (Module 1)
│   ├── axiosClient.ts              (Module 1)
│   └── githubApi.ts                RepositoryService.analyzeRepository()
├── components/
│   ├── Alert.tsx                   (Module 1)
│   ├── Button.tsx                  (Module 1)
│   ├── Navbar.tsx                  (Module 1, updated: nav links added)
│   ├── TextField.tsx               (Module 1)
│   ├── RepositoryInput.tsx         (Module 1 — plain input, see note below)
│   ├── common/
│   │   └── LoadingSpinner.tsx      Reusable spinner (sm/md/lg, fullScreen)
│   └── repository/
│       ├── RepositoryInput.tsx     Validated URL input, uses useRepositoryAnalysis
│       ├── AnalyzeButton.tsx       Reusable loading/disabled button
│       ├── ErrorAlert.tsx          Dismissible animated API error display
│       ├── AnalysisCard.tsx        Summary, technologies, difficulty, recommendations
│       ├── AnalysisSection.tsx     Composes header/stats + AnalysisCard + README
│       ├── RepositorySummary.tsx   Owner, stars, forks, language breakdown
│       ├── MarkdownRenderer.tsx    Dependency-free safe README renderer
│       ├── FolderStructure.tsx     Expandable tree parsed from AI folderStructure text
│       ├── InstallationGuide.tsx   Copyable command blocks from AI installation text
│       ├── DifficultyBadge.tsx     Standalone Beginner/Intermediate/Advanced badge
│       ├── ProsConsCard.tsx        Advantages / disadvantages two-column card
│       └── RoadmapCard.tsx         Learning roadmap stepper with local progress
├── context/
│   └── AuthContext.tsx             (Module 1)
├── hooks/
│   └── useRepositoryAnalysis.ts    Loading/error/data state + analyze()/reset()
├── pages/
│   ├── LoginPage.tsx               (Module 1)
│   ├── RegisterPage.tsx            (Module 1)
│   ├── DashboardPage.tsx           (Module 1, updated: links to /analyze)
│   ├── NotFoundPage.tsx            (Module 1)
│   └── RepositoryAnalyzePage.tsx   Main analyzer page - input + full dashboard
├── routes/
│   ├── ProtectedRoute.tsx          (Module 1, reused for /analyze)
│   └── PublicRoute.tsx             (Module 1)
├── types/
│   ├── auth.ts                     (Module 1)
│   └── github.ts                   Repository, AIAnalysis, AnalysisResponse, APIError, LoadingState
├── utils/
│   └── extractErrorMessage.ts      (Module 1)
├── App.tsx                         (updated: /analyze route added)
├── main.tsx
└── index.css
```

**Known duplication to resolve later:** `src/components/RepositoryInput.tsx` (Module 1, plain input) and `src/components/repository/RepositoryInput.tsx` (Module 2, validated + hook-connected) both exist. `RepositoryAnalyzePage` ultimately builds its own inline input to share a single hook instance rather than importing either one directly (see that file's header comment for why). The original top-level component is currently unused. Recommend deleting it in a future cleanup pass.

## 2. Environment Variables

### server/.env

```
PORT=5000
NODE_ENV=development

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_github_assistant?schema=public

JWT_SECRET=replace_this_with_a_long_random_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
COOKIE_NAME=agra_token

# Module 2: GitHub Repository Analyzer
GITHUB_TOKEN=
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:3b
REQUEST_TIMEOUT=30000
CACHE_TTL=300
AI_PROVIDER=ollama
```

| Variable | Required | Purpose |
|---|---|---|
| GITHUB_TOKEN | No | Optional personal access token; raises GitHub's unauthenticated rate limit (60/hr to 5,000/hr) |
| OLLAMA_BASE_URL | Yes | Base URL of your local Ollama server |
| OLLAMA_MODEL | Yes | Model tag to use (default llama3.2:3b) - must be pulled locally via `ollama pull llama3.2:3b` |
| REQUEST_TIMEOUT | No | Timeout (ms) for both GitHub and Ollama HTTP calls |
| CACHE_TTL | No | TTL (seconds) for both the in-memory repository cache and the AI analysis cache |
| AI_PROVIDER | No | Present for future extensibility; only `ollama` is implemented |

### client/.env

No new variables - still just:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 3. Postman Collection

See docs/Module2.postman_collection.json (import directly into Postman). It contains:

- **Auth -> Login** - establishes the agra_token cookie Postman needs before calling Analyze (the endpoint is behind the existing authenticate middleware).
- **GitHub Analyzer -> Analyze Repository** - the POST /api/github/analyze request, with three saved example responses: 200 OK (full success payload), 400 Bad Request (invalid URL), and 401 Unauthorized (missing session).

Sample request body:

```json
{
  "repositoryUrl": "https://github.com/facebook/react"
}
```

Sample success response shape:

```json
{
  "success": true,
  "message": "Repository analyzed successfully",
  "data": {
    "repository": { "...": "RepositoryMetadata fields" },
    "readme": "# React\n\n...",
    "analysis": {
      "summary": "...",
      "purpose": "...",
      "technologies": ["JavaScript", "C++", "TypeScript"],
      "difficulty": "Advanced",
      "advantages": ["..."],
      "disadvantages": ["..."],
      "roadmap": ["..."]
    }
  }
}
```

## 4. Module 2 Checklist

**Backend**
- [x] src/modules/github/github.constants.ts
- [x] src/modules/github/github.types.ts
- [x] src/modules/github/github.utils.ts (URL parsing, base64 decode)
- [x] src/modules/github/github.validator.ts (Zod)
- [x] src/modules/github/github.client.ts (axios, retry once, auth header)
- [x] src/modules/github/github.service.ts (fetch* functions, buildRepositoryContext, cache)
- [x] src/modules/github/github.dto.ts
- [x] src/modules/github/github.controller.ts
- [x] src/modules/github/github.routes.ts
- [x] src/modules/ai/ai.types.ts
- [x] src/modules/ai/ai.constants.ts (prompt + JSON schema)
- [x] src/modules/ai/ai.client.ts (Ollama REST client)
- [x] src/modules/ai/ai.parser.ts (JSON repair/validation)
- [x] src/modules/ai/ai.service.ts (context summary + cache)
- [x] src/utils/inMemoryCache.ts (shared TTL cache)
- [x] src/middlewares/rateLimiter.middleware.ts
- [x] routes/index.ts updated to mount /api/github
- [x] package.json updated with axios, express-rate-limit
- [x] .env.example updated with Module 2 vars

**Frontend**
- [x] types/github.ts, api/githubApi.ts, hooks/useRepositoryAnalysis.ts
- [x] components/repository/RepositoryInput.tsx
- [x] components/repository/AnalyzeButton.tsx
- [x] components/common/LoadingSpinner.tsx
- [x] components/repository/ErrorAlert.tsx
- [x] components/repository/AnalysisCard.tsx
- [x] components/repository/AnalysisSection.tsx
- [x] components/repository/RepositorySummary.tsx
- [x] components/repository/MarkdownRenderer.tsx
- [x] components/repository/FolderStructure.tsx
- [x] components/repository/InstallationGuide.tsx
- [x] components/repository/DifficultyBadge.tsx
- [x] components/repository/ProsConsCard.tsx
- [x] components/repository/RoadmapCard.tsx
- [x] pages/RepositoryAnalyzePage.tsx
- [x] App.tsx, Navbar.tsx, DashboardPage.tsx wired for navigation

**Documentation**
- [x] docs/MODULE_2.md (this file)
- [x] docs/Module2.postman_collection.json

**Not done / open items**
- [ ] Duplicate RepositoryInput.tsx (two versions) not consolidated
- [ ] DifficultyBadge.tsx not wired into AnalysisCard.tsx (which has its own inline copy)
- [ ] No automated tests (unit/integration) generated for Module 2
- [ ] Ollama/GitHub calls not covered by request-level retries beyond the single retry in github.client.ts
