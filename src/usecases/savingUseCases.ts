import { CreateSavingDto } from "../domain/dtos/CreateSavingDTO";
import { SavingRepository } from "../infrastructure/savingRepoPrisma";
import { AppError } from "../utils/AppError";

const savingRepo = new SavingRepository();

export const createSaving = async (savingData: CreateSavingDto) => {
  const saving = await savingRepo.createSaving(savingData);

  if (!saving) {
    throw new AppError("Failed to create saving", 500);
  }

  return saving;
};

export const updateSaving = async (
  savingId: number,
  userId: number,
  updateData: Partial<{
    name: string;
    targetAmount: number;
    contributedAmount: number;
    targetDate: Date;
  }>
) => {
  const updated = await savingRepo.updateSaving(userId, savingId, updateData);

  if (!updated) {
    throw new AppError("Saving not found or unauthorized", 404);
  }

  return updated;
};

export const getSaving = async (savingId: number, userId: number) => {
  const saving = await savingRepo.getOne(userId, savingId);

  if (!saving) {
    throw new AppError("Saving not found", 404);
  }

  return saving;
};

export const deleteSaving = async (savingId: number, userId: number) => {
  const saving = await savingRepo.getOne(userId, savingId);

  if (!saving) {
    throw new AppError("Saving not found or unauthorized", 404);
  }

  await savingRepo.deleteOne(savingId);
};
