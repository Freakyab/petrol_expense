export interface DailyRecord {
  _id?: string;
  date: string;
  isCarUsed: boolean;
  distanceTravel?: number;
  avgKmpl?: number;
  petrolExpense?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
