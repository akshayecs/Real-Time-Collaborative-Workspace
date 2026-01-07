/*
  Warnings:

  - The values [MEMBER] on the enum `WorkspaceRole` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceRole_new" AS ENUM ('ADMIN', 'OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" TYPE "WorkspaceRole_new" USING ("role"::text::"WorkspaceRole_new");
ALTER TYPE "WorkspaceRole" RENAME TO "WorkspaceRole_old";
ALTER TYPE "WorkspaceRole_new" RENAME TO "WorkspaceRole";
DROP TYPE "WorkspaceRole_old";
COMMIT;
