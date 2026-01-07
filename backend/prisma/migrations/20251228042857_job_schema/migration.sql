/*
  Warnings:

  - The values [COLLABORATOR] on the enum `WorkspaceRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceRole_new" AS ENUM ('OWNER', 'ADMIN', 'EDITOR', 'VIEWER');
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" TYPE "WorkspaceRole_new" USING ("role"::text::"WorkspaceRole_new");
ALTER TYPE "WorkspaceRole" RENAME TO "WorkspaceRole_old";
ALTER TYPE "WorkspaceRole_new" RENAME TO "WorkspaceRole";
DROP TYPE "WorkspaceRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "maxRetries" INTEGER NOT NULL DEFAULT 3,
ALTER COLUMN "status" DROP DEFAULT;
