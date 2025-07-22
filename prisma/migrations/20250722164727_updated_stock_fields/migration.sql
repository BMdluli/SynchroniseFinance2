/*
  Warnings:

  - Added the required column `portfolioId` to the `Stock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shares` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Stock" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "symbol" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "purchacePrice" DECIMAL NOT NULL,
    "shares" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "portfolioId" INTEGER NOT NULL,
    CONSTRAINT "Stock_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "Portfolio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Stock" ("companyName", "createdAt", "id", "imageUrl", "purchacePrice", "symbol", "updatedAt") SELECT "companyName", "createdAt", "id", "imageUrl", "purchacePrice", "symbol", "updatedAt" FROM "Stock";
DROP TABLE "Stock";
ALTER TABLE "new_Stock" RENAME TO "Stock";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
