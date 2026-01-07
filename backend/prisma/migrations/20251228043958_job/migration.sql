/*
  Warnings:

  - The values [ADMIN] on the enum `WorkspaceRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `result` on the `Job` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "WorkspaceRole_new" AS ENUM ('OWNER', 'EDITOR', 'VIEWER');
ALTER TABLE "WorkspaceMember" ALTER COLUMN "role" TYPE "WorkspaceRole_new" USING ("role"::text::"WorkspaceRole_new");
ALTER TYPE "WorkspaceRole" RENAME TO "WorkspaceRole_old";
ALTER TYPE "WorkspaceRole_new" RENAME TO "WorkspaceRole";
DROP TYPE "WorkspaceRole_old";
COMMIT;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "result";
