-- CreateTable
CREATE TABLE "Languages" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "set" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Languages_pkey" PRIMARY KEY ("id")
);
