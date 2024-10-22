'use client';

import * as React from 'react';
import { Company } from '@/app/config/type';
import { apiService } from '@/axios/axios-interceptor';
import Box from '@mui/material/Box';

import ProductList from '@/components/dashboard/products/productList';

export default function Page(): React.JSX.Element {
  return (
    <Box>
      <ProductList />
    </Box>
  );
}
