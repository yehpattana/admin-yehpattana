'use client';

import { ChangeEvent, useState } from 'react';
import { apiService } from '@/axios/axios-interceptor';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import UploadIcon from '@mui/icons-material/Upload';
import { FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const statusMap = {
  pending: { label: 'pending', color: 'warning' },
  shipping: { label: 'shipping', color: 'info' },
  delivered: { label: 'delivered', color: 'success' },
  refunded: { label: 'refunded', color: 'error' },
} as const;

export interface Order {
  packing_list: string;
  order_no: string;
  tracking_no: string;
  shipping_address: string;
  order_id: string;
  customer_detail: { customer_id: string; contract_name: string; company_name: string };
  amount: number;
  status: 'pending' | 'delivered' | 'refunded';
  created_at: Date;
  updated_at: Date;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ orders = [], sx }: LatestOrdersProps): JSX.Element {
  const [editRow, setEditRow] = useState<null | number>(null);
  const [status, setStatus] = useState('pending');
  const [trackingNo, setTrackingNo] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachment(file);
      console.log('Selected file:', file);
      // Handle file upload logic here
    }
  };

  const handleEdit = async ({ orderId, orderNo, status, trackingNo }: any) => {
    if (attachment) {
      try {
        const formData = new FormData();
        formData.append('file', attachment);

        const response = await apiService.patch(`order/${orderId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (response?.data) {
          toast.success('Save');
          setEditRow(null);
          setStatus('pending');
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await apiService.patch('order', {
          order_no: orderNo,
          status: status,
          tracking_no: trackingNo,
        });
        if (response?.data) {
          toast.success('Save');
          setEditRow(null);
          setStatus('pending');
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order No.</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Tracking No.</TableCell>
              <TableCell>Packing List</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order, i) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };
              return (
                <TableRow hover key={order.order_id}>
                  <TableCell>{order?.order_no}</TableCell>
                  <TableCell>{order?.customer_detail?.company_name}</TableCell>
                  <TableCell>{dayjs(order.created_at).format('DD-MM-YYYY')}</TableCell>
                  <TableCell>
                    {editRow === i ? (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          defaultValue={label}
                          onChange={(e) => {
                            console.log('e.tartger.value', e.target.value);
                            setStatus(e.target.value);
                          }}
                          label="Status"
                          name="status"
                          variant="outlined"
                        >
                          {['pending', 'shipping', 'delivered', 'refunded'].map((s) => (
                            <MenuItem key={s} value={s}>
                              {s}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Chip color={color} label={label} size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {editRow === i ? (
                      <FormControl fullWidth>
                        <InputLabel>Tracking No.</InputLabel>
                        <OutlinedInput
                          defaultValue={order?.tracking_no}
                          label="Tracking No"
                          onChange={(e) => setTrackingNo(e.target.value)}
                        />
                      </FormControl>
                    ) : (
                      order?.tracking_no
                    )}
                  </TableCell>
                  <TableCell>
                    {editRow === i ? (
                      <>
                        {attachment || order.packing_list ? (
                          <PictureAsPdfIcon
                            color="primary"
                            fontSize="large"
                            onClick={() => window.open(order.packing_list, '_blank')}
                          />
                        ) : (
                          <>
                            <label htmlFor="upload-file" className="cursor-pointer">
                              <IconButton component="span" color="primary" size="large">
                                <UploadIcon />
                              </IconButton>
                            </label>
                            <input
                              id="upload-file"
                              type="file"
                              style={{ display: 'none' }}
                              onChange={handleFileUpload}
                            />
                          </>
                        )}
                      </>
                    ) : order.packing_list && order.packing_list !== '' ? (
                      <PictureAsPdfIcon
                        color="primary"
                        fontSize="large"
                        className="cursor-pointer"
                        onClick={() => window.open(order.packing_list, '_blank')}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {editRow === i ? (
                      <>
                        <Button
                          onClick={() =>
                            handleEdit({
                              orderId: order.order_id,
                              orderNo: order.order_no,
                              status: status,
                              trackingNo: trackingNo,
                            })
                          }
                        >
                          Save
                        </Button>
                        <Button onClick={() => setEditRow(null)}>Cancle</Button>
                      </>
                    ) : (
                      <EditIcon
                        className="cursor-pointer"
                        fontSize="medium"
                        onClick={() => {
                          setEditRow(i);
                          setAttachment(null);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}
