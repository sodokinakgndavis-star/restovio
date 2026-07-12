/*
  Warnings:

  - Added the required column `depositAmount` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('NOT_APPLICABLE', 'PENDING', 'REFUNDED');

-- AlterTable (colonne nullable le temps du backfill)
ALTER TABLE "Booking" ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "refundDueAt" TIMESTAMP(3),
ADD COLUMN     "refundStatus" "RefundStatus" NOT NULL DEFAULT 'NOT_APPLICABLE';

-- Backfill : acompte de 50% calculé sur les réservations existantes
UPDATE "Booking" SET "depositAmount" = ROUND("totalPrice" / 2.0);

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "depositAmount" SET NOT NULL;
