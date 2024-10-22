'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import {
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ColorPicker, useColor } from 'react-color-palette';

import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-color-palette/css';

import { Trash } from '@phosphor-icons/react';

import { Color } from './type';

export default function Page(): React.JSX.Element {
  const [color, setColor] = useColor('#FFFFF');
  const [colorList, setColorList] = useState<Color[]>([]);
  const [colorName, setColorName] = useState<string>('');
  const [colorId, setColorId] = useState<number|null>();
  const [colorCodeName, setColorCodeName] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const fetchColor = async () => {
    const { data } = await apiService.get('color');
    setColorList(data);
  };
  const handleAddColor = async () => {
    colorName.split('#');
    const { data } = await apiService.post('color', { name: colorName, code: color.hex, code_name: colorCodeName });
    if (data.success) {
      toast.success(data.message);
      fetchColor();
    }
  };
  
  const handleRemoveColor = async () => {
    const  {data}  = await apiService._delete(`color/${colorId}`);
    if (data.success) {
      toast.success(data.message);
      fetchColor();
      setColorId(null)
      setOpenModal(false)
    }else{
      toast.error(data.message);
      setColorId(null)
      setOpenModal(false)
    }
  };


  useEffect(() => {
    fetchColor();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ marginBottom: '2rem', width: '50%' }}>
          <ColorPicker color={color} hideInput={['rgb', 'hsv']} onChange={setColor} />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '2rem',
          }}
        >
          <div
            style={{
              backgroundColor: color.hex,
              width: '10rem',
              height: '10rem',
              borderRadius: '10px',
              marginBottom: '2rem',
            }}
          ></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <label style={{ marginRight: '2rem' }}>Code</label>
            <input type="text" onChange={(e) => setColorName(e.target.value)} />
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <label style={{ marginRight: '2rem' }}>Name</label>
            <input type="text" onChange={(e) => setColorCodeName(e.target.value)} />
          </div>
          <div style={{ marginTop: '2rem' }}>
            <button
              style={{
                cursor: 'pointer',
                backgroundColor: 'white',
                border: `1px solid ${color.hex}`,
                padding: '10px',
                borderRadius: '4px',
                color: color.hex,
              }}
              onClick={handleAddColor}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <Grid lg={12} md={12} xs={12}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Color" />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Color Code</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {colorList?.map((c, i) => {
                  return (
                      <TableRow hover key={c.id}>
                        <TableCell>{c.name}</TableCell>
                        <TableCell>{c.codeName}</TableCell>
                        <TableCell>{c.code}</TableCell>
                        <TableCell>
                          <div
                            style={{ backgroundColor: c.code, width: '4rem', height: '4rem', borderRadius: '10px' }}
                          ></div>
                        </TableCell>
                        <TableCell>
                          {/* <Button onClick={() => setOpenModal(true)}> */}
                          <Button
                            onClick={() => {
                              setOpenModal(true);
                              setColorId(c.id);
                            }}
                          >
                            <Trash />
                          </Button>
                        </TableCell>
                      </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
          <Divider />
        </Card>
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
          <Button onClick={handleRemoveColor} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </>
  );
}
