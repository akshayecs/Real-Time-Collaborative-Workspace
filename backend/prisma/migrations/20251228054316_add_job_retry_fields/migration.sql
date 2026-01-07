/*
  Warnings:

  - Changed the type of `type` on the `Job` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('CODE_EXECUTION', 'INDEX_WORKSPACE');

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "result" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" "JobType" NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
