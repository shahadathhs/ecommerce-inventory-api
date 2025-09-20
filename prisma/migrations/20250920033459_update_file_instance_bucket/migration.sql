/*
  Warnings:

  - Changed the type of `bucket` on the `file_instances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Bucket" AS ENUM ('product', 'profile');

-- AlterTable
ALTER TABLE "public"."file_instances" DROP COLUMN "bucket",
ADD COLUMN     "bucket" "public"."Bucket" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "file_instances_bucket_path_key" ON "public"."file_instances"("bucket", "path");
