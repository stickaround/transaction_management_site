import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getTransactions,
  addTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from '../../services/api';
import { RootState } from '../../store';
import {
  TransactionStateType,
  TransactionCreatePayload,
  TransactionUpdatePayload,
} from '../../types';

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

export const updateTransactionSync = createAsyncThunk(
  '/transaction/updateTransaction',
  async ({
    id,
    payload,
  }: {
    id: number;
    payload: TransactionUpdatePayload;
  }) => {
    const { data: transaction } = await updateTransaction(id, payload);
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
      })
      .addCase(addTransactionSync.rejected, (state, action) => {
        state.adding = false;
      })
      .addCase(getTransactionSync.pending, (state) => {})
      .addCase(getTransactionSync.fulfilled, (state, action) => {
        state.transaction = action.payload.transaction;
      })
      .addCase(getTransactionSync.rejected, (state, action) => {})
      .addCase(updateTransactionSync.pending, (state) => {
        state.adding = true;
      })
      .addCase(updateTransactionSync.fulfilled, (state, action) => {
        state.adding = false;
        const index = state.transactions.findIndex(
          (item) => item.id === action.payload.transaction.id
        );
        state.transactions.splice(index, 1, action.payload.transaction);
      })
      .addCase(updateTransactionSync.rejected, (state, action) => {
        state.adding = false;
      })
      .addCase(deleteTransactionSync.pending, (state) => {
        state.loading = false;
      })
      .addCase(deleteTransactionSync.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTransactionSync.rejected, (state, action) => {
        state.loading = false;
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
