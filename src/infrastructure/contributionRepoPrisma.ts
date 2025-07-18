import { prisma } from "../config/prisma";

export class ContributionRepo {
  async addContribution(userData: { amount: number; savingId: number }) {
    return await prisma.contribution.create({
      data: userData,
    });
  }
}
