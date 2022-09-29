import * as React from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
  addTransactionSync,
  selectTransactionAdding,
} from './transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { Transaction } from '../../types';

type TransactionModalPropTypes = {
  open: boolean;
  onClose: () => void;
  setSnackbarOptions: ({
    open,
    severity,
    message,
  }: {
    open: boolean;
    severity: 'success' | 'error';
    message: string;
  }) => void;
};

const transactionTypes = [
  { label: 'Debit', value: 'DEBIT' },
  { label: 'Credit', value: 'CREDIT' },
];

function TransactionAddModal(props: TransactionModalPropTypes) {
  const dispatch = useAppDispatch();
  const adding = useAppSelector(selectTransactionAdding);
  const { open, onClose, setSnackbarOptions } = props;

  const transactionAddFormData = useFormik({
    initialValues: {
      amount: 0,
      merchant: '',
      type: '',
      reference: '',
      remarks: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number().positive().required('Amount is required!'),
      merchant: Yup.string().required('Merchant name is required!'),
      type: Yup.string().required('Type is required!'),
    }),
    onSubmit: (values) => {
      const { amount, merchant, type, reference, remarks } = values;
      if (!type) return;

      dispatch(
        addTransactionSync({
          amount,
          merchant: {
            name: merchant,
          },
          type: type as Transaction['type'],
          reference,
          remarks,
        })
      )
        .unwrap()
        .then(() => {
          setSnackbarOptions({
            open: true,
            severity: 'success',
            message: 'Successfully created!',
          });
          transactionAddFormData.resetForm();
          onClose();
        })
        .catch(() => {
          setSnackbarOptions({
            open: true,
            severity: 'error',
            message: 'Creation failed!',
          });
        });
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title' variant='h4'>
        Add a new transaction
      </DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={transactionAddFormData.handleSubmit}>
          <FormControl fullWidth sx={{ my: 4 }}>
            <TextField
              id='amount'
              label='Amount'
              name='amount'
              variant='outlined'
              type='number'
              error={
                !!transactionAddFormData.errors.amount &&
                transactionAddFormData.touched.amount
              }
              helperText={
                transactionAddFormData.touched.amount &&
                transactionAddFormData.errors.amount
              }
              onChange={transactionAddFormData.handleChange}
              value={transactionAddFormData.values.amount}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              id='merchant'
              label='Merchant'
              name='merchant'
              variant='outlined'
              error={
                !!transactionAddFormData.errors.merchant &&
                transactionAddFormData.touched.merchant
              }
              helperText={
                transactionAddFormData.touched.merchant &&
                transactionAddFormData.errors.merchant
              }
              onChange={transactionAddFormData.handleChange}
              value={transactionAddFormData.values.merchant}
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ mb: 4 }}
            error={
              !!transactionAddFormData.errors.type &&
              transactionAddFormData.touched.type
            }
          >
            <InputLabel id='type-label'>Type</InputLabel>
            <Select
              labelId='type-label'
              label='Type'
              id='type'
              name='type'
              value={transactionAddFormData.values.type}
              onChange={transactionAddFormData.handleChange}
            >
              {transactionTypes.map((type, index) => (
                <MenuItem key={type.value + index} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {!!transactionAddFormData.errors.type &&
              transactionAddFormData.touched.type && (
                <FormHelperText>
                  {transactionAddFormData.touched.type &&
                    transactionAddFormData.errors.type}
                </FormHelperText>
              )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              id='reference'
              label='Reference'
              name='reference'
              variant='outlined'
              onChange={transactionAddFormData.handleChange}
              value={transactionAddFormData.values.reference}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              id='remarks'
              label='Remarks'
              name='remarks'
              variant='outlined'
              multiline
              rows={3}
              onChange={transactionAddFormData.handleChange}
              value={transactionAddFormData.values.remarks}
            />
          </FormControl>
          <FormControl>
            <Button
              type='submit'
              variant='contained'
              startIcon={<SendIcon />}
              disabled={adding}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export { TransactionAddModal };
