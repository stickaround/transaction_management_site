import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toast';

import { getTransactions } from '../../services/api';
import { RootState } from '../../store';
import { TransactionStateType } from '../../types';

const initialState: TransactionStateType = {
  transactions: [],
  transaction: null,
  loading: false,
};

export const getTransactionsSync = createAsyncThunk(
  '/transaction/getTransactions',
  async () => {
    const { data: transactions } = await getTransactions();
    return { transactions };
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
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
      })
      .addCase(getTransactionsSync.rejected, (state, action) => {
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
export const selectTransactions = (state: RootState) =>
  state.transaction.transactions;

// Reducer
const transactionReducer = transactionSlice.reducer;
export default transactionReducer;
