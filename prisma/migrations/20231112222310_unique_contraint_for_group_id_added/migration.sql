/*
  Warnings:

  - A unique constraint covering the columns `[group_id]` on the table `rotation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "rotation_group_id_key" ON "rotation"("group_id");
