import { Contribution } from "./Contribution";

export interface Saving {
  id?: number;
  name: string;
  targetAmount: number;
  contributedAmount: number;
  targetDate: Date;

  contribution: [Contribution];
}
