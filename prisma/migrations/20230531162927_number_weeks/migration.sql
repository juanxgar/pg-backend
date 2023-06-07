/*
  Warnings:

  - Added the required column `number_weeks` to the `rotation_speciality` table without a default value. This is not possible if the table is not empty.
  - Made the column `available_capacity` on table `rotation_speciality` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rotation_speciality" ADD COLUMN     "number_weeks" INTEGER NOT NULL,
ALTER COLUMN "available_capacity" SET NOT NULL;
