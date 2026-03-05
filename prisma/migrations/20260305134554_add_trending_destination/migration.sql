-- CreateTable
CREATE TABLE "TrendingDestination" (
    "id" SERIAL NOT NULL,
    "city" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price_from" TEXT,
    "rating" TEXT,
    "duration" TEXT,
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrendingDestination_pkey" PRIMARY KEY ("id")
);
