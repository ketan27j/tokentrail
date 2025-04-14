/*
  Warnings:

  - Added the required column `twitterHandle` to the `TokenDetail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `TokenDetail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TokenDetail" ADD COLUMN     "twitterHandle" TEXT NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;
