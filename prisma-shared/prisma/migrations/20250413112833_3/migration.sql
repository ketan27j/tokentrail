/*
  Warnings:

  - Changed the type of `tweet_id` on the `Tweet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Tweet" DROP COLUMN "tweet_id",
ADD COLUMN     "tweet_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tweet_tweet_id_key" ON "Tweet"("tweet_id");
