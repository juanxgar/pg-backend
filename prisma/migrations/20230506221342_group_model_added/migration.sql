-- CreateTable
CREATE TABLE "group" (
    "group_id" SERIAL NOT NULL,
    "professor_user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "group_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "group_detail" (
    "group_detail_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "group_detail_pkey" PRIMARY KEY ("group_detail_id")
);

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_professor_user_id_fkey" FOREIGN KEY ("professor_user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_detail" ADD CONSTRAINT "group_detail_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_detail" ADD CONSTRAINT "group_detail_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
