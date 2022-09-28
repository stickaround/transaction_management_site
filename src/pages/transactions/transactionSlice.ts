import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toast';

import { getTransactions, addTransaction } from '../../services/api';
import { RootState } from '../../store';
import { TransactionStateType } from '../../types';
import { Transaction } from '../../types/index';

const initialState: TransactionStateType = {
  transactions: [],
  transaction: null,
  loading: false,
  adding: false,
};

export const getTransactionsSync = createAsyncThunk(
  '/transaction/getTransactions',
  async () => {
    const { data: transactions } = await getTransactions();
    return { transactions };
  }
);

export const addTransactionSync = createAsyncThunk(
  '/transaction/addTransaction',
  async (payload: Transaction) => {
    const { data: transaction } = await addTransaction(payload);
    return { transaction };
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTransactionsSync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTransactionsSync.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions.sort(
          (a, b) =>
            new Date(b.datetime ?? '').getTime() -
            new Date(a?.datetime ?? '').getTime()
        );
      })
      .addCase(getTransactionsSync.rejected, (state, action) => {
        state.loading = false;
        toast.error(action?.error?.message || 'Error');
      })
      .addCase(addTransactionSync.pending, (state) => {
        state.adding = true;
      })
      .addCase(addTransactionSync.fulfilled, (state, action) => {
        state.adding = false;
        state.transactions = [
          action.payload.transaction,
          ...state.transactions,
        ];
        toast.success('Transaction added successfully!');
      })
      .addCase(addTransactionSync.rejected, (state, action) => {
        state.adding = false;
        toast.error(action?.error?.message || 'Error');
      });
  },
});

// Actions
export const transactionActions = transactionSlice.actions;

// Selectors
export const selectTransactionLoading = (state: RootState) =>
  state.transaction.loading;
export const selectTransactionAdding = (state: RootState) =>
  state.transaction.adding;
export const selectTransactions = (state: RootState) =>
  state.transaction.transactions;

// Reducer
const transactionReducer = transactionSlice.reducer;
export default transactionReducer;
