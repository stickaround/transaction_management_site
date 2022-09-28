import * as React from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  colors,
  Typography,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { Loader } from '../../core/Loader';
import { TransactionAddModal } from './TransactionAddModal';
import {
  getTransactionsSync,
  deleteTransactionSync,
  selectTransactions,
  selectTransactionLoading,
} from './transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';

function getStatusColor(status: string): 'info' | 'warning' | 'success' {
  switch (status) {
    case 'MANUAL':
      return 'info';
    case 'PENDING':
      return 'warning';
    case 'COMPLETED':
      return 'success';
    default:
      return 'info';
  }
}

function Transaction() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const loading = useAppSelector(selectTransactionLoading);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    dispatch(getTransactionsSync());
  }, [dispatch]);

  const handleAddTransaction = () => {
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    confirmAlert({
      title: 'Are you sure to delete this transaction?',
      buttons: [
        {
          label: 'OK',
          onClick: () => {
            dispatch(deleteTransactionSync(id))
              .unwrap()
              .then(() => {
                dispatch(getTransactionsSync());
              });
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return loading ? (
    <Loader />
  ) : (
    <Container sx={{ my: '70px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography component='h1' variant='h3' sx={{ my: '20px' }}>
          Transactions
        </Typography>
        <Button
          sx={{ ml: 'auto' }}
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleAddTransaction}
        >
          Add new transaction
        </Button>
      </Box>
      <Paper>
        <Table sx={{ minWidth: 800 }} aria-label='transaction_table'>
          <TableHead sx={{ fontSize: '18px' }}>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Merchant</TableCell>
              <TableCell align='right'>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align='center'>...</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction, index) => (
              <TableRow key={transaction.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{transaction.datetime}</TableCell>
                <TableCell>{transaction.merchant.name}</TableCell>
                <TableCell
                  align='right'
                  sx={{
                    color:
                      transaction.type === 'CREDIT' ? colors.green[500] : '',
                  }}
                >
                  <span color='success'>
                    {`${
                      transaction.type === 'DEBIT' ? '-' : ''
                    }${transaction.amount.toFixed(2)}`}
                  </span>
                </TableCell>
                <TableCell>
                  <Chip
                    label={transaction.status}
                    color={getStatusColor(transaction.status ?? '')}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton
                    aria-label='edit'
                    disabled={transaction.status !== 'MANUAL'}
                    sx={{ zIndex: 0 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    disabled={transaction.status !== 'MANUAL'}
                    onClick={() => handleDelete(transaction.id ?? 0)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <TransactionAddModal open={isModalOpen} onClose={handleCloseModal} />
    </Container>
  );
}

export { Transaction };
