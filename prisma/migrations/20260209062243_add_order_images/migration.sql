/*
  Warnings:

  - You are about to drop the column `design_image_url` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "design_image_url";

-- CreateTable
CREATE TABLE "order_images" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order_images" ADD CONSTRAINT "order_images_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
