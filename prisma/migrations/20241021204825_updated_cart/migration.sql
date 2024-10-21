-- CreateEnum
CREATE TYPE "CartStatus" AS ENUM ('ACTIVE', 'ABANDONED', 'CHECKOUT_IN_PROGRESS', 'COMPLETED', 'MERGED');

-- AlterTable
ALTER TABLE "cart-items" ADD COLUMN     "status" "CartStatus" NOT NULL DEFAULT 'ACTIVE';
