/*
  Warnings:

  - Added the required column `explanation` to the `tense_exercise_questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tense_exercise_questions" ADD COLUMN     "explanation" TEXT NOT NULL;
