import { CreateSavingDto } from "../domain/dtos/CreateSavingDTO";
import { SavingRepository } from "../infrastructure/savingRepoPrisma";

const savingRepo = new SavingRepository();

export const createSaving = async (savingData: CreateSavingDto) => {
  const saving = await savingRepo.createSaving(savingData);

  if (!saving) return null;

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
  return updated;
};

export const getSaving = async (savingId: number, userId: number) => {
  const saving = await savingRepo.getOne(userId, savingId);

  if (!saving) return null;
  console.log("GET SAVING _> ", saving);

  if (saving.contributions) return saving;
};

export const deleteSaving = async (savingId: number, userId: number) => {
  const saving = await savingRepo.getOne(userId, savingId);

  if (!saving) return false;

  await savingRepo.deleteOne(savingId);
  return true;
};
