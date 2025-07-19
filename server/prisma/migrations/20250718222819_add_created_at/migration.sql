/*
  Warnings:

  - A unique constraint covering the columns `[telNum]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_telNum_key" ON "users"("telNum");
