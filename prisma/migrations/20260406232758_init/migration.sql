-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "path" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "errorCode" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
