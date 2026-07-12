# Module 3 - Repository Comparison, Analysis History, Saved Repositories, Dashboard

## 1. Folder Structure (Module 3 additions only)

```
server/
├── prisma/
│   ├── schema.prisma                          (updated: AnalysisHistory, SavedRepository models)
│   └── migrations/
│       ├── migration_lock.toml                (created - none existed before)
│       └── 20260708020000_add_analysis_history_and_saved_repository/
│           └── migration.sql
└── src/
    ├── routes/
    │   └── index.ts                           (updated: mounts comparisonRoutes only)
    └── modules/
        ├── history/
        │   ├── history.repository.ts           done
        │   ├── history.service.ts               done
        │   ├── history.validator.ts             done
        │   ├── history.controller.ts            MISSING
        │   └── history.routes.ts                MISSING
        ├── saved-repositories/
        │   ├── savedRepositories.repository.ts  done
        │   ├── savedRepositories.service.ts     done
        │   ├── savedRepositories.controller.ts  MISSING
        │   └── savedRepositories.routes.ts       MISSING
        └── comparison/
            ├── comparison.constants.ts          done
            ├── comparison.types.ts               done
            ├── comparison.validator.ts           done
            ├── comparison.service.ts              done
            ├── comparison.controller.ts           done
            └── comparison.routes.ts                done (mounted, LIVE)

client/src/
├── api/
│   ├── historyApi.ts                HistoryService (save/get/delete) - not yet used by pages
│   ├── compareApi.ts                CompareService.compareRepositories - not yet used by RepositoryComparePage
│   └── savedRepositoryApi.ts        SavedRepositoryService (save/list/unsave) - not yet used by pages
├── components/repository/
│   ├── RepositoryCompareInput.tsx
│   ├── ComparisonTable.tsx
│   ├── ComparisonCard.tsx
│   ├── WinnerBadge.tsx
│   ├── SearchBar.tsx
│   ├── DeleteConfirmation.tsx
│   ├── HistoryCard.tsx
│   ├── FavoriteButton.tsx
│   ├── SavedRepositoryCard.tsx
│   └── DashboardStatsCharts.tsx      (Recharts: languages, difficulty, top repos, weekly activity)
├── pages/
│   ├── RepositoryComparePage.tsx     inline axiosClient calls (not using compareApi.ts)
│   ├── HistoryPage.tsx               inline axiosClient calls (not using historyApi.ts)
│   ├── SavedRepositoriesPage.tsx     inline axiosClient calls (not using savedRepositoryApi.ts)
│   └── DashboardPage.tsx             (updated: stats, quick actions, recent analyses/saved/activity, charts)
├── App.tsx                          (updated: /compare, /history, /saved routes added)
└── components/Navbar.tsx            (updated: Compare/History/Saved nav links added)
```

## 2. Module 3 Checklist

**Database**
- [x] AnalysisHistory model (relations, indexes, timestamps)
- [x] SavedRepository model (relations, unique constraint, indexes, timestamps)
- [x] Migration SQL + migration_lock.toml hand-written (not run against a live DB in this sandbox - no network/DB access here)

**Backend - History module**
- [x] Repository layer
- [x] Service layer
- [x] Validator (save schema, list/pagination schema, id param schema)
- [ ] Controller - not generated
- [ ] Routes - not generated
- [ ] Mount in routes/index.ts - not done
- Result: POST /history/save, GET /history, DELETE /history/:id are NOT reachable

**Backend - Saved Repositories module**
- [x] Repository layer
- [x] Service layer
- [ ] Validator - not generated
- [ ] Controller - not generated
- [ ] Routes - not generated
- [ ] Mount in routes/index.ts - not done
- Result: POST /saved, GET /saved, DELETE /saved/:id are NOT reachable

**Backend - Comparison module**
- [x] Constants, types, validator, service, controller, routes
- [x] Mounted in routes/index.ts at router.use('/', comparisonRoutes)
- Result: POST /compare is LIVE and functional

**Frontend**
- [x] historyApi.ts, compareApi.ts, savedRepositoryApi.ts (dedicated API layer)
- [x] All requested components (Compare, History, Saved, Dashboard charts)
- [x] RepositoryComparePage.tsx, HistoryPage.tsx, SavedRepositoriesPage.tsx, updated DashboardPage.tsx
- [x] Routing: /compare, /history, /saved added to App.tsx under the existing ProtectedRoute
- [x] Navigation: Navbar.tsx links added
- [ ] Pages still call axiosClient inline instead of importing historyApi.ts / compareApi.ts / savedRepositoryApi.ts - duplicate API-calling code exists side by side with the dedicated API layer

**Documentation**
- [x] docs/MODULE_2.md, docs/Module2.postman_collection.json (prior module)
- [x] docs/Module3.postman_collection.json (this module - Compare requests are live/testable; History and Saved requests document the intended contract but will 404 against the current backend)
- [x] This file

## 3. What Actually Works End-to-End Right Now

- Register / Login / Logout / Me (Module 1)
- Analyze a repository via GitHub + Ollama (Module 2)
- Compare two repositories (POST /api/compare) - fully live, frontend and backend connected
- Dashboard renders, but its History/Saved/Statistics widgets will show empty or error states until the two missing backend modules are completed

## 4. Immediate Next Steps (not yet done)

1. Generate history.controller.ts + history.routes.ts, mount at /history
2. Generate savedRepositories.validator.ts + savedRepositories.controller.ts + savedRepositories.routes.ts, mount at /saved
3. Refactor RepositoryComparePage.tsx / HistoryPage.tsx / SavedRepositoriesPage.tsx to use compareApi.ts / historyApi.ts / savedRepositoryApi.ts instead of inline axiosClient calls, removing the duplication
4. Wire github.controller.ts's analyze flow to actually call HistoryService.saveAnalysisHistory (or add a manual "Save to History" button in RepositoryAnalyzePage.tsx) - right now nothing calls POST /history/save from the UI at all
5. Run the migration against a real database and verify with npx prisma studio
