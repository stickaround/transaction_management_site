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

export type TransactionCreatePayload = {
  amount: number;
  merchant: {
    name: string;
  };
  type: 'DEBIT' | 'CREDIT';
  reference: string;
  remarks: string;
};

export type TransactionDetail = Transaction & {
  reference: string;
  remarks: string;
};

export type TransactionStateType = {
  loading: boolean;
  adding: boolean;
  transactions: Transaction[];
  transaction: TransactionDetail | null;
};
