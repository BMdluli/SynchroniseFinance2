-- CreateTable
CREATE TABLE "Saving" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "targetAmount" DECIMAL NOT NULL,
    "contributedAmount" DECIMAL NOT NULL,
    "targetDate" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Saving_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savingId" INTEGER NOT NULL,
    CONSTRAINT "Contribution_savingId_fkey" FOREIGN KEY ("savingId") REFERENCES "Saving" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
