/*
  Warnings:

  - The primary key for the `follow-ups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followed_id` on the `follow-ups` table. All the data in the column will be lost.
  - Added the required column `continued_id` to the `follow-ups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "follow-ups" DROP CONSTRAINT "follow-ups_followed_id_fkey";

-- DropIndex
DROP INDEX "follow-ups_followed_id_idx";

-- AlterTable
ALTER TABLE "follow-ups" DROP CONSTRAINT "follow-ups_pkey",
DROP COLUMN "followed_id",
ADD COLUMN     "continued_id" UUID NOT NULL,
ADD CONSTRAINT "follow-ups_pkey" PRIMARY KEY ("follower_id", "continued_id");

-- CreateIndex
CREATE INDEX "follow-ups_continued_id_idx" ON "follow-ups"("continued_id");

-- AddForeignKey
ALTER TABLE "follow-ups" ADD CONSTRAINT "follow-ups_continued_id_fkey" FOREIGN KEY ("continued_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
