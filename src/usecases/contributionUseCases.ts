import { ContributionRepo } from "../infrastructure/contributionRepoPrisma";
import { SavingRepository } from "../infrastructure/savingRepoPrisma";

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
    throw new Error(
      `Saving with ID ${contributionData.savingId} not found for user`
    );
  }

  const contributedAmount = saving.contributedAmount;
  const amountToAdd = contributionData.amount;
  if (
    amountToAdd > +saving.targetAmount - +contributedAmount ||
    amountToAdd > +saving.targetAmount ||
    amountToAdd <= 0
  ) {
    throw new Error(
      `Invalid contribution amount, please ensure your contribution does not exceed the goal and make sure that it is greater than 0`
    );
  }

  // update current ammount
  savingRepo.updateSaving(contributionData.userId, contributionData.savingId, {
    contributedAmount: +contributedAmount + amountToAdd,
  });

  // add contribution
  const contribution = await contributionRepo.addContribution({
    amount: amountToAdd,
    savingId: contributionData.savingId,
  });

  if (!contribution) return null;

  return contribution;
};
