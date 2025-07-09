/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- 1. Add username column as nullable
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- 2. Copy data from name to username
UPDATE "users" SET "username" = "name";

-- 3. Set username as NOT NULL
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

-- 4. Drop the name column
ALTER TABLE "users" DROP COLUMN "name";
