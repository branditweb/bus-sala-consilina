-- CreateTable
CREATE TABLE "Bus" (
    "id" SERIAL NOT NULL,
    "compagnia" TEXT NOT NULL,
    "orario_partenza" TIMESTAMP(3) NOT NULL,
    "destinazione" TEXT NOT NULL,
    "sito_web_compagnia" TEXT,
    "contatti" TEXT,

    CONSTRAINT "Bus_pkey" PRIMARY KEY ("id")
);
