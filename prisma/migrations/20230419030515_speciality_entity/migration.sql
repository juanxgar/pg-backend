/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "identification" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,
    "reset_password_token" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "speciality" (
    "speciality_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL,

    CONSTRAINT "speciality_pkey" PRIMARY KEY ("speciality_id")
);

-- CreateTable
CREATE TABLE "professor_especiality" (
    "professor_especiality_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL,

    CONSTRAINT "professor_especiality_pkey" PRIMARY KEY ("professor_especiality_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_identification_key" ON "user"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "user_code_key" ON "user"("code");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "speciality_description_key" ON "speciality"("description");

-- AddForeignKey
ALTER TABLE "professor_especiality" ADD CONSTRAINT "professor_especiality_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professor_especiality" ADD CONSTRAINT "professor_especiality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "speciality"("speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;
