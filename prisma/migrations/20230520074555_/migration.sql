-- CreateTable
CREATE TABLE "Embedding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "vector" BLOB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_id_key" ON "Embedding"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Embedding_text_key" ON "Embedding"("text");
