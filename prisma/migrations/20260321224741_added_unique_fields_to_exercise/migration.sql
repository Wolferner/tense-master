/*
  Warnings:

  - A unique constraint covering the columns `[question,tense]` on the table `tense_exercise_questions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tense_exercise_questions_question_tense_key" ON "tense_exercise_questions"("question", "tense");
