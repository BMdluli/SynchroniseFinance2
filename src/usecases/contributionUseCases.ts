import { ContributionRepo } from "../infrastructure/contributionRepoPrisma";
import { SavingRepository } from "../infrastructure/savingRepoPrisma";
import { AppError } from "../utils/AppError";

const contributionRepo = new ContributionRepo();
const savingRepo = new SavingRepository();

export const addContribution = async (contributionData: {
  amount: number;
  savingId: number;
  userId: number;
}) => {
  const saving = await savingRepo.getOne(
    contributionData.userId,
    contributionData.savingId
  );

  if (!saving) {
    throw new AppError(
      `Saving with ID ${contributionData.savingId} not found for user`,
      404
    );
  }

  const contributedAmount = saving.contributedAmount;
  const amountToAdd = contributionData.amount;

  if (
    amountToAdd > +saving.targetAmount - +contributedAmount ||
    amountToAdd > +saving.targetAmount ||
    amountToAdd <= 0
  ) {
    throw new AppError(
      `Invalid contribution amount: must not exceed target or be zero/negative`,
      400
    );
  }

  await savingRepo.updateSaving(
    contributionData.userId,
    contributionData.savingId,
    {
      contributedAmount: +contributedAmount + amountToAdd,
    }
  );

  const contribution = await contributionRepo.addContribution({
    amount: amountToAdd,
    savingId: contributionData.savingId,
  });

  if (!contribution) {
    throw new AppError("Failed to create contribution", 500);
  }

  return contribution;
};
