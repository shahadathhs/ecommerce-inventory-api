/*
  Warnings:

  - Added the required column `publicUrl` to the `file_instances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."file_instances" ADD COLUMN     "publicUrl" TEXT NOT NULL;
