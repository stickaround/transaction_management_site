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
  Snackbar,
  Alert,
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
import { TransactionDetailDrawer } from './TransactionDetailDrawer';
import { TransactionEditDrawer } from './TransactionEditDrawer';
import { TransactionFilter } from './TransactionFilter';
import {
  getTransactionsSync,
  getTransactionSync,
  deleteTransactionSync,
  selectTransactions,
  selectTransaction,
  selectTransactionLoading,
} from './transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Transaction as TransactionType } from '../../types/index';
import { getStatusColor } from '../../helper/index';

function Transaction() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectTransactions);
  const transaction = useAppSelector(selectTransaction);
  const loading = useAppSelector(selectTransactionLoading);
  const [filter, setFilter] = React.useState<{
    merchant: string;
    type: string;
  }>({
    merchant: '',
    type: 'ALL',
  });
  const [filteredTransactions, setFilteredTransactions] = React.useState<
    TransactionType[]
  >([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = React.useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = React.useState(false);
  const [snackbarOptions, setSnackbarOptions] = React.useState<{
    open: boolean;
    severity: 'success' | 'error';
    message: string;
  }>({
    open: false,
    severity: 'success',
    message: '',
  });

  React.useEffect(() => {
    dispatch(getTransactionsSync());
  }, [dispatch]);

  React.useEffect(() => {
    const filtered =
      filter.type === 'ALL'
        ? transactions.filter((item) =>
            item.merchant.name
              .toLowerCase()
              .includes(filter.merchant.toLowerCase())
          )
        : transactions.filter(
            (item) =>
              item.merchant.name
                .toLowerCase()
                .includes(filter.merchant.toLowerCase()) &&
              item.status === filter.type
          );
    setFilteredTransactions(filtered);
  }, [filter, transactions]);

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleDetail = (id: number) => {
    dispatch(getTransactionSync(id))
      .unwrap()
      .then(() => {
        setIsDetailDrawerOpen(true);
      });
  };

  const handleEdit = (id: number) => {
    dispatch(getTransactionSync(id))
      .unwrap()
      .then(() => {
        setIsDetailDrawerOpen(false);
        setIsEditDrawerOpen(true);
      });
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
              .then((res) => {
                setSnackbarOptions({
                  open: true,
                  severity: 'success',
                  message: res,
                });
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

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOptions({
      open: false,
      severity: 'success',
      message: '',
    });
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
          onClick={handleAdd}
        >
          Add new transaction
        </Button>
      </Box>
      <TransactionFilter filter={filter} setFilter={setFilter} />
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
            {filteredTransactions.map((transaction, index) => (
              <TableRow
                key={transaction.id}
                onClick={(e) => handleDetail(transaction.id)}
                sx={{ cursor: 'pointer' }}
                hover
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {new Date(transaction.datetime).toDateString()}
                </TableCell>
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
                    color={getStatusColor(transaction.status)}
                  />
                </TableCell>
                <TableCell align='center'>
                  <IconButton
                    aria-label='edit'
                    disabled={transaction.status !== 'MANUAL'}
                    sx={{ zIndex: 0 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(transaction.id);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label='delete'
                    disabled={transaction.status !== 'MANUAL'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(transaction.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <TransactionAddModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        setSnackbarOptions={setSnackbarOptions}
      />
      <TransactionDetailDrawer
        open={isDetailDrawerOpen}
        transaction={transaction}
        onClose={() => setIsDetailDrawerOpen(false)}
        onEdit={() => handleEdit(transaction?.id ?? 0)}
      />
      <TransactionEditDrawer
        open={isEditDrawerOpen}
        transaction={transaction}
        onClose={() => setIsEditDrawerOpen(false)}
        setSnackbarOptions={setSnackbarOptions}
      />
      <Snackbar
        open={snackbarOptions.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          sx={{ width: '100%' }}
          variant='filled'
          severity={snackbarOptions.severity}
          onClose={handleCloseSnackbar}
        >
          {snackbarOptions.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export { Transaction };
