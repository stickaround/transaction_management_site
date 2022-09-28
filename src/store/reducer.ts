import { combineReducers } from '@reduxjs/toolkit';

import transactionReducer from '../pages/transactions/transactionSlice';

const rootReducer = combineReducers({
  transaction: transactionReducer,
});

export default rootReducer;
