import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toast';

import { Layout } from './core/components/Layout';
import { Transaction } from './pages/transactions';

function TransactionRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <ToastContainer position='top-right' delay={2000} />
        <Routes>
          <Route path='/transactions' element={<Transaction />} />
          <Route path='*' element={<Navigate to='/transactions' replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export { TransactionRoutes as Routes };
