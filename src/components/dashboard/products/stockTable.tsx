import React, { ChangeEvent, useEffect, useState } from 'react';
import { Size } from '@/app/size/type';
import { apiService } from '@/axios/axios-interceptor';
import { Add, CopyAll, Delete, Save } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

interface RowData {
  id?: string;
  size: string;
  price: string | number;
  rrp_price: string | number;
  usd_price: string | number;
  currency: string;
  quantity: string;
  pre_quantity: string;
  productCode: string;
}

interface StockTableProps {
  rows: RowData[];
  setRows: (rows: any) => void;
  productCode: string;
  editVariant?: boolean;
  handleSave?: () => void;
}

const StockTable: React.FC<StockTableProps> = ({ rows, setRows, productCode, editVariant = false, handleSave }) => {
  const [error, setError] = useState<string | null>(null);
  const [sizeList, setSizeList] = useState<Size[]>([]);

  const handleAddRow = () => {
    setRows([...rows, { size: '', price: '',rrp_price:'', quantity: '',pre_quantity:'', productCode: productCode }]);
  };

  const handleInputChange = (index: number, field: keyof RowData, value: string) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleCopyPrice = () => {
    const firstRowPrice = rows[0].price;
    const firstRowCurrency = rows[0].currency;
    const newRows = rows.map((row, index) =>
      index === 0 ? row : { ...row, price: firstRowPrice, currency: firstRowCurrency }
    );
    setRows(newRows);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
  };

  const checkForDuplicates = () => {
    const sizeSet = new Set();
    for (const row of rows) {
      if (sizeSet.has(row.size)) {
        setError(`Duplicate size detected: ${row.size}`);
        return true;
      }
      sizeSet.add(row.size);
    }
    setError(null);
    return false;
  };

  const handleSaveClick = () => {
    if (checkForDuplicates()) {
      return;
    }
    if (handleSave) {
      handleSave();
    }
  };
  const fetchSize = async () => {
    const { data } = await apiService.get('size');
    setSizeList(data);
  };
  useEffect(() => {
    fetchSize();
  }, []);
  return (
    <Box sx={{ padding: 2 }}>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow>
            <TableCell>Size</TableCell>
            <TableCell>WSP Price</TableCell>
            <TableCell>RRP Price</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Next Arrival</TableCell>
            <TableCell>Product Code</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows &&
            rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Size</InputLabel>

                    <Select
                      label="Age"
                      value={row.size}
                      onChange={(e) => handleInputChange(index, 'size', e.target.value)}
                    >
                      {sizeList?.map((s, i) => (
                        <MenuItem key={i} value={s.size}>
                          {s.size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>WSP Price</InputLabel>
                    <OutlinedInput
                      value={row.price}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, 'price', e.target.value)}
                      label="WSP Price"
                      name="price"
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>RRP Price</InputLabel>
                    <OutlinedInput
                      value={row.rrp_price}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(index, 'rrp_price', e.target.value)}
                      label="RRP Price"
                      name="rrp_price"
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>

                    <Select
                      label="Currency"
                      value={row.currency}
                      onChange={(e) => handleInputChange(index, 'currency', e.target.value)}
                    >
                      <MenuItem value={'THB'}>THB</MenuItem>
                      <MenuItem value={'USD'}>USD</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Quantity</InputLabel>
                    <OutlinedInput
                      value={row.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(index, 'quantity', e.target.value)
                      }
                      label="Quantity"
                      name="quantity"
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <InputLabel>Next Arrival</InputLabel>
                    <OutlinedInput
                      value={row.pre_quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(index, 'pre_quantity', e.target.value)
                      }
                      label="Next Arrival"
                      name="pre_quantity"
                    />
                  </FormControl>
                </TableCell>
                <TableCell>
                  <FormControl fullWidth>
                    <h4>{row.productCode + row.size}</h4>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleRemoveRow(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {editVariant ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddRow}>
            Add Row
          </Button>
          <Button className="ml-4" variant="contained" startIcon={<Save />} onClick={handleSaveClick}>
            Save
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="contained" startIcon={<CopyAll />} onClick={handleCopyPrice}>
            Copy Price to All
          </Button>
          <Button variant="contained" startIcon={<Add />} onClick={handleAddRow}>
            Add Row
          </Button>
          <Button className="ml-4" variant="contained" startIcon={<Save />} onClick={handleSaveClick}>
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default StockTable;
