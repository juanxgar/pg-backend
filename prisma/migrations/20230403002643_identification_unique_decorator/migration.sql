/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_identification_key" ON "User"("identification");
