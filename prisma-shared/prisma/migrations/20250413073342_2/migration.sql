/*
  Warnings:

  - You are about to drop the column `tweet` on the `Tweet` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tweet_id]` on the table `Tweet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookmarks` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_at` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `favorites` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lang` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quotes` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `replies` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retweets` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `screen_name` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tweet_id` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Tweet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tweet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "tweet",
ADD COLUMN     "bookmarks" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "favorites" INTEGER NOT NULL,
ADD COLUMN     "lang" TEXT NOT NULL,
ADD COLUMN     "quotes" INTEGER NOT NULL,
ADD COLUMN     "replies" INTEGER NOT NULL,
ADD COLUMN     "retweets" INTEGER NOT NULL,
ADD COLUMN     "screen_name" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "tweet_id" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Cursor" (
    "id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cursor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweet_id_key" ON "Tweet"("tweet_id");
