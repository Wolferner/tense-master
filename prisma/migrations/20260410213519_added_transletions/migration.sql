/*
  Warnings:

  - You are about to drop the column `explanation` on the `tense_exercise_questions` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `tense_exercise_questions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[answer,tense]` on the table `tense_exercise_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('ru', 'fr', 'de', 'es');

-- DropIndex
DROP INDEX "tense_exercise_questions_question_tense_key";

-- AlterTable
ALTER TABLE "tense_exercise_questions" DROP COLUMN "explanation",
DROP COLUMN "question";

-- CreateTable
CREATE TABLE "tense_exercise_translations" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "question" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tense_exercise_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tense_exercise_translations_exerciseId_locale_key" ON "tense_exercise_translations"("exerciseId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "tense_exercise_questions_answer_tense_key" ON "tense_exercise_questions"("answer", "tense");

-- AddForeignKey
ALTER TABLE "tense_exercise_translations" ADD CONSTRAINT "tense_exercise_translations_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "tense_exercise_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
