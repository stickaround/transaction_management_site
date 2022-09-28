export type Transaction = {
  id: number;
  amount: number;
  currency: string;
  datetime: string;
  merchant: {
    name: string;
  };
  status: 'MANUAL' | 'PENDING' | 'COMPLETED';
  type: 'DEBIT' | 'CREDIT';
};

export type TransactionStateType = {
  loading: boolean;
  transactions: Transaction[];
  transaction: Transaction | null;
};
