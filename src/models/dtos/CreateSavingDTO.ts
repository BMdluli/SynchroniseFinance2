export interface CreateSavingDto {
  userId: number;
  name: string;
  targetAmount: number;
  contributedAmount: number;
  targetDate: Date;
}
