export type Transaction = {
  id?: number;
  amount: number;
  currency?: string;
  datetime?: string;
  merchant: {
    name: string;
    category?: string;
    country?: string;
  };
  status?: 'MANUAL' | 'PENDING' | 'COMPLETED';
  type: 'DEBIT' | 'CREDIT';
  reference?: string;
  remarks?: string;
};

export type TransactionStateType = {
  loading: boolean;
  adding: boolean;
  transactions: Transaction[];
  transaction: Transaction | null;
};
