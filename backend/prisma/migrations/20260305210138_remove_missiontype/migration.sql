/*
  Warnings:

  - You are about to drop the column `missionTypeId` on the `Mission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_missionTypeId_fkey";

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "missionTypeId";
