'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Company } from '@/app/config/type';
import { apiService } from '@/axios/axios-interceptor';
import AddIcon from '@mui/icons-material/Add';
import FindInPageIcon from '@mui/icons-material/FindInPage';
import { Button, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';

import { getProductsResponse } from '@/types/product';

export default function ProductList() {
  const [data, setData] = useState<getProductsResponse[]>();
  const [companyList, setCompanyList] = React.useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState('all');

  const router = useRouter();

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'id',
      width: 50,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: 'master_code',
      headerName: 'Master code',
      width: 120,
      renderCell: (params) => (
        <p style={{ textWrap: 'wrap', inlineSize: '120px', overflowWrap: 'break-word' }}>
          {params.row.master_code}
        </p>
      ),
    },
    {
      field: 'cover_image',
      headerName: 'Image',
      renderCell: (params: GridRenderCellParams<any>) => (
        <Image width={150} height={150} alt="cover image" src={params.value} priority={true} />
      ),
      width: 160,
    },
    {
      field: 'name',
      headerName: 'name',

      width: 150,
      renderCell: (params: GridRenderCellParams<any>) => <p style={{ textWrap: 'wrap' }}> {params.row.name} </p>,
    },
    { field: 'price', headerName: 'Price', width: 130 },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 80,
      renderCell: (params) => (
        <p style={{ textWrap: 'wrap', inlineSize: '80px', overflowWrap: 'break-word' }}>
          {params.row.currency||'-'}
        </p>
      ),
    },
    {
      field: 'product_code',
      headerName: 'Product Code',
      width: 150,
      renderCell: (params) => (
        <p style={{ textWrap: 'wrap', inlineSize: '150px', overflowWrap: 'break-word' }}>{params.row.product_code}</p>
      ),
    },
    {
      field: 'created_by_company',
      headerName: 'Company',
      type: 'string',
      width: 150,
      renderCell: (params) => (
        <p style={{ textWrap: 'wrap', inlineSize: '150px', overflowWrap: 'break-word' }}>
          {companyList.find((c)=>c.id===params?.row?.created_by_company)?.company_name||'-'}
        </p>
      ),
    },
    {
      field: 'end_of_life',
      headerName: 'EOL',
      width: 100,
      renderCell: (params) => (
        <p style={{ textWrap: 'wrap', inlineSize: '80px', overflowWrap: 'break-word' }}>
          {params.row.end_of_life ? moment(params.row.end_of_life).format('DD/MM/YYYY') : '-'}
        </p>
      ),
    },
    {
      field: 'details',
      headerName: 'Details',
      type: 'actions',
      width: 100,
      sortable: false,
      getActions: (params) => [
        <GridActionsCellItem
          onClick={() => {
            router.push('/dashboard/products/productDetails'),
              localStorage.setItem('master_code', params.row.master_code);
          }}
          icon={<FindInPageIcon sx={{ color: '#635bfe' }} />}
          label="Details"
        />,
      ],
    },
  ];

  const getProducts = async () => {
    try {
      const { data } = await apiService.get('products/all/admin');
      console.log('data', data)
      if (data) {
        if (selectedCompany === 'all') {
          setData(data.products);
        } else {
          console.log('selectedCompany', selectedCompany)
          const filterByCompany = data.products.filter((p: any) => {
            return p.created_by_company === selectedCompany?.split(':')[1];
          });
          setData(filterByCompany);
        }
      }
    } catch (error) {
      console.error("error get products",error);
      // router.push("/auth/sign-in")
    }
  };
  const getCompanyList = async () => {
    try {
      const companyList = await apiService.get('companies');
      setCompanyList(companyList.data.data);
      // if(companyList?.data?.data?.length>=1){
      //   setSelectedCompany(companyList?.data?.data?.[0]?.company_name + ':' + companyList?.data?.data?.[0]?.id + ':' + companyList?.data?.data?.[0]?.currency)
      // }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanyList();
    getProducts();
  }, [selectedCompany]);

  return (
    <div style={{ width: '100%' }}>
      <Typography variant="h4">Product List</Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ marginTop: '15px' }}
        onClick={() => router.push('/dashboard/products/createProduct')}
      >
        Create new product
      </Button>
      <br />
      <br />
      {companyList.length>1&&    <FormControl sx={{ width: '40%' }}>
        <InputLabel>Company</InputLabel>
        <Select
          className="w-full"
          defaultValue={'all'}
          label="Company"
          name="company"
          variant="outlined"
          onChange={(e) => setSelectedCompany(e.target.value)}
        >
          <MenuItem value={'all'}>All Company</MenuItem>
          {companyList?.map((c) => (
            <MenuItem key={c.id} value={c.company_name + ':' + c.id + ':' + c.currency}>
              {c.company_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>}
  
      <br /> <br />
      <div style={{ height: 600, width: '100%' }}>
        {data ? (
          <DataGrid
            rows={data}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            // checkboxSelection
            rowHeight={130}
            // getRowId={(row) => row.product_id}
            getRowId={(row) => row.id}
          />
        ) : null}
      </div>
    </div>
  );
}
