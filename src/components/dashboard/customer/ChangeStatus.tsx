'use client';

import { useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute' as 'absolute',
  display: 'flex',
  flexDirection: 'collumn',

  top: '55%',
  right: '-5%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
interface changeStatusProp {
  id: string | number;
  status: boolean;
  handleClick: any;
}
export default function ChangeStatus(prop: changeStatusProp) {
  const { id, status, handleClick } = prop;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button onClick={handleOpen}>{status == false ? 'inactive' : 'active'} </Button> */}
      <Typography onClick={handleOpen} variant="button" display="block" sx={{ color: '#635bfe' }} gutterBottom>
        {status == false ? 'inactive' : 'active'}
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            display: 'flex',
            flexDirection: 'column',

            borderRadius: '15px',

            top: '40%',
            right: '0',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleClick(`users/verify-user/${id}`), setOpen(false);
            }}
            sx={{ marginBottom: 1 }}
          >
            Active
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleClick(`users/ban-user/${id}`, setOpen(false));
            }}
          >
            Inactive
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
