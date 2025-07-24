/*
  Warnings:

  - A unique constraint covering the columns `[symbol,portfolioId]` on the table `Stock` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Stock_symbol_key";

-- CreateIndex
CREATE UNIQUE INDEX "Stock_symbol_portfolioId_key" ON "Stock"("symbol", "portfolioId");
