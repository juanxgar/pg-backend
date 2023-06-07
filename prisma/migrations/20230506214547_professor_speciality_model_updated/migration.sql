/*
  Warnings:

  - You are about to drop the `professor_especiality` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "professor_especiality" DROP CONSTRAINT "professor_especiality_speciality_id_fkey";

-- DropForeignKey
ALTER TABLE "professor_especiality" DROP CONSTRAINT "professor_especiality_user_id_fkey";

-- DropTable
DROP TABLE "professor_especiality";

-- CreateTable
CREATE TABLE "professor_speciality" (
    "professor_especiality_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "professor_speciality_pkey" PRIMARY KEY ("professor_especiality_id")
);

-- AddForeignKey
ALTER TABLE "professor_speciality" ADD CONSTRAINT "professor_speciality_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_speciality" ADD CONSTRAINT "professor_speciality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "speciality"("speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;
