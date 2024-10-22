'use client';

import React, { useEffect, useState } from 'react';
import { Color } from '@/app/color/type';
import { apiService } from '@/axios/axios-interceptor';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  ImageListItem,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

import { companyDataI, createProductInterface } from '@/types/product';

import StockTable from './stockTable';

interface StockData {
  id?: string;
  size: string;
  price: string;
  rrp_price: string;
  usd_price: string;
  currency: string;
  quantity: string;
  pre_quantity: string;
  productCode: string;
}
interface IProps {
  productMain: any;
  handleClose: any;
  productVariant: any[];
}
export default function EditMainProduct({ productMain, handleClose, productVariant }: IProps) {
  const [addVariantProduct, setAddVariantProduct] = useState<createProductInterface>(initCreateProduct);
  const [companies, setCompanies] = useState<companyDataI[]>([]);
  const [colorList, setColorList] = useState<Color[]>([]);
  /* ------------------- */
  const [sizeChartImgURL, setsizeChartImgURL] = useState<string>();
  const [frontImgURL, setFrontImgURL] = useState<string>();
  const [backImgURL, setBacktImgURL] = useState<string>();

  const [sizeChartImg, setsizeChartImg] = useState<any>([]);
  const [frontImg, setFrontImg] = useState([]);
  const [backImg, setBacktImg] = useState([]);

  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [stock, setStock] = useState<StockData[]>([
    {
      id: '',
      size: '',
      price: '',
      rrp_price: '',
      usd_price: '',
      currency: '',
      quantity: '',
      pre_quantity: '',
      productCode: productMain.master_code + addVariantProduct.color_code_name,
    },
  ]);

  const handleFrontImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setFrontImg({ ...frontImg, [uniqueId]: event.target.files[0] });
    setFrontImgURL(URLimage);
    setAddVariantProduct({ ...addVariantProduct, front_image: event.target.files[0] });
  };
  const handleBackImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setBacktImg({ ...backImg, [uniqueId]: event.target.files[0] });
    setBacktImgURL(URLimage);
    setAddVariantProduct({ ...addVariantProduct, back_image: event.target.files[0] });
  };
  const getCompany = async () => {
    try {
      const response = await apiService.get('companies');
      if (response.data) {
        setCompanies(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getColors = async () => {
    const { data } = await apiService.get('color');
    setColorList(data);
  };

  const createProduct = async () => {
    setLoading(true);
    setIsloading(true);
    //TODO validate
    const filterDuplicateColor = productVariant?.filter((v) => v.color_code === addVariantProduct.color_code);
    if (filterDuplicateColor.length > 0) {
      toast.error(`Duplicate Color ${addVariantProduct.color_code_name}`);
    } else {
      const formData = new FormData();
      formData.append('name', productMain.name);
      formData.append('product_code', productMain.master_code + addVariantProduct.color_code_name);
      formData.append('master_code', productMain.master_code);
      formData.append('created_by_company', productMain.created_by_company);
      formData.append('color_code', addVariantProduct.color_code);
      formData.append('product_status', addVariantProduct.product_status);
      formData.append('cover_image', addVariantProduct.cover_image);
      formData.append('front_image', addVariantProduct.front_image);
      formData.append('back_image', addVariantProduct.back_image);
      formData.append('price', '0');
      formData.append('product_group', productMain.product_group);
      formData.append('season', productMain.season);
      formData.append('gender', productMain.gender);
      formData.append('product_class', productMain.product_class);
      formData.append('collection', productMain.collection);
      formData.append('category', productMain.category);
      formData.append('brand', productMain.brand);
      formData.append('is_club', productMain.is_club);
      formData.append('club_name', productMain.club_name);
      formData.append('remark', productMain.remark);
      formData.append('launch_date', productMain.launch_date);
      formData.append('end_of_life', productMain.end_of_life);
      formData.append('size_chart', productMain.size_chart);
      formData.append('pack_size', productMain.pack_size);
      formData.append('current_supplier', productMain.current_supplier);
      formData.append('description', productMain.description);
      formData.append('fabric_content', productMain.fabric_content);
      formData.append('fabric_type', productMain.fabric_type);
      formData.append('weight', productMain.weight);
      formData.append('created_by', localStorage.getItem('email') || 'admin');

      await apiService
        .post('products/create-product', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          handleStock(res.data.data.id, stock);
          toast.success(res.data?.status?.message);
          setAddVariantProduct(initCreateProduct);
          handleClose();
          setLoading(false);
          setIsloading(false);
        })
        .catch(function (error) {
          setLoading(false);
          setIsloading(false);
        });
    }
  };
  const handleStock = async (productId: string, stockDataArray: StockData[]) => {
    try {
      setIsloading(true);

      for (let i = 0; i < stockDataArray.length; i++) {
        const stockItem = stockDataArray[i];

        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('size', stockItem.size);
        formData.append('price', stockItem.price);
        formData.append('rrp_price', stockItem.rrp_price);
        formData.append('currency', stockItem.currency);
        formData.append('quantity', stockItem.quantity);
        formData.append('pre_quantity', stockItem.pre_quantity);

        const response = await apiService.post('products/create-stock', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        toast.success(response.data.status.message);
      }

      setIsloading(false); // Set loading state to false after all requests are done
    } catch (error) {
      console.error('Error while creating stocks:', error);
      setIsloading(false); // Ensure loading state is reset on error
    }
  };
  const handleSizeChartImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);

    setsizeChartImg({
      ...sizeChartImg,
      [uniqueId]: event.target.files[0],

      //0 คือตัวที่ client เลือกมา
    });
    setsizeChartImgURL(URLimage);
    setAddVariantProduct({ ...addVariantProduct, size_chart: event.target.files[0] });
  };

  useEffect(() => {
    getCompany();
    getColors();
    setIsSubmit(false);
  }, [isSubmit]);

  return (
    <Box sx={{ width: '100%' }}>
      <form style={{ display: 'flex', padding: '15px' }}>
        <CardContent>
          <Divider />
          <CardHeader subheader="" title="Product Details" />
          <CardContent>
            <Grid container spacing={3}>
              <Divider />
              <br />
              <Grid item={true} md={3}>
                <FormControl required fullWidth>
                  <label htmlFor="">
                    Status <span style={{ color: 'red' }}> * </span>
                  </label>
                  <Select
                    onChange={(event) => {
                      setAddVariantProduct({ ...addVariantProduct, product_status: event.target.value });
                    }}
                    name="product_status"
                    value={addVariantProduct?.product_status}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="out_of_stock">Out of stock</MenuItem>
                    <MenuItem value="hidden">hidden</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {/* <Grid item={true} md={3}>
                <FormControl fullWidth>
                  <label htmlFor="">
                    Gender <span style={{ color: 'red' }}> * </span>
                  </label>

                  <Select
                    onChange={(event) => {
                      setAddVariantProduct({ ...addVariantProduct, gender: event.target.value });
                    }}
                    name="gender"
                    value={addVariantProduct?.gender}
                  >
                    <MenuItem value="female">female</MenuItem>
                    <MenuItem value="male">male</MenuItem>
                    <MenuItem value="unisex">unisex</MenuItem>
                    <MenuItem value="kids">kids</MenuItem>
                  </Select>
                </FormControl>
              </Grid> */}
              <Grid item={true} md={3}>
                <label>
                  Color code <span style={{ color: 'red' }}> * </span>
                </label>
                <FormControl fullWidth>
                  <Select
                    onChange={(event) => {
                      const splitString = event.target.value.split(':');
                      setAddVariantProduct((prevData) => ({
                        ...prevData,
                        color_code_name: splitString[0],
                        color_code: splitString[1],
                      }));
                    }}
                    name="color_code"
                    defaultValue={addVariantProduct?.color_code}
                  >
                    {colorList &&
                      colorList.map((c, i) => {
                        return (
                          <MenuItem key={i} value={c.codeName + ':' + c.code}>
                            {c.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item={true} md={3} xs={12}>
                <FormControl required fullWidth>
                  <label>Master code</label>
                  <h3>{productMain?.master_code}</h3>
                </FormControl>
              </Grid>
              <Grid item={true} md={3} xs={12}>
                <FormControl required fullWidth>
                  <label>Product code</label>
                  <h3>{productMain?.master_code + addVariantProduct.color_code_name}</h3>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          {/* -----2nd section--------------------------- */}
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <CardContent sx={{ width: '100%' }}>
                {/* <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
                  <label htmlFor="" style={{ width: '70%' }}>
                    Size Chart Image
                    <br />
                    <TextField type="file" className="file" onChange={handleSizeChartImageChange} />{' '}
                  </label>

                  {sizeChartImgURL ? (
                    <ImageListItem sx={{ marginBottom: '5px' }}>
                      <img src={sizeChartImgURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                    </ImageListItem>
                  ) : null}
                </Grid> */}
                <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
                  <FormControl required fullWidth>
                    <label htmlFor="" style={{ width: '70%' }}>
                      Front image <span style={{ color: 'red' }}> * </span>
                      <br />
                      <TextField type="file" onChange={handleFrontImageChange} />{' '}
                    </label>
                  </FormControl>

                  {frontImgURL ? (
                    <ImageListItem sx={{ marginBottom: '5px' }}>
                      <img src={frontImgURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                    </ImageListItem>
                  ) : null}
                </Grid>
                <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
                  <FormControl required fullWidth>
                    <label htmlFor="" style={{ width: '70%' }}>
                      Back image <span style={{ color: 'red' }}> * </span>
                      <br />
                      <TextField type="file" onChange={handleBackImageChange} />{' '}
                    </label>
                  </FormControl>

                  {backImgURL ? (
                    <ImageListItem sx={{ marginBottom: '5px' }}>
                      <img src={backImgURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                    </ImageListItem>
                  ) : null}
                </Grid>
              </CardContent>
            </Grid>
          </CardContent>

          <Divider />
          <CardContent>
            <br />

            <Grid item={true} lg={12} md={12} xs={12}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Stock" />
                <Divider />
                <StockTable
                  rows={stock}
                  setRows={setStock}
                  productCode={productMain.master_code + addVariantProduct.color_code_name}
                />
                <Divider />
              </Card>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <Button disabled={loading} variant="contained" type="submit" onClick={createProduct}>
              Create product
            </Button>
          </CardActions>
        </CardContent>
      </form>
    </Box>
  );
}
let initCreateProduct = {
  name: '',
  product_code: '',
  master_code: '',
  color_code: '',
  color_code_name: '',
  product_status: '', //(available, hidden, out_of_stock)
  cover_image: '',
  front_image: '',
  back_image: '',
  price: '',
  product_group: '',
  season: '',
  gender: '',
  product_class: '',
  collection: '',
  category: '',
  brand: '',
  is_club: '',
  club_name: '',
  remark: '',
  launch_date: '',
  end_of_life: '',
  size_chart: '', //size img
  pack_size: '',
  current_supplier: '',
  description: '',
  fabric_content: '',
  fabric_type: '',
  weight: '',
  created_by: '',
  created_by_company: '',
};
