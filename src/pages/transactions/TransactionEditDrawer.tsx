import * as React from 'react';
import {
  Box,
  Drawer,
  Typography,
  FormControl,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { TransactionDetail, Transaction } from '../../types/index';
import {
  updateTransactionSync,
  selectTransactionAdding,
} from './transactionSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';

type PropTypes = {
  open: boolean;
  transaction: TransactionDetail | null;
  onClose: () => void;
};

const transactionTypes = [
  { label: 'Debit', value: 'DEBIT' },
  { label: 'Credit', value: 'CREDIT' },
];

function TransactionEditDrawer(props: PropTypes) {
  const { open, transaction, onClose } = props;
  const dispatch = useAppDispatch();
  const updating = useAppSelector(selectTransactionAdding);

  React.useEffect(() => {
    transactionEditFormData.setValues({
      amount: transaction?.amount,
      merchant: transaction?.merchant.name,
      type: transaction?.type,
      reference: transaction?.reference,
      remarks: transaction?.remarks,
    });
    // eslint-disable-next-line
  }, [transaction]);

  const transactionEditFormData = useFormik({
    initialValues: {
      amount: transaction?.amount,
      merchant: transaction?.merchant.name,
      type: transaction?.type,
      reference: transaction?.reference,
      remarks: transaction?.remarks,
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
        updateTransactionSync({
          id: transaction?.id ?? 0,
          payload: {
            amount: amount ?? 0,
            merchant: {
              name: merchant ?? '',
            },
            type: type as Transaction['type'],
            reference: reference,
            remarks: remarks,
          },
        })
      )
        .unwrap()
        .then(() => {
          transactionEditFormData.resetForm();
          onClose();
        });
    },
  });

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box
        sx={{ width: '600px', marginTop: '200px', marginX: '40px' }}
        role='presentation'
      >
        <Typography variant='h3' color='primary' sx={{ mr: 3 }}>
          Transaction Edit
        </Typography>
        <Box component='form' onSubmit={transactionEditFormData.handleSubmit}>
          <FormControl fullWidth sx={{ my: 4 }}>
            <TextField
              id='amount'
              label='Amount'
              name='amount'
              variant='outlined'
              type='number'
              error={
                !!transactionEditFormData.errors.amount &&
                transactionEditFormData.touched.amount
              }
              helperText={
                transactionEditFormData.touched.amount &&
                transactionEditFormData.errors.amount
              }
              onChange={transactionEditFormData.handleChange}
              value={transactionEditFormData.values.amount}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              id='merchant'
              label='Merchant'
              name='merchant'
              variant='outlined'
              error={
                !!transactionEditFormData.errors.merchant &&
                transactionEditFormData.touched.merchant
              }
              helperText={
                transactionEditFormData.touched.merchant &&
                transactionEditFormData.errors.merchant
              }
              onChange={transactionEditFormData.handleChange}
              value={transactionEditFormData.values.merchant}
            />
          </FormControl>
          <FormControl
            fullWidth
            sx={{ mb: 4 }}
            error={
              !!transactionEditFormData.errors.type &&
              transactionEditFormData.touched.type
            }
          >
            <InputLabel id='type-label'>Type</InputLabel>
            <Select
              labelId='type-label'
              label='Type'
              id='type'
              name='type'
              value={transactionEditFormData.values.type}
              onChange={transactionEditFormData.handleChange}
            >
              {transactionTypes.map((type, index) => (
                <MenuItem key={type.value + index} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {!!transactionEditFormData.errors.type &&
              transactionEditFormData.touched.type && (
                <FormHelperText>
                  {transactionEditFormData.touched.type &&
                    transactionEditFormData.errors.type}
                </FormHelperText>
              )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <TextField
              id='reference'
              label='Reference'
              name='reference'
              variant='outlined'
              onChange={transactionEditFormData.handleChange}
              value={transactionEditFormData.values.reference}
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
              onChange={transactionEditFormData.handleChange}
              value={transactionEditFormData.values.remarks}
            />
          </FormControl>
          <FormControl>
            <Button
              type='submit'
              variant='contained'
              startIcon={<SendIcon />}
              disabled={updating}
            >
              Submit
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Drawer>
  );
}

export { TransactionEditDrawer };
