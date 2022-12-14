import axios, { AxiosResponse } from 'axios';

import {
  Transaction,
  TransactionCreatePayload,
  TransactionDetail,
  TransactionUpdatePayload,
} from '../types';

const api = axios.create({
  baseURL: process.env.API_URL ?? 'https://psl-mock-api.herokuapp.com',
});

export const getTransactions = () => api.get<Transaction[]>('/transactions');

export const addTransaction = (transaction: TransactionCreatePayload) =>
  api.post<Transaction, AxiosResponse<Transaction>>(
    '/transactions',
    transaction
  );

export const getTransaction = (id: number) =>
  api.get<TransactionDetail>(`/transactions/${id}`);

export const updateTransaction = (
  id: number,
  payload: TransactionUpdatePayload
) =>
  api.patch<Transaction, AxiosResponse<TransactionDetail>>(
    `/transactions/${id}`,
    payload
  );

export const deleteTransaction = (id: number) =>
  api.delete(`/transactions/${id}`);
