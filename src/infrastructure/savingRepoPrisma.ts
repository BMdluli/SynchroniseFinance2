import { prisma } from "../config/prisma";

export class SavingRepository {
  async getAll(userId: number) {
    return await prisma.saving.findMany({
      where: { userId },
    });
  }

  async getOne(userId: number, savingId: number) {
    return await prisma.saving.findFirst({
      where: {
        userId,
        id: savingId,
      },
    });
  }

  async createSaving(savingData: {
    name: string;
    targetAmount: number;
    contributedAmount: number;
    targetDate: Date;
    userId: number;
  }) {
    return await prisma.saving.create({
      data: savingData,
    });
  }

  async updateSaving(
    userId: number,
    savingId: number,
    updateData: Partial<{
      name: string;
      targetAmount: number;
      contributedAmount: number;
      targetDate: Date;
    }>
  ) {
    const saving = await prisma.saving.findFirst({
      where: { id: savingId, userId },
    });

    if (!saving) return null;

    return await prisma.saving.update({
      where: { id: savingId },
      data: updateData,
    });
  }

  async deleteOne(savingId: number) {
    return await prisma.saving.delete({
      where: {
        id: savingId,
      },
    });
  }
}
