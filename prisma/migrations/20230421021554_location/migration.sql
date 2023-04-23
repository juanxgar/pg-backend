-- CreateTable
CREATE TABLE "location" (
    "location_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "adress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "total_capacity" INTEGER NOT NULL,
    "complexity" TEXT NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "location_pkey" PRIMARY KEY ("location_id")
);

-- CreateTable
CREATE TABLE "location_speciality" (
    "location_speciality_id" SERIAL NOT NULL,
    "location_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "limit_capacity" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "location_speciality_pkey" PRIMARY KEY ("location_speciality_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "location_name_key" ON "location"("name");

-- AddForeignKey
ALTER TABLE "location_speciality" ADD CONSTRAINT "location_speciality_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_speciality" ADD CONSTRAINT "location_speciality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "speciality"("speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;
