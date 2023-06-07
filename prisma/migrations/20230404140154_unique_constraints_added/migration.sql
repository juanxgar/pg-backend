/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_identification_key" ON "User"("identification");

-- CreateIndex
CREATE UNIQUE INDEX "User_code_key" ON "User"("code");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
