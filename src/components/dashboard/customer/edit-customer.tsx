import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Modal from '@mui/material/Modal';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import { GridRowId } from '@mui/x-data-grid';

import { b2bUserInterface } from '@/types/user';

interface EditCustomerProps {
  gridId: GridRowId;
  customerId: string;
  handleSubmit: any;
  handleDeleteUser: any;
}

export default function EditCustomer(data: EditCustomerProps) {
  const { gridId, handleSubmit, customerId,handleDeleteUser } = data;
  const [users, setUsers] = useState<b2bUserInterface>(initUser);
  const [open, setOpen] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getUsers = async () => {
    try {
      const response = await apiService.get(`/users/${gridId}`);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUsers({ ...users, [name]: value });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <BorderColorIcon onClick={handleOpen} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton onClick={handleClose} sx={closeBtn}>
            <CloseIcon />
          </IconButton>
          <form id="createUser">
            <Card>
              <CardHeader subheader="The information can be edited" title="Profile" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Company name</InputLabel>
                      <OutlinedInput
                        value={users?.company_name ? users?.company_name : ''}
                        label="company_name"
                        name="company_name"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Contact Name</InputLabel>
                      <OutlinedInput
                        value={users?.contact_name ? users?.contact_name : ''}
                        label="contact_name"
                        name="contact_name"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>VAT number</InputLabel>
                      <OutlinedInput
                        value={users?.vat_number ? users?.vat_number : ''}
                        label="vat_number"
                        name="vat_number"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Phone number</InputLabel>
                      <OutlinedInput
                        value={users?.phone_number ? users.phone_number : ''}
                        label="phone"
                        name="phone_number"
                        type="tel"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Address</InputLabel>
                      <OutlinedInput
                        value={users?.address ? users.address : ''}
                        label="address"
                        name="address"
                        type="address"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>City</InputLabel>
                      <OutlinedInput
                        value={users?.city ? users.city : ''}
                        name="city"
                        label="City"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <OutlinedInput
                        value={users?.province ? users.province : ''}
                        label="province"
                        name="province"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Country</InputLabel>
                      <OutlinedInput
                        label="Address"
                        name="country"
                        value={users?.country ? users.country : ''}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Cap</InputLabel>
                      <OutlinedInput
                        value={users?.cap ? users.cap : ''}
                        label=""
                        name="cap"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Message</InputLabel>
                      <OutlinedInput
                        value={users?.message ? users.message : ''}
                        label="message"
                        name="message"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
            </Card>
          </form>

          <Box sx={btnDeleteBox}>
            <Button
              onClick={() => {
                setOpenConfirmDelete(true);
              }}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Box>
          <Box sx={btnSaveBox}>
            <Button
              onClick={() => {
                handleSubmit(`users/update-customer/${gridId}`, users), setOpen(false);
              }}
              variant="contained"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog open={openConfirmDelete} onClose={() => setOpenConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>This customer have to order.Are you sure you want to delete?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>handleDeleteUser(gridId,customerId)} color="secondary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
const btnSaveBox = {
  display: 'block',
  position: 'absolute' as 'absolute',
  bottom: '3%',
  right: '3%',
};

const btnDeleteBox = {
  display: 'block',
  position: 'absolute' as 'absolute',
  bottom: '3%',
  left: '3%',
};
const closeBtn = {
  position: 'absolute' as 'absolute',
  top: '0',
  right: '0',
};
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '60%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '850px',
  width: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  alignitems: 'center',
  flexWrap: 'wrap',
};
const initUser = {
  email: '',
  company_name: '',
  contact_name: '',
  vat_number: '',
  phone_number: '',
  address: '',
  cap: '',
  city: '',
  province: '',
  country: '',
  message: '',

  // email: '',
};
