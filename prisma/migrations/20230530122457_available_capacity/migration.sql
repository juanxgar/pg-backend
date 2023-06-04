/*
  Warnings:

  - Added the required column `rotation_id` to the `rotation_date` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "rotation_date" ADD COLUMN     "rotation_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "rotation_speciality" ADD COLUMN     "available_capacity" INTEGER;

-- AddForeignKey
ALTER TABLE "rotation_date" ADD CONSTRAINT "rotation_date_rotation_id_fkey" FOREIGN KEY ("rotation_id") REFERENCES "rotation"("rotation_id") ON DELETE RESTRICT ON UPDATE CASCADE;
