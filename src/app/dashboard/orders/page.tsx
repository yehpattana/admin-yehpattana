"use client"
import { apiService } from '@/axios/axios-interceptor';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { useEffect, useState } from 'react';

// export const metadata = { title: `Orders | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  const [orderList,setOrderList]=useState<any[]>()
  const fetchOrders = async () => {
    const data = await apiService.get('order');
    setOrderList(data.data)
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid lg={12} md={12} xs={12}>
        <LatestOrders
          orders={orderList}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
