/*
  Warnings:

  - Added the required column `responseTime` to the `RequestLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusCode` to the `RequestLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RequestLog" ADD COLUMN     "responseTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "statusCode" INTEGER NOT NULL;
