'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { apiService } from '@/axios/axios-interceptor';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';
import DeleteIcon from '@mui/icons-material/Delete';
///----------
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  Button,
  CircularProgress /* ---- */,
  Collapse /* ---- */,
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  ImageListItem,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';

import { companyDataI } from '@/types/product';

export default function AddCompanyForm() {
  const [companyData, setCompanyData] = useState<companyDataI>(companyInit);
  const [allCompanyData, setAllCompanyData] = useState<companyDataI[]>();
  const [update, setUpdate] = useState(false);
  const [editCompany, setEditcompany] = useState<companyDataI>(companyInit);
  const [loading, setLoading] = useState(false);
  const [companyLogo, setcompanyLogo] = useState<any>([]);
  const [companyLogoURL, setcompanyLogoURL] = useState<string>();
  const [editcompanyLogo, seteditcompanyLogo] = useState<any>([]);
  const [editcompanyLogoURL, seteditcompanyLogoURL] = useState<any>([]);

  const handleSubmit = async () => {
    setLoading(true);
    if (companyData.company_name == '' || companyData.company_code == '') {
      toast.error('all input feild must not be empty ');
    } else if (companyData.company_name !== '' || companyData.company_code !== '') {
      try {
        const formData = new FormData();
        for (let imageKey in companyLogo) {
          console.log(companyLogo[imageKey]);
          formData.append('logo', companyLogo[imageKey]);
        }
        formData.append('company_name', companyData.company_name);
        formData.append('company_code', companyData.company_code);
        formData.append('currency', companyData.currency);
        formData.append('minimum_cost_avoid_shipping', companyData.minimum_cost_avoid_shipping);
        const response = await apiService.post(`companies/create-company`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response?.data?.success) {
          setUpdate(true);
          toast.success(response.data.message);
          setCompanyData(companyInit);
          setcompanyLogoURL('');
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleUpdateCompanyDetail = async () => {
    try {
      const formData = new FormData();
      for (let imageKey in editcompanyLogo) {
        formData.append('logo', editcompanyLogo[imageKey]);
      }
      formData.append('company_id', editCompany.id);
      formData.append('company_name', editCompany.company_name);
      formData.append('company_code', editCompany.company_code);
      formData.append('currency', editCompany.currency);
      formData.append('minimum_cost_avoid_shipping', editCompany.minimum_cost_avoid_shipping);
      const response = await apiService.patch('companies/edit-company', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response?.data.data) {
        console.log(response.data.success);
        if (response?.data?.success === true) {
          setUpdate(true);
          toast.success(response?.data.message);
        }
        if (response?.data?.success === false) {
          setUpdate(true);
          toast.error(response?.data.message);
        }
        // setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  // console.log(editCompany);
  const getCompany = async () => {
    try {
      const response = await apiService.get('companies');
      if (response.data) {
        setAllCompanyData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleEditCompany = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const { value, name } = event.target;
    setEditcompany({ ...editCompany, [name]: value, id: id });
  };

  const handleDeleteCompany = (id: string) => {
    // if (confirmDel === true) {
    apiService
      ._delete('companies/delete-company', {
        company_id: id,
      })
      .then((res) => {
        toast.success(res.data.message);
        setAllCompanyData(allCompanyData?.filter((c) => c.id !== id));
      })
      .catch(function (error) {
        toast.error(error);
      });
  };
  const handleLogoImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setcompanyLogo({ [uniqueId]: event.target.files[0] });
    setcompanyLogoURL(URLimage);
  };
  const handleEditLogoImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    seteditcompanyLogo({ [uniqueId]: event.target.files[0] });
    seteditcompanyLogoURL(URLimage);
  };

  useEffect(() => {
    getCompany();
    setUpdate(false);
  }, [update]);
  return (
    <div>
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <form style={{ display: 'flex' }}>
          <Box sx={{ width: '40%' }}>
            <Grid item={true} md={2} sx={{ mr: 1 }}>
              <FormControl sx={{ width: 400 }}>
                <label>
                  Company Name <span style={{ color: 'red' }}>** </span>
                </label>
                <OutlinedInput
                  onChange={(event) => {
                    setCompanyData({ ...companyData, company_name: event.target.value });
                  }}
                  label=""
                  name="company_name"
                  value={companyData.company_name}
                />
              </FormControl>
            </Grid>
            <Grid item={true} md={2} sx={{ mr: 1 }}>
              <FormControl sx={{ width: 400 }}>
                <label>
                  Company Code <span style={{ color: 'red' }}> ** </span>
                </label>
                <OutlinedInput
                  onChange={(event) => {
                    setCompanyData({ ...companyData, company_code: event.target.value });
                  }}
                  label=""
                  name="company_code"
                  value={companyData.company_code}
                />
              </FormControl>
            </Grid>
          </Box>
          <Box sx={{ width: '40%' }}>
            <Box>
              <FormControl required fullWidth>
                <label htmlFor="" style={{ width: '70%' }}>
                  Company logo <span style={{ color: 'red' }}> ** </span>
                  <br />
                  <TextField type="file" value={companyData.logo} onChange={handleLogoImageChange} />{' '}
                </label>
              </FormControl>

              {companyLogoURL ? (
                <ImageListItem sx={{ marginTop: '15px' }}>
                  <img src={companyLogoURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                </ImageListItem>
              ) : null}
            </Box>
          </Box>
        </form>
      )}

      <Grid item={true} md={2} sx={{ mt: 2, mb: 4 }}>
        <Button variant="contained" type="submit" onClick={handleSubmit}>
          Create company
        </Button>
      </Grid>
      {/* {loading ? <LinearProgress color="inherit" /> : null} */}
      <Divider />
      {/* ------COMPANY LISTS------------------------------------------- */}
      {/* <CollapsibleCompanyTable /> */}
      {/* <TextField id="outlined-basic" label="Search By Company Name" variant="outlined" fullWidth sx={{ mb: 3 }} /> */}
      <TableContainer component={Paper} sx={{ height: 600, overflow: 'auto', border: 'solid 1px #aeafaf' }}>
        <Table aria-label="collapsible table">
          <TableHead>
            <TableRow sx={{ width: '100%' }}>
              <TableCell align="right" />
              <TableCell>Logo</TableCell>
              <TableCell>Company Name</TableCell>
              <TableCell>Company Code</TableCell>
              <TableCell>Minimum Cost Avoid Shipping</TableCell>
              <TableCell>Currency</TableCell>
            </TableRow>
          </TableHead>

          {/* -------------------------- */}
          <TableBody>
            {allCompanyData &&
              allCompanyData.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  handleDeleteCompany={handleDeleteCompany}
                  handleEditCompany={handleEditCompany}
                  handleUpdateCompanyDetail={handleUpdateCompanyDetail}
                  handleEditLogoImageChange={handleEditLogoImageChange}
                  editcompanyLogoURL={editcompanyLogoURL}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
let companyInit = { id: '', company_name: '', company_code: '', logo: '', currency: '' ,minimum_cost_avoid_shipping:'0'};

function createData(id: string, company_name: string, company_code: string, logo: any, currency: string,minimum_cost_avoid_shipping:string) {
  return {
    id,
    company_name,
    company_code,
    logo,
    currency,
    minimum_cost_avoid_shipping
  };
}

function Row(props: {
  row: ReturnType<typeof createData>;
  handleDeleteCompany: any;
  handleEditCompany: any;
  handleUpdateCompanyDetail: any;
  handleEditLogoImageChange: any;
  editcompanyLogoURL: string;
}) {
  const {
    row,
    handleDeleteCompany,
    handleEditCompany,
    handleUpdateCompanyDetail,
    editcompanyLogoURL,
    handleEditLogoImageChange,
  } = props;
  const [open, setOpen] = useState(false);
  const [opendialog, setOpenDialog] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Image width={150} height={150} alt="company logo" src={row.logo} priority={true} />
        </TableCell>
        <TableCell component="th" scope="row">
          {row.company_name}
        </TableCell>
        <TableCell>{row.company_code}</TableCell>
        <TableCell>{row.minimum_cost_avoid_shipping}</TableCell>
        <TableCell>{row.currency}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Edit Company
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Logo</TableCell>
                    <TableCell>Company Name</TableCell>
                    <TableCell>Company Code</TableCell>
                    <TableCell>Minimum Cost Avoid Shipping</TableCell>
                    <TableCell>Currency</TableCell>
                    <TableCell align="right">Delete</TableCell>
                    <TableCell align="right">Save</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/*-------------------- Edit company Data ------------------- */}
                  <TableRow key={row.id}>
                    <TableCell>
                      <FormControl required>
                        <Button
                          component="label"
                          role={undefined}
                          variant="contained"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                          onChange={handleEditLogoImageChange}
                        >
                          Upload logo
                          <VisuallyHiddenInput type="file" />
                        </Button>

                        {editcompanyLogoURL.length >= 1 ? (
                          <ImageListItem sx={{ marginTop: '15px' }}>
                            <img src={editcompanyLogoURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                          </ImageListItem>
                        ) : null}
                      </FormControl>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <TextField
                        id="outlined-basic"
                        label={row.company_name}
                        defaultValue={row.company_name}
                        variant="outlined"
                        name="company_name"
                        onChange={(event) => handleEditCompany(event, row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        label={row.company_code}
                        defaultValue={row.company_code}
                        variant="outlined"
                        name="company_code"
                        onChange={(event) => handleEditCompany(event, row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="outlined-basic"
                        label={row.minimum_cost_avoid_shipping}
                        defaultValue={row.minimum_cost_avoid_shipping}
                        variant="outlined"
                        name="minimum_cost_avoid_shipping"
                        onChange={(event) => handleEditCompany(event, row.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        label={row.currency}
                        name="currency"
                        defaultValue={row.currency}
                        onChange={(event) => handleEditCompany(event, row.id)}
                      >
                        <MenuItem value={'THB'}>THB</MenuItem>
                        <MenuItem value={'USD'}>USD</MenuItem>
                      </Select>
                    </TableCell>
                    
                    
                    <TableCell align="right">
                      <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => setOpenDialog(true)}>
                        Delete
                      </Button>
                      <Dialog
                        open={opendialog}
                        onClose={() => setOpenDialog(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          Are you sure you want to delete {row.company_name} company ?
                        </DialogTitle>

                        <DialogActions>
                          <Button
                            onClick={() => {
                              handleDeleteCompany(row.id), setOpenDialog(false);
                            }}
                          >
                            Yes
                          </Button>
                          <Button onClick={() => setOpenDialog(false)} autoFocus>
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                    <TableCell align="right">
                      <Button variant="outlined" startIcon={<DataSaverOnIcon />} onClick={handleUpdateCompanyDetail}>
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
