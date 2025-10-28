-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "set" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);
