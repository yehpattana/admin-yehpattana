'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import AddIcon from '@mui/icons-material/Add';
import {
  Alert,
  Box,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import 'react-color-palette/css';

import { Trash } from '@phosphor-icons/react';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Size } from './type';

export default function Page(): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [sizeList, setSizeList] = useState<Size[]>([]);
  const [sizeName, setSizeName] = useState<string>('');
  const [isAddSize, iseIsAddSize] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [sizeId, setSizeId] = useState<number|null>();
  
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const fetchSize = async () => {
    const { data } = await apiService.get('size');
    setSizeList(data);
  };
  const handleAddSize = async () => {
    const isDuplicate = sizeList?.find((s) => s.size === sizeName);
    if (isDuplicate) {
      setError(`Duplicate size detected: ${sizeName}`);
      toast.error('duplicate size');
    } else {
      const { data } = await apiService.post('size', { size: sizeName });
      if (data.success) {
        setSizeName('');
        iseIsAddSize(false);
        setError(null);
        fetchSize();
        toast.success(data.message)
      }
    }
  };
  const handleRemoveSize = async () => {
    const { data } = await apiService._delete(`size/${sizeId}`);
    if (data.success) {
      toast.success(data.message);
      fetchSize();
      setSizeId(null)
      setOpenModal(false)
    }else{
      toast.error(data.message);
      setSizeId(null)
      setOpenModal(false)
    }
  };
  

  useEffect(() => {
    fetchSize();
  }, []);
  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        <>
          <Grid lg={12} md={12} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title="Size"
                action={
                  <IconButton aria-label="settings" onClick={() => iseIsAddSize(true)}>
                    <AddIcon /> <Typography>Add</Typography>
                  </IconButton>
                }
              />
              <Divider />
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Size</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sizeList?.map((size, i) => {
                      return (
                        <>
                          <TableRow hover key={size.id}>
                            <TableCell>{size.size}</TableCell>
                            <TableCell>
                              <Button onClick={() => {setSizeId(size.id);setOpenModal(true)}}>
                                <Trash width={20} height={20} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        </>
                      );
                    })}
                    {isAddSize && (
                      <TableRow hover>
                        <TableCell>
                          <FormControl fullWidth>
                            <InputLabel>Size Name</InputLabel>
                            <OutlinedInput
                              defaultValue=""
                              onChange={(e) => {
                                setSizeName(e.target.value);
                              }}
                              label="Size Name"
                            />
                          </FormControl>
                        </TableCell>

                        <TableCell>
                          <Button onClick={handleAddSize}>Add</Button>
                          <Button
                            onClick={() => {
                              iseIsAddSize(false);
                            }}
                          >
                            Cancle
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Box>
              <Divider />
            </Card>
          </Grid>
        </>
      </Grid>
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveSize} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer/>
    </>
  );
}
