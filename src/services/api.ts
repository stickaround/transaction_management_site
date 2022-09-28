import axios, { AxiosResponse } from 'axios';

import { Transaction } from '../types';

const api = axios.create({
  baseURL: process.env.API_URL ?? 'https://psl-mock-api.herokuapp.com',
});

export const getTransactions = () => api.get<Transaction[]>('/transactions');

export const addTransaction = (transaction: Transaction) =>
  api.post<Transaction, AxiosResponse<Transaction>>(
    '/transactions',
    transaction
  );
