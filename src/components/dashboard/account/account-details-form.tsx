'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import { decodeToken } from '@/utils/jwt';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Divider, FormControl, Grid, OutlinedInput, Tab, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';

import { companyDataI } from '@/types/product';
import { webviewUser } from '@/types/user';

import AddCompanyForm from './addCompany';

export function AccountDetailsForm(): React.JSX.Element {
  const [inputData, setInputData] = useState<webviewUser>(initInputData);
  const [allCompanyData, setAllCompanyData] = useState<companyDataI[]>();
  const [value, setValue] = useState('2');
  const [role, setRole] = useState<string | null>(null);

  const submitCreateUser = async () => {
    if (!/\S+@\S\.\S+/.test(inputData.user.email))
      try {
        const response = await apiService.post(`auth/signup`, {
          ...inputData,
          company_name: role === 'SuperAdmin' ? inputData.company_name : allCompanyData?.[0]?.company_name,
        });
        if (response?.data) {
          console.log(response.data);
          setInputData(initInputData);
          toast.success('created B2B customer');
        }
      } catch (error) {
        console.error(error);
      }
  };
  const submitCreateAdmin = async () => {
    if (!/\S+@\S\.\S+/.test(inputData.user.email))
      try {
        const response = await apiService.post(`auth/signup/admin`, {
          email: inputData.user.email,
          company_name: inputData.company_name,
          password: inputData.password,
        });
        if (response?.data) {
          setInputData(initInputData);
          toast.success('created B2B Admin');
        }
      } catch (error) {
        console.error(error);
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name != 'email') {
      setInputData({ ...inputData, [name]: value });
    }
    if (name == 'email') {
      setInputData({ ...inputData, user: { [name]: value } });
    }
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getCompany = () => {
    apiService
      .get(`companies`)
      .then((res) => {
        let result = res.data.data as companyDataI[];
        setAllCompanyData(result);
        // console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) {
        setRole(decoded.claims.role);
      }
    }
  }, []);
  useEffect(() => {
    getCompany();
  }, []);
  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleTabChange} aria-label="lab API tabs example">
            {role === 'SuperAdmin' && <Tab sx={{ width: 200, height: 100 }} label="Create Company" value="1" />}
            <Tab sx={{ width: 200, height: 100 }} label="Create User" value="2" />
            {role === 'SuperAdmin' && <Tab sx={{ width: 200, height: 100 }} label="Create Admin" value="3" />}
          </TabList>
        </Box>
        {role === 'SuperAdmin' && (
          <TabPanel value="1">
            <AddCompanyForm />
          </TabPanel>
        )}

        <TabPanel value="2">
          <form
            id="createUser"
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Card>
              <CardHeader subheader="The information can be edited" title="Profile" />
              <Divider />
              <CardContent>
                <Grid item={true} container spacing={3}>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth required>
                      <label>
                        Email <span style={{ color: 'red' }}>**</span>{' '}
                      </label>
                      <TextField value={inputData.user.email} name="email" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>
                        Company Name <span style={{ color: 'red' }}>**</span>{' '}
                      </label>
                      {role === 'SuperAdmin' ? (
                        <Select
                          name="company_name"
                          onChange={(event) => {
                            setInputData({ ...inputData, company_name: event.target.value });
                          }}
                          value={inputData.company_name}
                        >
                          {allCompanyData &&
                            allCompanyData.map((c) => (
                              <MenuItem key={c.id} value={c.company_name}>
                                {c.company_name}
                              </MenuItem>
                            ))}
                        </Select>
                      ) : (
                        <h3 className="mt-5">{allCompanyData?.[0]?.company_name}</h3>
                      )}
                    </FormControl>
                  </Grid>{' '}
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth required>
                      <label>
                        Contact Name <span style={{ color: 'red' }}>**</span>
                      </label>
                      <OutlinedInput value={inputData.contact_name} name="contact_name" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>VAT number</label>
                      <OutlinedInput
                        value={inputData.vat_number}
                        label="vat_number"
                        name="vat_number"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>
                        Phone number <span style={{ color: 'red' }}>**</span>
                      </label>
                      <OutlinedInput
                        value={inputData.phone_number}
                        label="Phone number"
                        name="phone_number"
                        type="tel"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Address</label>
                      <OutlinedInput
                        value={inputData.address}
                        label="address"
                        name="address"
                        type="address"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>City</label>
                      <OutlinedInput value={inputData.city} label="City" name="city" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Province</label>
                      <OutlinedInput
                        value={inputData.province}
                        label="Address"
                        name="province"
                        onChange={handleChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Country</label>
                      <OutlinedInput value={inputData.country} label="Address" name="country" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Cap</label>
                      <OutlinedInput value={inputData.cap} label="" name="cap" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Message</label>
                      <OutlinedInput value={inputData.message} label="message" name="message" onChange={handleChange} />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant="contained" form="createUser" type="submit" onClick={submitCreateUser}>
                  Create user
                </Button>
              </CardActions>
            </Card>
          </form>
        </TabPanel>
        {role === 'SuperAdmin' && (
          <TabPanel value="3">
            <form
              id="createAdmin"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <Card>
                <CardHeader title="Admin Profile" />
                <Divider />
                <CardContent>
                  <Grid item={true} container spacing={3}>
                    <Grid item={true} md={6} xs={12}>
                      <FormControl fullWidth required>
                        <label>
                          Email <span style={{ color: 'red' }}>**</span>{' '}
                        </label>
                        <TextField value={inputData.user.email} name="email" onChange={handleChange} />
                      </FormControl>
                    </Grid>
                    <Grid item={true} md={6} xs={12}>
                      <FormControl fullWidth>
                        <label>Password</label>
                        <OutlinedInput
                          value={inputData.password}
                          type="password"
                          label="password"
                          name="password"
                          onChange={handleChange}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item={true} md={6} xs={12}>
                      <FormControl fullWidth>
                        <label>
                          Company Name <span style={{ color: 'red' }}>**</span>{' '}
                        </label>

                        <Select
                          name="company_name"
                          onChange={(event) => {
                            setInputData({ ...inputData, company_name: event.target.value });
                          }}
                          value={inputData.company_name}
                        >
                          {allCompanyData &&
                            allCompanyData.map((c) => (
                              <MenuItem key={c.id} value={c.id}>
                                {c.company_name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Button variant="contained" form="createUser" type="submit" onClick={submitCreateAdmin}>
                    Create Admin
                  </Button>
                </CardActions>
              </Card>
            </form>
          </TabPanel>
        )}
      </TabContext>
    </>
  );
}
let initInputData = {
  user: {
    email: '',
  },
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
  password: '',
};
