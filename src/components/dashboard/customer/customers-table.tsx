'use client';

import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFetch } from '@/app/useFetch/useFetch';
import { apiService } from '@/axios/axios-interceptor';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridToolbar,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import { b2bUserInterface, getAllB2bUserInterface } from '@/types/user';
import { useProducts } from '@/hooks/use-products';

import ChangeStatus from './ChangeStatus';
import EditCustomer from './edit-customer';
import { useUser } from '@/hooks/use-user';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useRouter } from 'next/navigation';

export default function DataTable() {
  const { b2bDataState, workSpace, b2cDataState } = useProducts();
  let local = localStorage.getItem('workSpace');
  const [data, setData] = useState(null as any);
  const [b2cdata, setB2cData] = useState(null as any);
  const [rows, setRows] = useState<Row[]>(data);
  const [B2BUsers, setB2BUsers] = useState<getAllB2bUserInterface[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  type Row = (typeof data)[number];
  const { checkSession } = useUser();
  const router = useRouter()
  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();
      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);
  
  const deleteUser = useCallback(
    (id: GridRowId) => () => {
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    },
    []
  );

  const getAllB2BUsers = async () => {
    try {
      const response = await apiService.get('users');
      if (response?.data) {
        setB2BUsers(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleBanAndVerify = async (url: string) => {
    try {
      const response = await apiService.patch(url, {});
      if (response?.data?.success) {
        console.log(response);
        toast.success(response.data.message);
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitEditUser = async (url: string, user: b2bUserInterface) => {
    try {
      const response = await apiService.patch(url, user);
      if (response?.data) {
        console.log(response);
        toast.success('new user data have been save');
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId:string,customerId:string) => {
    try {
      const response = await apiService._delete(`users/remove-customer/${userId}/${customerId}`);
      if (response?.data) {
        toast.success('user data have been delete');
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    }
  };


  const b2bcolumns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 40,
        renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1, /// render cell index as id
      },
      {
        field: 'company_name',
        headerName: 'Company name',
        type: 'string',
        width: 200,
      },

      {
        field: 'contact_name',
        headerName: 'Contact name',
        type: 'string',
        width: 200,
      },
      {
        field: 'email',
        headerName: 'Email',
        type: 'string',
        width: 200,
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 500,
        renderCell: (params) =>
          params.row.address + ' ' + params.row.province + ' ' + params.row.city + ' ' + params.row.country,
      },
      { field: 'phone_number', headerName: 'Phone', width: 130 },
      {
        field: 'actions',
        headerName: 'Edit',
        type: 'actions',
        width: 100,
        sortable: false,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditCustomer gridId={params.id} customerId={params?.row?.customer_id} handleSubmit={handleSubmitEditUser} handleDeleteUser={handleDeleteUser}/>}
            label="Edit"
          />,
        ],
      },
      {
        field: 'is_actived',
        headerName: 'Status',
        type: 'actions',
        width: 120,

        getActions: (params) => [
          <GridActionsCellItem
            icon={<ChangeStatus id={params.id} status={params.row.is_actived} handleClick={handleBanAndVerify} />}
            label="Status"
          />,
        ],
      },
    ],
    [deleteUser]
  );

  const b2cColumns = useMemo<GridColDef<Row>[]>(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 40,
        renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1, /// render cell index as id
      },

      {
        field: 'first_name',
        headerName: 'Full name',
        width: 230,
        renderCell: (params) => `${params.row.first_name} ${params.row.last_name} `,
      },
      {
        field: 'email',
        headerName: 'Email',
        type: 'string',
        width: 200,
      },
      {
        field: 'address',
        headerName: 'Address',
        width: 400,
        renderCell: (params) =>
          params.row.address + ' ' + params.row.province + ' ' + params.row.city + ' ' + params.row.country,
      },
      { field: 'phone_number', headerName: 'Phone', width: 130 },
      {
        field: 'actions',
        headerName: 'Edit',
        type: 'actions',
        width: 100,
        sortable: false,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<EditCustomer gridId={params.id} customerId={params?.row?.customer_id} handleSubmit={handleSubmitEditUser} handleDeleteUser={handleDeleteUser}/>}
            label="Edit"
          />,
        ],
      },
      {
        field: 'is_actived',
        headerName: 'Status',
        width: 100,
        valueGetter: (params: GridValueGetterParams) => `${params.row.is_actived === true ? 'active' : 'unactive'}`,
      },
    ],
    [deleteUser]
  );

  useEffect(() => {
    if (workSpace) {
      if (b2cDataState !== null && local == 'B2B') {
        setData(b2bDataState);
      }
      if (b2bDataState !== null && local == 'B2C') {
        setB2cData(b2cDataState);
      }
    }
  }, [b2bDataState, b2cDataState, workSpace]);

  useEffect(() => {
    getAllB2BUsers();
    setIsSubmitted(false);
  }, [isSubmitted]);

  if (data !== null && local == 'B2B') {
    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={B2BUsers}
          columns={b2bcolumns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 35]}
        />
      </div>
    );
  }

  if (b2cdata !== null && local == 'B2C') {
    return (
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={b2cdata}
          columns={b2cColumns}
          slots={{ toolbar: GridToolbar }}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 35]}
        />
      </div>
    );
  }
}
