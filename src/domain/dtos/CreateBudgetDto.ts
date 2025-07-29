export interface CreateBudgetDto {
  name: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  userId: number;
}
