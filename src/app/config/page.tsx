'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
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
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Add, Company, ConfigMenu, Edit, statusMap, SubMenu } from './type';

export default function Page(): React.JSX.Element {
  const [editRowNumber, setEditRowNumber] = useState<Edit>({
    menubarId: null,
    subMenubarId: null,
    menuSidebarId: null,
    subMenuSidebarId: null,
  });
  const [isAddMenu, setIsAddMenu] = useState<Add>({
    menubar: false,
    subMenubar: false,
    menuSidebar: false,
    subMenuSidebar: false,
  });
  const [sideMenu, setSideMenu] = useState<ConfigMenu[]>([]);
  const [navBar, setNavBar] = useState<ConfigMenu[]>([]);
  const [subMenu, setSubMenu] = useState<SubMenu[]>([]);
  const [subSideMenu, setSubSideMenu] = useState<SubMenu[]>([]);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [menuBar, setMenuBar] = useState({ name: '', status: 'Active', sideBar: false });
  const [formSubMenuBar, setFormSubMenuBar] = useState({ name: '', status: 'Active', sideBar: false });
  const [formSideBar, setFormSideBar] = useState({ name: '', status: 'Active', sideBar: true });
  const [formSubSideBar, setFormSubSideBar] = useState({ name: '', status: 'Active', sideBar: true });
  const [selectedCompany, setSelectedCompany] = useState<string>('');

  const getConfigMenu = async () => {
    try {
      const response = await apiService.get(`config-menu/${selectedCompany}`);
      const filterNavbar = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === false;
      });
      const filterSideBar = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === true;
      });
      setNavBar(filterNavbar);
      setSideMenu(filterSideBar);
    } catch (error) {
      console.error(error);
    }
    try {
      const response = await apiService.get(`config-menu/sub-menu/${selectedCompany}`);
      const filterSubMenu = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === false;
      });
      const filterSubSideMenu = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === true;
      });
      setSubMenu(filterSubMenu);
      setSubSideMenu(filterSubSideMenu);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteConfigMenu = async (id: number) => {
    try {
      const response = await apiService._delete(`config-menu`, { id: id });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateConfigMenu = async (id: number) => {
    try {
      const response = await apiService.put(`config-menu`, { ...menuBar, id });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addConfigMenu = async () => {
    try {
      const response = await apiService.post(`config-menu`, { ...menuBar, companyId: selectedCompany });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addSideMenu = async () => {
    try {
      const response = await apiService.post(`config-menu`, { ...formSideBar, companyId: selectedCompany });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateConfigSubMenu = async (id: number, form: any) => {
    try {
      const response = await apiService.put(`config-menu/sub-menu`, { ...form, id });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addConfigSubMenu = async () => {
    try {
      const response = await apiService.post(`config-menu/sub-menu`, { ...formSubMenuBar, companyId: selectedCompany });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addSubSideMenu = async () => {
    try {
      const response = await apiService.post(`config-menu/sub-menu`, { ...formSubSideBar, companyId: selectedCompany });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubMenu = async (id: number) => {
    try {
      const response = await apiService._delete(`config-menu/sub-menu`, { id: id });
      if (response?.data?.success) {
        getConfigMenu();
        clearData();
      }
    } catch (error) {
      console.error(error);
    }
  };
  const clearData = () => {
    setEditRowNumber({
      menubarId: null,
      menuSidebarId: null,
      subMenubarId: null,
      subMenuSidebarId: null,
    });
    setIsAddMenu({
      menubar: false,
      menuSidebar: false,
      subMenubar: false,
      subMenuSidebar: false,
    });
    setMenuBar({ name: '', status: 'Active', sideBar: false });
    setFormSubMenuBar({ name: '', status: 'Active', sideBar: false });
    setFormSideBar({ name: '', status: 'Active', sideBar: true });
    setFormSubSideBar({ name: '', status: 'Active', sideBar: true });
  };
  const getCompanyList = async () => {
    try {
      const companyList = await apiService.get('companies');
      setCompanyList(companyList.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanyList();
    if (selectedCompany) {
      getConfigMenu();
    }
  }, [selectedCompany]);

  return (
    <>
      {selectedCompany ? (
        <Grid container spacing={3}>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginBottom: '2rem',
              marginRight: '1rem',
            }}
          >
            <FormControl sx={{ width: '40%' }}>
              <InputLabel>Company</InputLabel>
              <Select
                defaultValue={selectedCompany}
                label="Company"
                name="company"
                variant="outlined"
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                {companyList?.map((c) => (
                  <MenuItem key={c.id} value={c.id} selected={selectedCompany === c.id}>
                    {c.company_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <>
            <Grid lg={12} md={12} xs={12}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Config Menu Bar"
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => setIsAddMenu((prev) => ({ ...prev, menubar: true }))}
                    >
                      <AddIcon /> <Typography>Add</Typography>
                    </IconButton>
                  }
                />
                <Divider />
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isAddMenu.menubar && (
                        <TableRow hover>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Menu Name</InputLabel>
                              <OutlinedInput
                                defaultValue=""
                                onChange={(e) => {
                                  setMenuBar((prev) => ({ ...prev, name: e.target.value }));
                                }}
                                label="Menu Name"
                                name="lastName"
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Status</InputLabel>
                              <Select
                                defaultValue=""
                                onChange={(e) => {
                                  setMenuBar((prev) => ({ ...prev, status: e.target.value }));
                                }}
                                label="Status"
                                name="status"
                                variant="outlined"
                              >
                                {['Active', 'Inactive'].map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <Button onClick={addConfigMenu}>Add</Button>
                            <Button
                              onClick={() => {
                                setIsAddMenu((prev) => ({ ...prev, menubar: false }));
                              }}
                            >
                              Cancle
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {navBar?.map((config, i) => {
                        const { label, color } = statusMap[config.status] ?? { label: 'Unknown', color: 'default' };
                        return (
                          <>
                            {editRowNumber?.menubarId === i ? (
                              <TableRow hover key={config.id}>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Menu Name</InputLabel>
                                    <OutlinedInput
                                      defaultValue={config?.name}
                                      onChange={(e) => {
                                        setMenuBar((prev) => ({ ...prev, name: e.target.value }));
                                      }}
                                      label="Menu Name"
                                      name="lastName"
                                    />
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      defaultValue={label}
                                      onChange={(e) => {
                                        setMenuBar((prev) => ({ ...prev, status: e.target.value }));
                                      }}
                                      label="Status"
                                      name="status"
                                      variant="outlined"
                                    >
                                      {['Active', 'Inactive'].map((s) => (
                                        <MenuItem key={s} value={s}>
                                          {s}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>

                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      updateConfigMenu(config.id);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, menubarId: null }));
                                    }}
                                  >
                                    Cancle
                                  </Button>
                                  <Button
                                    className="text-red"
                                    onClick={() => {
                                      deleteConfigMenu(config.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow hover key={config.id}>
                                <TableCell>{config.name}</TableCell>
                                <TableCell>
                                  <Chip color={color} label={label} size="small" />
                                </TableCell>
                                <TableCell>
                                  <BorderColorIcon
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, menubarId: i }));
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <Divider />
              </Card>
            </Grid>

            <Grid lg={12} md={12} xs={12}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Config Sub Menu Bar"
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => setIsAddMenu((prev) => ({ ...prev, subMenubar: true }))}
                    >
                      <AddIcon /> <Typography>Add</Typography>
                    </IconButton>
                  }
                />
                <Divider />
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Sub Menu Name</TableCell>
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isAddMenu.subMenubar && (
                        <TableRow hover>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Menu Name</InputLabel>
                              <OutlinedInput
                                defaultValue=""
                                onChange={(e) => {
                                  setFormSubMenuBar((prev) => ({ ...prev, name: e.target.value }));
                                }}
                                label="Menu Name"
                                name="lastName"
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Group Name</InputLabel>
                              <Select
                                defaultValue=""
                                onChange={(e) => {
                                  setFormSubMenuBar((prev) => ({ ...prev, menuId: e.target.value }));
                                }}
                                label="GroupName"
                                name="GroupName"
                                variant="outlined"
                              >
                                {navBar?.map((s, i) => (
                                  <MenuItem key={s.id} value={s.id} selected={i === 0}>
                                    {s.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Status</InputLabel>
                              <Select
                                defaultValue="Active"
                                onChange={(e) => {
                                  setFormSubMenuBar((prev) => ({ ...prev, status: e.target.value }));
                                }}
                                label="Status"
                                name="status"
                                variant="outlined"
                              >
                                {['Active', 'Inactive'].map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <Button onClick={addConfigSubMenu}>Add</Button>
                            <Button
                              onClick={() => {
                                setIsAddMenu((prev) => ({ ...prev, subMenubar: false }));
                              }}
                            >
                              Cancle
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {subMenu?.map((config, i) => {
                        const { label, color } = statusMap[config.status] ?? { label: 'Unknown', color: 'default' };
                        return (
                          <>
                            {editRowNumber?.subMenubarId === i ? (
                              <TableRow hover key={config.id}>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Sub Menu Name</InputLabel>
                                    <OutlinedInput
                                      defaultValue={config.name}
                                      onChange={(e) => {
                                        setFormSubMenuBar((prev) => ({ ...prev, name: e.target.value }));
                                      }}
                                      label="Sub Menu Name"
                                      name="SubMenuName"
                                    />
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Menu Name</InputLabel>
                                    <Select
                                      onChange={(e) => {
                                        setFormSubMenuBar((prev) => ({ ...prev, menuId: e.target.value }));
                                      }}
                                      label="MenuName"
                                      name="MenuName"
                                      variant="outlined"
                                    >
                                      {navBar?.map((s, i) => (
                                        <MenuItem key={s.id} value={s.id} selected={i === 0}>
                                          {s.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      defaultValue={label}
                                      onChange={(e) => {
                                        setFormSubMenuBar((prev) => ({ ...prev, status: e.target.value }));
                                      }}
                                      label="Status"
                                      name="status"
                                      variant="outlined"
                                    >
                                      {['Active', 'Inactive'].map((s) => (
                                        <MenuItem key={s} value={s}>
                                          {s}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>

                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      updateConfigSubMenu(config.id, formSubMenuBar);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, subMenubarId: null }));
                                    }}
                                  >
                                    Cancle
                                  </Button>
                                  <Button
                                    className="text-red"
                                    onClick={() => {
                                      deleteSubMenu(config.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow hover key={config.id}>
                                <TableCell>{config.name}</TableCell>
                                <TableCell>{navBar?.find((s) => s.id === config.menuId)?.name}</TableCell>
                                <TableCell>
                                  <Chip color={color} label={label} size="small" />
                                </TableCell>
                                <TableCell>
                                  <BorderColorIcon
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, subMenubarId: i }));
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <Divider />
              </Card>
            </Grid>

            <Grid lg={12} md={12} xs={12}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Config Side Bar"
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => setIsAddMenu((prev) => ({ ...prev, menuSidebar: true }))}
                    >
                      <AddIcon /> <Typography>Add</Typography>
                    </IconButton>
                  }
                />
                <Divider />
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isAddMenu.menuSidebar && (
                        <TableRow hover>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Menu Name</InputLabel>
                              <OutlinedInput
                                defaultValue=""
                                onChange={(e) => {
                                  setFormSideBar((prev) => ({ ...prev, name: e.target.value }));
                                }}
                                label="Menu Name"
                                name="lastName"
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Status</InputLabel>
                              <Select
                                defaultValue=""
                                onChange={(e) => {
                                  setFormSideBar((prev) => ({ ...prev, status: e.target.value }));
                                }}
                                label="Status"
                                name="status"
                                variant="outlined"
                              >
                                {['Active', 'Inactive'].map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <Button onClick={addSideMenu}>Add</Button>
                            <Button
                              onClick={() => {
                                setIsAddMenu((prev) => ({ ...prev, menuSidebar: false }));
                              }}
                            >
                              Cancle
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {sideMenu?.map((config, i) => {
                        const { label, color } = statusMap[config.status] ?? { label: 'Unknown', color: 'default' };

                        return (
                          <>
                            {editRowNumber?.menuSidebarId === i ? (
                              <TableRow hover key={config.id}>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Menu Name</InputLabel>
                                    <OutlinedInput
                                      defaultValue={config?.name}
                                      onChange={(e) => {
                                        setFormSideBar((prev) => ({ ...prev, name: e.target.value }));
                                      }}
                                      label="Menu Name"
                                      name="lastName"
                                    />
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      defaultValue={label}
                                      onChange={(e) => {
                                        setFormSideBar((prev) => ({ ...prev, status: e.target.value }));
                                      }}
                                      label="Status"
                                      name="status"
                                      variant="outlined"
                                    >
                                      {['Active', 'Inactive'].map((s) => (
                                        <MenuItem key={s} value={s}>
                                          {s}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>

                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      updateConfigMenu(config.id);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, menuSidebarId: null }));
                                    }}
                                  >
                                    Cancle
                                  </Button>
                                  <Button
                                    className="text-red"
                                    onClick={() => {
                                      deleteConfigMenu(config.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow hover key={config.id}>
                                <TableCell>{config.name}</TableCell>
                                <TableCell>
                                  <Chip color={color} label={label} size="small" />
                                </TableCell>
                                <TableCell>
                                  <BorderColorIcon
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, menuSidebarId: i }));
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <Divider />
              </Card>
            </Grid>

            <Grid lg={12} md={12} xs={12}>
              <Card sx={{ height: '100%' }}>
                <CardHeader
                  title="Config Sub Menu Side Bar"
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={() => setIsAddMenu((prev) => ({ ...prev, subMenuSidebar: true }))}
                    >
                      <AddIcon /> <Typography>Add</Typography>
                    </IconButton>
                  }
                />
                <Divider />
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 800 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Menu Name</TableCell>
                        <TableCell>Side Bar Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isAddMenu.subMenuSidebar && (
                        <TableRow hover>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Menu Name</InputLabel>
                              <OutlinedInput
                                defaultValue=""
                                onChange={(e) => {
                                  setFormSubSideBar((prev) => ({ ...prev, name: e.target.value }));
                                }}
                                label="Menu Name"
                                name="lastName"
                              />
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Group Name</InputLabel>
                              <Select
                                onChange={(e) => {
                                  setFormSubSideBar((prev) => ({ ...prev, menuId: e.target.value }));
                                }}
                                label="MenuName"
                                name="MenuName"
                                variant="outlined"
                              >
                                {sideMenu?.map((s, i) => (
                                  <MenuItem key={s.id} value={s.id}>
                                    {s.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <FormControl fullWidth>
                              <InputLabel>Status</InputLabel>
                              <Select
                                defaultValue="Active"
                                onChange={(e) => {
                                  setFormSubSideBar((prev) => ({ ...prev, status: e.target.value }));
                                }}
                                label="Status"
                                name="status"
                                variant="outlined"
                              >
                                {['Active', 'Inactive'].map((s) => (
                                  <MenuItem key={s} value={s}>
                                    {s}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>

                          <TableCell>
                            <Button onClick={addSubSideMenu}>Add</Button>
                            <Button
                              onClick={() => {
                                setIsAddMenu((prev) => ({ ...prev, subMenuSidebar: false }));
                              }}
                            >
                              Cancle
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                      {subSideMenu?.map((config, i) => {
                        const { label, color } = statusMap[config.status] ?? { label: 'Unknown', color: 'default' };
                        return (
                          <>
                            {editRowNumber?.subMenuSidebarId === i ? (
                              <TableRow hover key={config.id}>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Menu Name</InputLabel>
                                    <OutlinedInput
                                      defaultValue={config.name}
                                      onChange={(e) => {
                                        setFormSubSideBar((prev) => ({ ...prev, name: e.target.value }));
                                      }}
                                      label="Menu Name"
                                      name="lastName"
                                    />
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Group Name</InputLabel>
                                    <Select
                                      defaultValue={
                                        navBar?.find((d) => {
                                          d?.id === config.menuId;
                                        })?.name
                                      }
                                      onChange={(e) => {
                                        setFormSubSideBar((prev) => ({ ...prev, menuId: e.target.value }));
                                      }}
                                      label="MenuName"
                                      name="MenuName"
                                      variant="outlined"
                                    >
                                      <MenuItem value={0}>-</MenuItem>
                                      {sideMenu?.map((s) => (
                                        <MenuItem key={s.id} value={s.id}>
                                          {s.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>
                                <TableCell>
                                  <FormControl fullWidth>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                      defaultValue={label}
                                      onChange={(e) => {
                                        setFormSubSideBar((prev) => ({ ...prev, status: e.target.value }));
                                      }}
                                      label="Status"
                                      name="status"
                                      variant="outlined"
                                    >
                                      {['Active', 'Inactive'].map((s) => (
                                        <MenuItem key={s} value={s}>
                                          {s}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </TableCell>

                                <TableCell>
                                  <Button
                                    onClick={() => {
                                      updateConfigSubMenu(config.id, formSubSideBar);
                                    }}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, subMenuSidebarId: null }));
                                    }}
                                  >
                                    Cancle
                                  </Button>
                                  <Button
                                    className="text-red"
                                    onClick={() => {
                                      deleteSubMenu(config.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ) : (
                              <TableRow hover key={config.id}>
                                <TableCell>{config.name}</TableCell>
                                <TableCell>{sideMenu?.find((s) => s.id === config.menuId)?.name}</TableCell>
                                <TableCell>
                                  <Chip color={color} label={label} size="small" />
                                </TableCell>
                                <TableCell>
                                  <BorderColorIcon
                                    onClick={() => {
                                      setEditRowNumber((prev) => ({ ...prev, subMenuSidebarId: i }));
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            )}
                          </>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
                <Divider />
              </Card>
            </Grid>
          </>
        </Grid>
      ) : (
        <FormControl sx={{ width: '40%' }}>
          <InputLabel>Company</InputLabel>
          <Select
            className="w-full"
            defaultValue={''}
            label="Company"
            name="company"
            variant="outlined"
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            {companyList?.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </>
  );
}
