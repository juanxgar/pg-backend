-- CreateTable
CREATE TABLE "rotation" (
    "rotation_id" SERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "location_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "finish_date" TIMESTAMP(3) NOT NULL,
    "semester" INTEGER NOT NULL,
    "state" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rotation_pkey" PRIMARY KEY ("rotation_id")
);

-- CreateTable
CREATE TABLE "rotation_speciality" (
    "rotation_speciality_id" SERIAL NOT NULL,
    "rotation_id" INTEGER NOT NULL,
    "speciality_id" INTEGER NOT NULL,
    "professor_user_id" INTEGER NOT NULL,

    CONSTRAINT "rotation_speciality_pkey" PRIMARY KEY ("rotation_speciality_id")
);

-- CreateTable
CREATE TABLE "rotation_date" (
    "rotation_date_id" SERIAL NOT NULL,
    "student_user_id" INTEGER NOT NULL,
    "rotation_speciality_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "finish_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rotation_date_pkey" PRIMARY KEY ("rotation_date_id")
);

-- CreateTable
CREATE TABLE "description_exam" (
    "description_exam_id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "description_exam_pkey" PRIMARY KEY ("description_exam_id")
);

-- CreateTable
CREATE TABLE "subdescription_exam" (
    "subdescription_exam_id" SERIAL NOT NULL,
    "description_exam_id" INTEGER NOT NULL,
    "subdescription" TEXT NOT NULL,

    CONSTRAINT "subdescription_exam_pkey" PRIMARY KEY ("subdescription_exam_id")
);

-- CreateTable
CREATE TABLE "evalution" (
    "evaluation_id" SERIAL NOT NULL,
    "rotation_speciality_id" INTEGER NOT NULL,
    "rotation_date_id" INTEGER NOT NULL,
    "grade_value" DOUBLE PRECISION,
    "professor_comments" TEXT,
    "student_comments" TEXT,

    CONSTRAINT "evalution_pkey" PRIMARY KEY ("evaluation_id")
);

-- CreateTable
CREATE TABLE "student_grade" (
    "student_grade_id" SERIAL NOT NULL,
    "evaluation_id" INTEGER NOT NULL,
    "subdescription_exam_id" INTEGER NOT NULL,
    "grade_value" DOUBLE PRECISION,

    CONSTRAINT "student_grade_pkey" PRIMARY KEY ("student_grade_id")
);

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("group_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation" ADD CONSTRAINT "rotation_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("location_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation_speciality" ADD CONSTRAINT "rotation_speciality_rotation_id_fkey" FOREIGN KEY ("rotation_id") REFERENCES "rotation"("rotation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation_speciality" ADD CONSTRAINT "rotation_speciality_speciality_id_fkey" FOREIGN KEY ("speciality_id") REFERENCES "speciality"("speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation_speciality" ADD CONSTRAINT "rotation_speciality_professor_user_id_fkey" FOREIGN KEY ("professor_user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation_date" ADD CONSTRAINT "rotation_date_student_user_id_fkey" FOREIGN KEY ("student_user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotation_date" ADD CONSTRAINT "rotation_date_rotation_speciality_id_fkey" FOREIGN KEY ("rotation_speciality_id") REFERENCES "rotation_speciality"("rotation_speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdescription_exam" ADD CONSTRAINT "subdescription_exam_description_exam_id_fkey" FOREIGN KEY ("description_exam_id") REFERENCES "description_exam"("description_exam_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evalution" ADD CONSTRAINT "evalution_rotation_speciality_id_fkey" FOREIGN KEY ("rotation_speciality_id") REFERENCES "rotation_speciality"("rotation_speciality_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evalution" ADD CONSTRAINT "evalution_rotation_date_id_fkey" FOREIGN KEY ("rotation_date_id") REFERENCES "rotation_date"("rotation_date_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grade" ADD CONSTRAINT "student_grade_evaluation_id_fkey" FOREIGN KEY ("evaluation_id") REFERENCES "evalution"("evaluation_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_grade" ADD CONSTRAINT "student_grade_subdescription_exam_id_fkey" FOREIGN KEY ("subdescription_exam_id") REFERENCES "subdescription_exam"("subdescription_exam_id") ON DELETE RESTRICT ON UPDATE CASCADE;
