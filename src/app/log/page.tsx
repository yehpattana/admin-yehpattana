'use client';

import { useEffect, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import { Alert, Box, Card, CardHeader, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { Log } from './type';
import moment from 'moment';

export default function Page(): React.JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [logList, setLogList] = useState<Log[]>([]);

  const fetchLog = async () => {
    const { data } = await apiService.get('log');
    setLogList(data);
  };

  useEffect(() => {
    fetchLog();
  }, []);
  return (
    <>
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3}>
        <>
          <Grid lg={12} md={12} xs={12}>
            <Card sx={{ height: '100%' }}>
              <CardHeader title="Log" />
              <Divider />
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 800 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logList?.map((log, i) => {
                      return (
                        <>
                          <TableRow hover key={log.id}>
                            <TableCell>{log.updated_by}</TableCell>
                            <TableCell>{log.description}</TableCell>
                            <TableCell>{moment( log.created_at).format("DD-MM-YYYY Hh-mm-ss")}</TableCell>
                          </TableRow>
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
    </>
  );
}
