-- CreateTable
CREATE TABLE "analysis_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL,
    "metadata" JSONB NOT NULL,
    "analysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analysis_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_repositories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "repositoryFullName" TEXT NOT NULL,
    "repositoryUrl" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "saved_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "analysis_history_userId_idx" ON "analysis_history"("userId");

-- CreateIndex
CREATE INDEX "analysis_history_userId_createdAt_idx" ON "analysis_history"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "analysis_history_repositoryFullName_idx" ON "analysis_history"("repositoryFullName");

-- CreateIndex
CREATE INDEX "saved_repositories_userId_idx" ON "saved_repositories"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_repositories_userId_repositoryFullName_key" ON "saved_repositories"("userId", "repositoryFullName");

-- AddForeignKey
ALTER TABLE "analysis_history" ADD CONSTRAINT "analysis_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_repositories" ADD CONSTRAINT "saved_repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
