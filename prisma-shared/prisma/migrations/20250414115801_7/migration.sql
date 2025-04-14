/*
  Warnings:

  - A unique constraint covering the columns `[tokenTicker]` on the table `TokenDetail` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tweet" ADD COLUMN     "isAnalyzed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPresale" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "TokenDetail_tokenTicker_key" ON "TokenDetail"("tokenTicker");
