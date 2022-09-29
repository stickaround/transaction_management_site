import * as React from 'react';
import {
  Box,
  FormControl,
  TextField,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

type PropTypes = {
  filter: {
    merchant: string;
    type: string;
  };
  setFilter: React.Dispatch<
    React.SetStateAction<{
      merchant: string;
      type: string;
    }>
  >;
};

const types = [
  { label: 'All', value: 'ALL' },
  { label: 'Manual', value: 'MANUAL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Completed', value: 'COMPLETED' },
];

function TransactionFilter({ filter, setFilter }: PropTypes) {
  return (
    <Box sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
      <FormControl>
        <TextField
          label='Merchant'
          variant='outlined'
          name='merchant'
          value={filter.merchant}
          sx={{ mr: 4 }}
          onChange={(e) =>
            setFilter({ merchant: e.target.value, type: filter.type })
          }
        />
      </FormControl>
      <FormControl>
        <InputLabel id='type-filter-label'>Age</InputLabel>
        <Select
          labelId='type-filter-label'
          label='Type'
          name='type'
          value={filter.type}
          onChange={(e) =>
            setFilter({ type: e.target.value, merchant: filter.merchant })
          }
          sx={{ mr: 4 }}
        >
          {types.map((type, index) => (
            <MenuItem key={type.value + index} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export { TransactionFilter };
