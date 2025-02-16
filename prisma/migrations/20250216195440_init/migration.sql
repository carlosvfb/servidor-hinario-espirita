-- CreateTable
CREATE TABLE "Musica" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "artista" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "letra" TEXT NOT NULL,
    "cifra" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "urlQrCode" TEXT NOT NULL,

    CONSTRAINT "Musica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Musica_nome_key" ON "Musica"("nome");
