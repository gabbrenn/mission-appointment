-- AlterTable
ALTER TABLE "MissionReport" ADD COLUMN     "additionalDocuments" TEXT[] DEFAULT ARRAY[]::TEXT[];
