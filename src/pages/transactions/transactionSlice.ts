import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toast';

import {
  getTransactions,
  addTransaction,
  getTransaction,
  deleteTransaction,
} from '../../services/api';
import { RootState } from '../../store';
import { TransactionStateType, TransactionCreatePayload } from '../../types';

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
  async (payload: TransactionCreatePayload) => {
    const { data: transaction } = await addTransaction(payload);
    return { transaction };
  }
);

export const getTransactionSync = createAsyncThunk(
  '.transaction/getTransaction',
  async (id: number) => {
    const { data: transaction } = await getTransaction(id);
    return { transaction };
  }
);

export const deleteTransactionSync = createAsyncThunk(
  '/transaction/deleteTransaction',
  async (id: number) => {
    const { data } = await deleteTransaction(id);
    return data;
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
      })
      .addCase(getTransactionSync.pending, (state) => {})
      .addCase(getTransactionSync.fulfilled, (state, action) => {
        state.transaction = action.payload.transaction;
      })
      .addCase(getTransactionSync.rejected, (state, action) => {
        toast.error(action?.error?.message || 'Error');
      })
      .addCase(deleteTransactionSync.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteTransactionSync.fulfilled, (state, action) => {
        state.loading = false;
        toast.success(action.payload);
      })
      .addCase(deleteTransactionSync.rejected, (state, action) => {
        state.loading = false;
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
export const selectTransaction = (state: RootState) =>
  state.transaction.transaction;

// Reducer
const transactionReducer = transactionSlice.reducer;
export default transactionReducer;
