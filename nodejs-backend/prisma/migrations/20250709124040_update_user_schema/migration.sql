/*
  Warnings:

  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- Add the name column first with a default value
ALTER TABLE "users" ADD COLUMN "name" TEXT NOT NULL DEFAULT '';

-- Copy username data to name column
UPDATE "users" SET "name" = "username";

-- Drop the username column
ALTER TABLE "users" DROP COLUMN "username";
