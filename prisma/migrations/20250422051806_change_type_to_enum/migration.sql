/*
  Warnings:

  - Changed the type of `type` on the `Content` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentTypes" AS ENUM ('image', 'article', 'audio', 'video');

-- AlterTable
ALTER TABLE "Content"
ALTER COLUMN  "type" TYPE "ContentTypes" USING "type":: "ContentTypes";
