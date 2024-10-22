'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import '@/styles/global.css';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { apiService } from '@/axios/axios-interceptor';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
  NumberInputProps,
} from '@mui/base/Unstable_NumberInput';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Button,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import { useProducts } from '@/hooks/use-products';

interface rowData {
  id: number;
  mainImg: string;
  ProductCode: string;
  MasterCode: string;
  ColorCode: string;
  Size: { s: number; m: number; l: number; xl: number };
}
interface sizeQuantityI {
  size: string;
  quantity: number;
}
interface Props {
  handleChangeVaraint: any;
}
export default function ProductVariant() {
  const [images, setImages] = useState<any>([]);
  const [imagesBack, setImagesBack] = useState<string[]>([]);
  const [variantImageURL, setVariantImageURL] = useState<string[]>([]); //เอาไว้ prevew img
  const [sizeValue, setSizeValue] = useState<sizeQuantityI[]>([]);

  const { varaintData, handleChangeVaraint, handleVaraintSize } = useProducts();

  const size = ['S', 'M', 'L', 'XL', 'XXL', 'XXXXL'];

  const handleVariantImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setImages([...images, event.target.files[0]]);
    setVariantImageURL([...variantImageURL, URLimage]);
    varaintData.image_front = event.target.files[0];
    if (images.length > 1) {
      varaintData.image_back = images[1];
    }
  };
  const handleBackImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setImagesBack([...imagesBack, URLimage]);
    varaintData.image_back = event.target.files[0];
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    fd.append('product_id', varaintData.product_id);
    fd.append('product_code', varaintData.product_code);
    fd.append('master_code', varaintData.master_code);
    fd.append('color_code', varaintData.color_code);
    fd.append('image_back', varaintData.image_back);

    fd.append('image_front', varaintData.image_front);

    apiService
      .post('products/create-product-variant', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.data.success == true) toast.success(res.data.message);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (images.length > 1) {
      varaintData.image_back = images[1];
    }
  }, [images, varaintData]);
  if (varaintData)
    return (
      <div style={{ width: '100%' }}>
        <CardHeader subheader="" title=" Create Product Varaint" />
        <Stack direction="row" spacing={2}>
          <CardContent sx={{ width: '50%' }}>
            <label htmlFor="">front</label>
            <TextField type="file" onChange={handleVariantImageChange} />
            <br />
            <label htmlFor="">back</label>
            <TextField type="file" onChange={handleBackImageChange} />
            <ImageList sx={{ width: 400, height: 200 }} rowHeight={164}>
              {variantImageURL.map((item) => (
                <ImageListItem key={item}>
                  <img src={item} alt="preview img" loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
            <ImageList sx={{ width: 400, height: 200 }} rowHeight={164}>
              {imagesBack.map((img, i) => (
                <ImageListItem key={i}>
                  <img src={img} alt="preview img" loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
            <FormControl fullWidth>
              <label>Product id</label>
              <OutlinedInput
                name="product_id"
                onChange={handleChangeVaraint}
                defaultValue={varaintData.product_id}
                label=""
              />
            </FormControl>{' '}
            <FormControl fullWidth required>
              <label>Product code</label>
              <OutlinedInput
                name="product_code"
                onChange={handleChangeVaraint}
                defaultValue={varaintData.product_code}
                label=""
              />
            </FormControl>{' '}
            <FormControl fullWidth required>
              <label>Master code</label>
              <OutlinedInput
                name="master_code"
                onChange={handleChangeVaraint}
                defaultValue={varaintData.master_code}
                label=""
              />
            </FormControl>
          </CardContent>

          <Divider orientation="vertical" flexItem />
          <Box>
            <FormControl required>
              <label>Color code</label>
              <OutlinedInput
                name="color_code"
                onChange={handleChangeVaraint}
                defaultValue={varaintData.color_code}
                label=""
              />
              <label>Size</label>
              <Box
                // display="flex"
                // alignItems="center"
                gap={4}
                p={2}
                sx={{
                  border: '2px solid #D9D9D9',
                  borderRadius: '5px',
                  '& .MuiTextField-root': { m: 1, width: '6ch' },
                }}
              >
                {size.map((s, i) => (
                  <Box display="flex" alignItems="center" key={i}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                      <FormControl>
                        <TextField label="Size" id="filled-size-normal" defaultValue={s} />
                      </FormControl>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="center">
                      <CustomNumberInput
                        key={i}
                        value={sizeValue[i]?.quantity}
                        // value={varaintData?.size[i]?.quantity}
                        onChange={(event, val) => {
                          handleVaraintSize(event, s);
                        }}
                        aria-label="Demo number input"
                        placeholder="Type a number…"
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button
                variant="contained"
                // onClick={handleCreateNewVaraint}
                onClick={handleSubmit}
                sx={{ margin: '20px 10px', width: '180px' }}
                startIcon={<AddIcon />}
              >
                product variant
              </Button>
            </FormControl>
          </Box>
        </Stack>

        <Divider />
        {/* ------------------------------------------ */}
        {/* <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            rowHeight={130}
          />
        </div> */}
      </div>
    );
}

const initVaraintData = {
  product_code: '',
  master_code: '',
  color_code: '',
  size: [],
  image_front: '',
  image_back: '',
};

const CustomNumberInput = React.forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
        },
        decrementButton: {
          children: '▾',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

const columns: GridColDef[] = [
  { field: 'id', headerName: 'id', width: 50 },
  {
    field: 'mainImg',
    headerName: 'Image',
    renderCell: (params: GridRenderCellParams<any>) => (
      <Image alt="products1" src={params.value} style={{ width: '100%', height: '100%' }} />
    ),
    width: 150,
  },
  { field: 'MasterCode', headerName: 'Master Code', width: 150 },
  {
    field: 'ProductCode',
    headerName: 'Product Code',
    type: 'number',
    width: 110,
  },
  { field: 'ColorCode', headerName: 'Color Code', width: 150 },
  {
    field: 'size',
    headerName: 'Size',
    width: 150,
    renderCell: (params: GridRenderCellParams<any>) => {
      return (
        <div>
          <p>S:{params.row.Size.s ? params.row.Size.s : 0}</p>
          <p>M:{params.row.Size.m ? params.row.Size.m : 0}</p>
          <p>L:{params.row.Size.l ? params.row.Size.l : 0}</p>
          <p>XL:{params.row.Size.xl ? params.row.Size.xl : 0}</p>
        </div>
      );
    },
  },
];

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 400;
      border-radius: 8px;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
      box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'};
      display: grid;
      grid-template-columns: 1fr 19px;
      grid-template-rows: 1fr 1fr;
      overflow: hidden;
      column-gap: 8px;
      padding: 10px;
      margin:5px;
    
      &.${numberInputClasses.focused} {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
      }
    
      &:hover {
        border-color: ${blue[400]};
      }
    
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
);

const StyledInputElement = styled('input')(
  ({ theme }) => `
      font-size: 0.875rem;
      font-family: inherit;
      font-weight: 400;
      line-height: 1.5;
      grid-column: 1/2;
      grid-row: 1/3;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      background: inherit;
      border: none;
      border-radius: inherit;
      padding: 8px 12px;
      outline: 0;
    `
);

const StyledButton = styled('button')(
  ({ theme }) => `
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
      appearance: none;
      padding: 0;
      width: 19px;
      height: 19px;
      font-family: system-ui, sans-serif;
      font-size: 0.875rem;
      line-height: 1;
      box-sizing: border-box;
      background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
      border: 0;
      color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 120ms;
    
      &:hover {
        background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
        border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
        cursor: pointer;
      }
    
      &.${numberInputClasses.incrementButton} {
        grid-column: 2/3;
        grid-row: 1/2;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border: 1px solid;
        border-bottom: 0;
        border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
        color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    
        &:hover {
          cursor: pointer;
          color: #FFF;
          background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
          border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
        }
      }
    
      &.${numberInputClasses.decrementButton} {
        grid-column: 2/3;
        grid-row: 2/3;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        border: 1px solid;
        border-color: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
        background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
        color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
      }
    
      &:hover {
        cursor: pointer;
        color: #FFF;
        background: ${theme.palette.mode === 'dark' ? blue[600] : blue[500]};
        border-color: ${theme.palette.mode === 'dark' ? blue[400] : blue[600]};
      }
    
      & .arrow {
        transform: translateY(-1px);
      }
    
      & .arrow {
        transform: translateY(-1px);
      }
    `
);
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
