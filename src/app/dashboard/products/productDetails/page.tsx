import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import ProductDetails from '@/components/dashboard/products/productDetails';

export const metadata = { title: `Orders | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Grid container spacing={3}>
      <ProductDetails />
    </Grid>
  );
}
