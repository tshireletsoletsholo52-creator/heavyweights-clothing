-- AlterTable
ALTER TABLE "Variant" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
