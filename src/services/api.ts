import axios from 'axios';

import { Transaction } from '../types';

const api = axios.create({
  baseURL: process.env.API_URL ?? 'https://psl-mock-api.herokuapp.com',
});

export const getTransactions = () => api.get<Transaction[]>('/transactions');
