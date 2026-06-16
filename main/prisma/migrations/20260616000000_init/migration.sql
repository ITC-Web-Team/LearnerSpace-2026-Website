-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "rollNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "repositoryLink" TEXT,
    "week1Verified" BOOLEAN NOT NULL DEFAULT false,
    "week2Verified" BOOLEAN NOT NULL DEFAULT false,
    "week3Verified" BOOLEAN NOT NULL DEFAULT false,
    "week4Verified" BOOLEAN NOT NULL DEFAULT false,
    "finalVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_rollNo_key" ON "User"("rollNo");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_rollNo_key" ON "Submission"("rollNo");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_rollNo_fkey" FOREIGN KEY ("rollNo") REFERENCES "User"("rollNo") ON DELETE CASCADE ON UPDATE CASCADE;