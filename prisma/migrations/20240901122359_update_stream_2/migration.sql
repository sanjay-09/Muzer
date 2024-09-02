/*
  Warnings:

  - You are about to drop the `CurrentStream` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CurrentStream" DROP CONSTRAINT "CurrentStream_streamId_fkey";

-- DropTable
DROP TABLE "CurrentStream";
