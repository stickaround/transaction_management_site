import { Box, Drawer, Typography, Chip, IconButton } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { getStatusColor } from '../../helper/index';
import { TransactionDetail } from '../../types/index';

type PropTypes = {
  open: boolean;
  transaction: TransactionDetail | null;
  onClose: () => void;
};

function TransactionDetailDrawer(props: PropTypes) {
  const { open, transaction, onClose } = props;

  return (
    <Drawer anchor='right' open={open} onClose={onClose}>
      <Box
        sx={{ width: '600px', marginTop: '200px', marginX: '40px' }}
        role='presentation'
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h3' color='primary' sx={{ mr: 3 }}>
            Transaction Details
          </Typography>
          {transaction?.status === 'MANUAL' && (
            <IconButton aria-label='edit'>
              <EditIcon sx={{ fontSize: 30 }} />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Date & Time
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            {transaction?.datetime}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Merchant
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            {transaction?.merchant.name}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Amount (HKD)
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            {`${transaction?.type === 'DEBIT' ? '-' : ''}${
              transaction?.amount
            }`}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Status
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            <Chip
              label={transaction?.status}
              color={getStatusColor(transaction?.status ?? '')}
            />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Reference
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            {transaction?.reference}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '20px' }}>
          <Typography variant='h4' component='div' sx={{ mr: '50px' }}>
            Remarks
          </Typography>
          <Typography variant='h5' color='text.secondary'>
            {transaction?.remarks}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

export { TransactionDetailDrawer };
