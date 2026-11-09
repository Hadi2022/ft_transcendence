/*
  Warnings:

  - You are about to drop the column `content` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `type_multimedia` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comentarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `post_categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `caption` to the `posts` table without a default value. This is not possible if the table is not empty.
  - Made the column `multimedia_url` on table `posts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_parent_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_post_id_fkey";

-- DropForeignKey
ALTER TABLE "comentarios" DROP CONSTRAINT "comentarios_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_category_id_fkey";

-- DropForeignKey
ALTER TABLE "post_categories" DROP CONSTRAINT "post_categories_post_id_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "content",
DROP COLUMN "state",
DROP COLUMN "type_multimedia",
ADD COLUMN     "caption" VARCHAR(100) NOT NULL,
ALTER COLUMN "multimedia_url" SET NOT NULL;

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "comentarios";

-- DropTable
DROP TABLE "post_categories";

-- DropEnum
DROP TYPE "state_post";

-- CreateTable
CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parent_comment_id" UUID,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "comments_post_id_created_at_idx" ON "comments"("post_id", "created_at" ASC);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
