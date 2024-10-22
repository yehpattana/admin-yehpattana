'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Color } from '@/app/color/type';
import { apiService } from '@/axios/axios-interceptor';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  ImageListItem,
  MenuItem,
  Modal,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';

import { companyDataI, createProductInterface } from '@/types/product';

import '@/styles/global.css';

import { ConfigMenu, SubMenu } from '@/app/config/type';

import StockTable from './stockTable';

export interface StockData {
  id?: string;
  size: string;
  price: string | number;
  rrp_price: string | number;
  usd_price: string | number;
  currency: string;
  quantity: string;
  pre_quantity: string;
  productCode: string;
}
export function AddProductsForm(): React.JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stock, setStock] = useState<StockData[]>([
    {
      size: '',
      price: '',
      rrp_price: '',
      usd_price: '',
      currency: '',
      quantity: '',
      pre_quantity: '',
      productCode: '',
    },
  ]);
  const [sizeChartImg, setsizeChartImg] = useState<any>([]);
  const [coverImg, setcoverImg] = useState<any>([]);
  const [frontImg, setFrontImg] = useState([]);
  const [backImg, setBacktImg] = useState([]);

  const [sizeChartImgURL, setsizeChartImgURL] = useState<string>();
  const [coverImageURL, setcoverImageURL] = useState<string>();
  const [frontImgURL, setFrontImgURL] = useState<string>();
  const [backImgURL, setBacktImgURL] = useState<string>();
  const [productData, setProductData] = useState<createProductInterface>(initCreateProduct);
  const [companies, setCompanies] = useState<companyDataI[]>([]);
  const [colorList, setColorList] = useState<Color[]>([]);
  const [collection, setCollection] = useState<SubMenu[]>([]);
  const [category, setCategory] = useState<SubMenu[]>([]);

  const [loading, setLoading] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [masterCodeProductExist, setMasterCodeProductExist] = useState<string>('');
  const [isProductFound, setIsProductFound] = useState<boolean>(false); //.ใข้รวมกับ notFOund ไม่ได้ เพราะ mui modal ไม่รับ null รับ boolean only
  const [isProductNotFound, setIsProductNotFound] = useState<boolean>(false);
  const [isModalProductNotFound, setModalIsProductNotFound] = useState<boolean>(false);
  const [isCoverImageUploaded, setIsCoverImageUploaded] = useState<boolean | null>(null);
  const inputFile = useRef<any>(null);
  const router = useRouter();

  const handleSubmitCheckIfProductExist = async () => {
    setLoading(true);
    setIsloading(true);
    await apiService
      .get(`products/admin/check-product-exist/${masterCodeProductExist}`)
      .then((response) => {
        if (response?.data) {
          setIsProductFound(response.data?.status?.status);
          setIsProductNotFound(false);
          setIsloading(false);
          setLoading(false);
          if (response.data?.status?.status == false) {
            setModalIsProductNotFound(true);
            // setIsProductNotFound(true);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const chooseToCreateNewProduct = () => {
    setModalIsProductNotFound(false),
      setIsProductNotFound(true),
      setProductData({ ...productData, master_code: masterCodeProductExist });
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
  const handleSubmitUploadCoverImage = async () => {
    const formData = new FormData();
    for (let imageKey in coverImg) {
      formData.append('cover_image', coverImg[imageKey]);
    }
    setLoading(true);
    setIsloading(true);
    await apiService
      .post(`products/admin/upload-cover-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        setIsloading(true);
        if (response?.data) {
          setLoading(false);
          setIsloading(false);
          if (response.data?.status?.status == false) {
            // ถ้าไม่มี
            setIsCoverImageUploaded(response.data?.status?.status);
            toast.error(response?.data?.status?.message);
          }
          setIsCoverImageUploaded(response.data?.status?.status);
          setProductData({ ...productData, cover_image: response.data?.data?.image });
          toast.success(response?.data?.status?.message);

          setIsloading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setIsloading(false);
        setLoading(false);
      });
  };

  const handleFrontImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setFrontImg({ ...frontImg, [uniqueId]: event.target.files[0] });
    setFrontImgURL(URLimage);
    setProductData({ ...productData, front_image: event.target.files[0] });
  };
  const handleBackImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setBacktImg({ ...backImg, [uniqueId]: event.target.files[0] });
    setBacktImgURL(URLimage);
    setProductData({ ...productData, back_image: event.target.files[0] });
  };
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    if (event.target.files[0]?.size > 0.5 * 1024 * 1024) {
      // 0.5MB size limit
      toast.error('File size must be less than 0.5MB');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    } else {
      const uniqueId = Math.random().toString(16).slice(2);
      const URLimage = URL.createObjectURL(event.target.files[0]);
      setcoverImg({ ...coverImg, [uniqueId]: event.target.files[0] });
      setcoverImageURL(URLimage);
      setProductData({ ...productData, cover_image: event.target.files[0] });
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
    setProductData({ ...productData, size_chart: event.target.files[0] });
  };

  const handleChangeCreate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name, files } = event.target;

    setProductData({ ...productData, [name]: value });
    if (files) {
      setProductData({ ...productData, [name]: files });
    }
  };

  const createProduct = async () => {
    setLoading(true);
    setIsloading(true);

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('product_code', productData.master_code + productData.color_code_name.split('#')[0]);
    formData.append('master_code', productData.master_code);
    formData.append('created_by_company', productData.created_by_company);
    formData.append('color_code', productData.color_code);
    formData.append('product_status', productData.product_status);
    formData.append('cover_image', productData.cover_image);
    formData.append('front_image', productData.front_image);
    formData.append('back_image', productData.back_image);
    formData.append('price', productData.price);
    formData.append('product_group', productData.product_group);
    formData.append('season', productData.season);
    formData.append('gender', productData.gender);
    formData.append('product_class', productData.product_class);
    formData.append('collection', productData.collection);
    formData.append('category', productData.category);
    formData.append('brand', productData.brand);
    formData.append('is_club', productData.is_club);
    formData.append('club_name', productData.club_name);
    formData.append('remark', productData.remark);
    formData.append('launch_date', productData.launch_date);
    formData.append('end_of_life', productData.end_of_life);
    formData.append('size_chart', productData.size_chart);
    formData.append('pack_size', productData.pack_size);
    formData.append('current_supplier', productData.current_supplier);
    formData.append('description', productData.description);
    formData.append('fabric_content', productData.fabric_content);
    formData.append('fabric_type', productData.fabric_type);
    formData.append('weight', productData.weight);
    formData.append('created_by', localStorage.getItem('email')||"");

    await apiService
      .post('products/create-product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        handleStock(res.data.data.id, stock);
        toast.success(res.data?.status?.message);
        setProductData(initCreateProduct);
        setIsProductFound(false);
        setIsProductNotFound(false);
        setIsCoverImageUploaded(false);
        setLoading(false);
        setIsloading(false);
        router.push('/dashboard/products');
      })
      .catch(function (error) {
        setLoading(false);
        setIsloading(false);
      });
    // }
  };

  const handleStock = async (productId: string, stockDataArray: StockData[]) => {
    try {
      setIsloading(true);

      for (let i = 0; i < stockDataArray.length; i++) {
        const stockItem = stockDataArray[i];

        const formData = new FormData();
        formData.append('product_id', productId);
        formData.append('size', stockItem.size);
        formData.append('price', stockItem.price.toString());
        formData.append('rrp_price', stockItem.rrp_price.toString());
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

  const getColors = async () => {
    const { data } = await apiService.get('color');
    setColorList(data);
  };

  const getConfigMenu = async (id: string) => {
    try {
      const response = await apiService.get(`config-menu/sub-menu/${id}`);
      const filterSubMenu = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === false;
      });
      const filterSubSideMenu = response.data?.filter((d: ConfigMenu) => {
        return d.sideBar === true;
      });
      setCollection(filterSubMenu);
      setCategory(filterSubSideMenu);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCompany();
    getColors();
  }, [isCoverImageUploaded]);

  useEffect(() => {
    setStock([
      {
        size: '',
        price: '',
        rrp_price: '',
        usd_price: '',
        currency: '',
        quantity: '',
        pre_quantity: '',
        productCode: productData.master_code + productData.color_code_name,
      },
    ]);
  }, [productData.color_code_name, productData.master_code]);
  return (
    <>
      <Button variant="contained" startIcon={<ArrowBackIosIcon />} onClick={() => router.push('/dashboard/products')}>
        Back to product List
      </Button>

      <Modal
        open={isProductFound}
        onClose={() => setIsProductFound(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="child-modal-title">Product already existed</h2>

          <Button onClick={() => setIsProductFound(false)}>cancel</Button>
          <Button
            onClick={() => {
              localStorage.setItem('master_code', masterCodeProductExist),
                router.push('/dashboard/products/productDetails');
            }}
          >
            see product detail
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isModalProductNotFound}
        onClose={() => setModalIsProductNotFound(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="child-modal-title">Product Not found</h2>

          <Button onClick={chooseToCreateNewProduct}>Create new product</Button>
          {/* <Button
            onClick={() => {
              localStorage.setItem('master_code', masterCodeProductExist),
                router.push('/dashboard/products/productDetails');
            }}
          >
            see product detail
          </Button> */}
        </Box>
      </Modal>

      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        style={{ marginTop: '15px', width: '100%' }}
      >
        <Card sx={{ overflow: 'auto' }}>
          <CardHeader subheader="" title="Create Product" />
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl>
              <OutlinedInput
                sx={{ color: 'black' }}
                onChange={(event) => setMasterCodeProductExist(event.target.value)}
                value={masterCodeProductExist}
                placeholder="master_code"
                name="master_code"
              />
            </FormControl>
            <Box sx={{ m: 1, position: 'relative' }}>
              <Button
                component="label"
                sx={{ marginLeft: 2 }}
                role={undefined}
                variant="outlined"
                tabIndex={-1}
                disabled={loading}
                startIcon={<SearchIcon />}
                onClick={handleSubmitCheckIfProductExist}
              >
                Search
              </Button>
            </Box>
          </CardContent>

          <Divider />
          {/* this will be show on image upload  */}
          {isProductNotFound && !isModalProductNotFound && (
            <CardContent>
              <Grid container spacing={3}>
                <CardContent sx={{ width: '100%' }}>
                  <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
                    <label htmlFor="" style={{ width: '70%' }}>
                      Main product image <span style={{ color: 'red' }}> * </span>
                      <br />
                      <TextField
                        type="file"
                        inputRef={fileInputRef}
                        inputProps={{ accept: 'image/*' }}
                        onChange={handleCoverImageChange}
                      />{' '}
                      <Button
                        disabled={isCoverImageUploaded == true}
                        onClick={handleSubmitUploadCoverImage}
                        variant="outlined"
                        sx={{ padding: '15px 15px', marginLeft: '1rem' }}
                      >
                        Upload
                      </Button>
                      <Button
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                          setcoverImg([]);
                          setcoverImageURL('');
                          setProductData({ ...productData, cover_image: '' });
                        }}
                        variant="outlined"
                        sx={{ padding: '15px 15px', marginLeft: '1rem' }}
                      >
                        Cancel
                      </Button>
                    </label>

                    {coverImageURL ? (
                      <ImageListItem sx={{ marginBottom: '5px' }}>
                        <img src={coverImageURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                      </ImageListItem>
                    ) : null}
                  </Grid>
                </CardContent>
              </Grid>
            </CardContent>
          )}
          {isCoverImageUploaded && (
            <CardContent>
              <Divider />
              <CardHeader subheader="" title="Product Details" />
              <CardContent>
                <Grid container spacing={3}>
                  <Divider />
                  <br />
                  <Grid item={true} md={6}>
                    <FormControl required fullWidth>
                      <label>
                        Name <span style={{ color: 'red' }}> * </span>
                      </label>
                      <OutlinedInput onChange={handleChangeCreate} value={productData?.name} label="" name="name" />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl required fullWidth>
                      <label htmlFor="">
                        Company <span style={{ color: 'red' }}> * </span>
                      </label>
                      <Select
                        onChange={(event) => {
                          const splitString = event.target.value.split(':');
                          setProductData({ ...productData, created_by_company: splitString[1] });
                          getConfigMenu(splitString[1]);
                        }}
                        name="product_status"
                        defaultValue={productData.created_by_company}
                        // value={productData?.created_by_company}
                      >
                        <MenuItem value={'All Company'}>All Company</MenuItem>
                        {companies &&
                          companies.map((c, i) => {
                            return (
                              <MenuItem key={i} value={c.company_name + ':' + c.id}>
                                {c.company_name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl required fullWidth>
                      <label htmlFor="">
                        Status <span style={{ color: 'red' }}> * </span>
                      </label>
                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, product_status: event.target.value });
                        }}
                        name="product_status"
                        value={productData?.product_status}
                      >
                        <MenuItem value="available">Available</MenuItem>
                        <MenuItem value="out_of_stock">Out of stock</MenuItem>
                        <MenuItem value="hidden">hidden</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label htmlFor="">
                        Gender <span style={{ color: 'red' }}> * </span>
                      </label>

                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, gender: event.target.value });
                        }}
                        name="gender"
                        value={productData?.gender}
                      >
                        <MenuItem value="female">female</MenuItem>
                        <MenuItem value="male">male</MenuItem>
                        <MenuItem value="unisex">unisex</MenuItem>
                        <MenuItem value="kids">kids</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <label>
                      Color code <span style={{ color: 'red' }}> * </span>
                    </label>
                    <FormControl fullWidth>
                      <Select
                        onChange={(event) => {
                          const splitString = event.target.value.split(':');
                          setProductData((prevData) => ({
                            ...prevData,
                            color_code_name: splitString[0],
                            color_code: splitString[1],
                          }));
                        }}
                        name="color_code"
                        defaultValue={productData?.color_code}
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
                      <h3>{productData?.master_code}</h3>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3} xs={12}>
                    <FormControl required fullWidth>
                      <label>Product code</label>
                      <h3>{productData?.master_code + productData.color_code_name}</h3>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Collection (Menu Bar)</label>

                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, collection: event.target.value });
                        }}
                        name="collection"
                        value={productData?.collection}
                      >
                        {collection && collection.map((c) => <MenuItem value={c.name}>{c.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Catagory (Side Bar)</label>
                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, category: event.target.value });
                        }}
                        name="catagory"
                        value={productData?.category}
                      >
                        {category && category.map((c) => <MenuItem value={c.name}>{c.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Product Group</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        value={productData?.product_group}
                        label=""
                        name="product_group"
                      />
                    </FormControl>
                  </Grid>{' '}
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Season</label>
                      <OutlinedInput onChange={handleChangeCreate} value={productData?.season} label="" name="season" />
                    </FormControl>
                  </Grid>{' '}
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>Launch Date</label>
                      <OutlinedInput
                        type="date"
                        onChange={handleChangeCreate}
                        value={productData?.launch_date}
                        label=""
                        name="launch_date"
                      />
                    </FormControl>
                  </Grid>{' '}
                  <Grid item={true} md={6} xs={12}>
                    <FormControl fullWidth>
                      <label>End Of Life</label>
                      <OutlinedInput
                        type="date"
                        onChange={handleChangeCreate}
                        value={productData?.end_of_life}
                        label=""
                        name="end_of_life"
                      />
                    </FormControl>
                  </Grid>{' '}
                  <Grid item={true} md={12}>
                    <FormControl fullWidth>
                      {' '}
                      <label>Description</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        name="description"
                        value={productData?.description}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={12}>
                    <FormControl fullWidth>
                      {' '}
                      <label>Product Style</label>
                      <OutlinedInput onChange={handleChangeCreate} name="remark" value={productData?.remark} />
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              {/* -----2nd section--------------------------- */}
              <Divider />
              <CardContent>
                <br />
                <Grid container spacing={3}>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Product Class</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        name="product_class"
                        value={productData?.product_class}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Brand</label>
                      <OutlinedInput onChange={handleChangeCreate} name="brand" value={productData?.brand} />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Is Club</label>

                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, is_club: event.target.value });
                        }}
                        name="is_club"
                        value={productData?.is_club}
                      >
                        <MenuItem value="true">true</MenuItem>
                        <MenuItem value="false">false</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>ClubName</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        name="club_name"
                        value={productData?.club_name}
                        label=""
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>PackSize</label>

                      <Select
                        onChange={(event) => {
                          setProductData({ ...productData, pack_size: event.target.value });
                        }}
                        name="pack_size"
                        value={productData?.pack_size}
                      >
                        <MenuItem value="Single">Single</MenuItem>
                        <MenuItem value="Set">Set</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Supplier</label>
                      <OutlinedInput
                        onChange={(event) => {
                          setProductData({ ...productData, current_supplier: event.target.value });
                        }}
                        name="current_supplier"
                        label=""
                        value={productData?.current_supplier}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Fabric Content</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        name="fabric_content"
                        label=""
                        value={productData?.fabric_content}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>Fabric Type</label>
                      <OutlinedInput
                        onChange={handleChangeCreate}
                        name="fabric_type"
                        value={productData?.fabric_type}
                        label=""
                      />
                    </FormControl>
                  </Grid>
                  <Grid item={true} md={3}>
                    <FormControl fullWidth>
                      <label>weight</label>
                      <OutlinedInput onChange={handleChangeCreate} name="weight" value={productData?.weight} label="" />
                    </FormControl>
                  </Grid>

                  <CardContent sx={{ width: '100%' }}>
                    <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
                      <label htmlFor="" style={{ width: '70%' }}>
                        Size Chart Image
                        <br />
                        <TextField
                          type="file"
                          ref={inputFile}
                          className="file"
                          onChange={handleSizeChartImageChange}
                        />{' '}
                      </label>

                      {sizeChartImgURL ? (
                        <ImageListItem sx={{ marginBottom: '5px' }}>
                          <img src={sizeChartImgURL} alt="preview img" loading="lazy" style={{ width: '200px' }} />
                        </ImageListItem>
                      ) : null}
                    </Grid>
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

                <Grid lg={12} md={12} xs={12}>
                  <Card sx={{ height: '100%' }}>
                    <CardHeader title="Stock" />
                    <Divider />
                    <StockTable
                      rows={stock}
                      setRows={setStock}
                      productCode={productData.master_code + productData.color_code_name}
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
          )}
        </Card>
      </form>

      {isLoading && (
        <Box sx={{ display: 'flex', position: 'absolute', top: '50%', left: '50%' }}>
          <CircularProgress />
        </Box>
      )}
    </>
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

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
