-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sito_web" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "attiva" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_nome_key" ON "Company"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
