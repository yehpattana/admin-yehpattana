'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ConfigMenu, SubMenu } from '@/app/config/type';
import { apiService } from '@/axios/axios-interceptor';
import { decodeToken } from '@/utils/jwt';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import {
  Box,
  Button,
  CircularProgress /* ---- */,
  Collapse /* ---- */,
  FormControl,
  Grid,
  IconButton,
  ImageListItem,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { toast } from 'react-toastify';

import { companyDataI, responseProductVariant, updateMainProductDetail, updateProductVariant } from '@/types/product';

import { StockData } from './addProducts';
import EditMainProduct from './editProduct';
import SizeChartModal from './ModalSizeChart';
import StockTable from './stockTable';

export default function ProductDetails() {
  const [isLoading, setIsloading] = useState(false);
  const [product, setProduct] = useState<any>();
  const [productV, setProductV] = useState<responseProductVariant[]>([]);
  const [updatePrimaryProduct, setUpdatePrimaryProduct] = useState<updateMainProductDetail>(initUpdatePrimaryProduct);
  const [companies, setCompanies] = useState<companyDataI[]>([]);
  const [collection, setCollection] = useState<SubMenu[]>([]);
  const [category, setCategory] = useState<SubMenu[]>([]);

  /* ------------Updating state----------- */
  const [coverImg, setcoverImg] = useState<any>([]);
  const [coverImageURL, setcoverImageURL] = useState<string>();
  /* ------------/Updating state----------- */

  /* -------------- checking edit steps ----------- */
  const [isEditPrimaryProduct, setisEditPrimaryProduct] = useState(false);
  const [isEditCoverImage, setIsEditCoverImage] = useState(false);
  const [isAddProductVariant, setIsAddProductVariant] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  const router = useRouter();
  const handleisEditPrimaryProduct = () => {
    setisEditPrimaryProduct(!isEditPrimaryProduct);
  };
  const handleCloseDelModal = () => setIsConfirmDelete(false);

  const getProductDetails = async (url: string) => {
    try {
      const response = await apiService.get(url);
      if (response.data) {
        // console.log(response.data);
        setProduct(response.data.main_product_data);
        console.log('response.data.main_product_data', companies);
        setUpdatePrimaryProduct(response.data.main_product_data);
        // setUpdatePrimaryProduct({...response.data.main_product_data,created_by_company:companies.filter((c)=>c.id===response.data.main_product_data.created_by_company)});
        setProductV(response.data.product_varaints);
        // setAllCompanyData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async () => {
    let masterCode = localStorage.getItem('master_code');
    if (masterCode) {
      await apiService
        ._delete(`products/admin/delete-all-product-in-master-code/${masterCode}`, null)
        .then((res) => {
          console.log(res.data);
          toast.success(res.data.status.message);
          setSubmitted(true);
          router.push('/dashboard/products');
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handleCloseAddVariant = () => {
    setIsAddProductVariant(false);
    setSubmitted(true);
  };
  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      setcoverImageURL('');
    } else if (event.target.files[0]) {
      const uniqueId = Math.random().toString(16).slice(2);
      const URLimage = URL.createObjectURL(event.target.files[0]);
      if (URLimage) {
        setcoverImg({ ...coverImg, [uniqueId]: event.target.files[0] });
        setcoverImageURL(URLimage);
        // setUpdateProduct({ ...updateProduct, cover_image: event.target.files[0] });
      }
    }
  };
  const handleSubmitUpdateCoverImage = async () => {
    const formData = new FormData();
    //   formData.append('master_code', master_codel);
    for (let imageKey in coverImg) {
      console.log(coverImg[imageKey]);
      formData.append('cover_image', coverImg[imageKey]);
    }
    setIsloading(true);

    await apiService
      .post(`products/admin/upload-cover-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        setSubmitted(true);
        if (response?.data) {
          console.log(response.data);
          console.log(response.data.data.image);
          if (response.data?.status?.status == true) {
            let master_codel = localStorage.getItem('master_code');
            if (master_codel) {
              const formDataII = new FormData();
              formData.append('master_code', master_codel);
              formData.append('cover_image', response.data.data.image);
              let data = {
                cover_image: response.data.data.image,
                master_code: master_codel,
              };
              apiService
                .patch(`products/admin/update-cover-image`, data, {
                  headers: { 'Content-Type': 'application/json' },
                })
                .then((response) => {
                  setSubmitted(true);
                  if (response?.data) {
                    console.log(response.data);
                    if (response.data?.status?.status == false) {
                      toast.error(response?.data?.status?.message);
                    }
                    //   setisCoverImageUploaded(response.data?.status?.status);
                    //   setProductData({ ...productData, cover_image: response.data?.data?.image });
                    toast.success(response?.data?.status?.message);

                    setIsloading(false);
                  }
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          }
          //   setisCoverImageUploaded(response.data?.status?.status);
          //   setProductData({ ...productData, cover_image: response.data?.data?.image });
          toast.success(response?.data?.status?.message);

          setIsloading(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleChangeUpdatePrimaryproduct = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setUpdatePrimaryProduct({ ...updatePrimaryProduct, [name]: value });
  };
  const handleSubmitUpdatePrimaryProduct = async () => {
    setIsloading(true);
    let master_code = localStorage.getItem('master_code');
    if (master_code) {
      const formData = new FormData();
      formData.append('master_code', master_code);
      formData.append('name', updatePrimaryProduct.name);
      formData.append('cover_image', updatePrimaryProduct.cover_image);
      formData.append('product_status', updatePrimaryProduct.product_status);
      formData.append('product_group', updatePrimaryProduct.product_group);
      formData.append('nseasoname', updatePrimaryProduct.season);
      formData.append('gender', updatePrimaryProduct.gender);
      formData.append('product_class', updatePrimaryProduct.product_class);
      formData.append('collection', updatePrimaryProduct.collection);
      formData.append('category', updatePrimaryProduct.category);
      formData.append('brand', updatePrimaryProduct.brand);
      formData.append('is_club', updatePrimaryProduct.is_club);
      formData.append('club_name', updatePrimaryProduct.club_name);
      formData.append('remark', updatePrimaryProduct.remark);
      formData.append('launch_date', updatePrimaryProduct.launch_date);
      formData.append('end_of_life', updatePrimaryProduct.end_of_life);
      formData.append('size_chart', updatePrimaryProduct.size_chart);
      formData.append('pack_size', updatePrimaryProduct.pack_size);
      formData.append('current_supplier', updatePrimaryProduct.current_supplier);
      formData.append('description', updatePrimaryProduct.description);
      formData.append('fabric_content', updatePrimaryProduct.fabric_content);
      formData.append('fabric_type', updatePrimaryProduct.fabric_type);
      formData.append('weight', updatePrimaryProduct.weight);
      formData.append('edited_by', localStorage.getItem('email') || updatePrimaryProduct.edited_by);
      formData.append('created_by_company', updatePrimaryProduct.created_by_company);
      await apiService
        .patch('products/admin/update-main-product-detail', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          toast.success(res.data?.status?.message);

          setIsloading(false);
          router.push('/dashboard/products');
        })
        .catch(function (error) {
          setIsloading(false);
        });
    }
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

  // Convert ISO date to YYYY-MM-DD
  const getDateValue = (isoDate: string) => {
    return isoDate.split('T')[0]; // Extracts '1900-01-01' from '1900-01-01T00:00:00Z'
  };

  useEffect(() => {
    let master_code = localStorage.getItem('master_code');
    getProductDetails(`products/admin/${master_code}`);
    getCompany();
    setSubmitted(false);
  }, [isSubmitted]);
  useEffect(() => {
    const companyId = companies.find((c) => c.id === updatePrimaryProduct.created_by_company);
    if (companyId) {
      console.log('companyId', companyId);
      getConfigMenu(companyId.id);
    }
  }, [updatePrimaryProduct.created_by_company]);

  if (product && productV)
    return (
      <div style={{ width: '100%', height: '100vh' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
          <Button
            sx={{ marginBottom: 4 }}
            variant="contained"
            startIcon={<ArrowBackIosIcon />}
            onClick={() => router.push('/dashboard/products')}
          >
            Back to product List
          </Button>
          <Button
            sx={{ marginBottom: 4 }}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setIsConfirmDelete(true)}
          >
            Delete Product
          </Button>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', position: 'absolute', top: '50%', left: '50%' }}>
            <CircularProgress />
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Box>
            <Box>
              <Box sx={{ display: 'flex' }}>
                <Button onClick={() => setIsEditCoverImage(!isEditCoverImage)}>
                  <ModeEditIcon />
                </Button>

                {isEditCoverImage && (
                  <Box sx={{ width: '90%', display: 'flex', justifyContent: 'space-evenly' }}>
                    {/* <CardHeader subheader="" title="Main product image" /> */}
                    <TextField
                      type="file"
                      sx={{ width: '250px' }}
                      inputProps={{ accept: 'image/png, image/jpeg' }}
                      // ref={inputFile}
                      // value={productData.cover_image}
                      onChange={handleCoverImageChange}
                    />{' '}
                    <Button onClick={handleSubmitUpdateCoverImage} variant="outlined" sx={{ padding: '5px 5px' }}>
                      save
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
            <br />
            {coverImageURL ? (
              <img src={coverImageURL} alt="preview img" loading="lazy" style={{ width: '400px', height: 'auto' }} />
            ) : (
              <img
                alt="productimg"
                style={{ width: '400px' }}
                src={
                  product?.cover_image !== ''
                    ? product?.cover_image
                    : 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a48dcadb35e440ccb0cbacca004a49c6_9366/HEAT.RDY_Warrior_Tee_White_GT8267_01_laydown.jpg'
                }
              />
            )}
          </Box>
          {/* Details */}
          <Box sx={{ height: '100%', paddingLeft: 5 }}>
            <Typography variant="h5"> {product.name != '' ? product.name : '-'}</Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}>master code : </span>{' '}
              {product.master_code != '' ? product.master_code : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}>status : </span>{' '}
              {product.product_status != '' ? product.product_status : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> gender :</span> {product.gender != '' ? product.gender : '-'}
            </Typography>
            <Typography variant="body1">
              {' '}
              <span style={{ fontWeight: 600 }}> collection :</span>{' '}
              {product.collection != '' ? product.collection : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> description : </span>{' '}
              {product.description != '' ? product.description : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> current_supplier : </span>{' '}
              {product.current_supplier != '' ? product.current_supplier : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> Fabric type : </span>{' '}
              {product.fabric_type != '' ? product.fabric_type : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> Fabric content :</span>{' '}
              {product.product_status != '' ? product.product_status : '-'}
            </Typography>
            <Typography variant="body1">
              {' '}
              <span style={{ fontWeight: 600 }}>created_by :</span>{' '}
              {product.created_by != '' ? product.created_by : '-'}
            </Typography>
            {/* 0--------- */}
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> Pack size :</span> {product.pack_size != '' ? product.pack_size : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> Product Style :</span> {product.remark != '' ? product.remark : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}> updated at :</span>{' '}
              {product.updated_at != '' ? moment(product.updated_at).format('DD/MM/YYYY') : '-'}
            </Typography>
            <Typography variant="body1">
              <span style={{ fontWeight: 600 }}>weight :</span> {product.weight != '' ? product.weight : '-'}
            </Typography>
          </Box>

          <Box sx={{ width: '200px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              sx={{ width: '100px', padding: '10px' }}
              startIcon={isEditPrimaryProduct == true ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              variant="outlined"
              onClick={handleisEditPrimaryProduct}
            >
              {' '}
              Edit
            </Button>
          </Box>
        </Box>
        <br />
        {isEditPrimaryProduct && (
          <Box sx={{ height: '450px', borderRadius: '15px', background: '#f6f5f5' }}>
            <Box sx={{ width: '100%' }}>
              <form style={{ display: 'flex', padding: '15px' }}>
                <Box sx={{ width: '25%' }}>
                  <FormControl>
                    <label style={{ width: '200px' }}>
                      Name <span style={{ color: 'red' }}> * </span> : {''}{' '}
                    </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.name}
                      name="name"
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />{' '}
                  </FormControl>
                  <br />
                  <FormControl>
                    <label htmlFor="">
                      Status <span style={{ color: 'red' }}> * </span> : {''}{' '}
                    </label>
                    <Select
                      sx={{ width: '210px', marginBottom: '5px' }}
                      size="small"
                      value={updatePrimaryProduct.product_status}
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, product_status: event.target.value });
                      }}
                      name="product_status"
                    >
                      <MenuItem value="available">Available</MenuItem>
                      <MenuItem value="out_of_stock">Out of stock</MenuItem>
                      <MenuItem value="hidden">hidden</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Product group :</label>
                    <TextField
                      name="product_group"
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.product_group}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Season : {''} </label>{' '}
                    <TextField
                      name="season"
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.season}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label htmlFor="">
                      Gender <span style={{ color: 'red' }}> * </span> :{' '}
                    </label>{' '}
                    <Select
                      value={updatePrimaryProduct.gender}
                      sx={{ width: '210px', marginBottom: '5px' }}
                      size="small"
                      //   onChange={handleChangeUpdatePrimaryproduct}
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, gender: event.target.value });
                      }}
                      name="gender"
                      // value={productData?.gender}
                    >
                      <MenuItem value="female">female</MenuItem>
                      <MenuItem value="male">male</MenuItem>
                      <MenuItem value="unisex">unisex</MenuItem>
                      <MenuItem value="kids">kids</MenuItem>
                    </Select>
                  </FormControl>
                  <br />

                  <br />
                </Box>
                <Box sx={{ width: '25%' }}>
                  {' '}
                  <FormControl>
                    <label>Product class : {''} </label>
                    <TextField
                      name="product_class"
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.product_class}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Collection : {''} </label>
                    <Select
                      value={updatePrimaryProduct?.collection || ''}
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, collection: event.target.value });
                      }}
                      name="collection"
                      size="small"
                      sx={{ width: '210px', marginBottom: '5px' }}
                      defaultValue={updatePrimaryProduct.collection}
                    >
                      <MenuItem value="-">-</MenuItem>
                      {collection &&
                        collection.map((c, i) => (
                          <MenuItem key={i} value={c.name}>
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <label>Category : {''} </label>
                    <Select
                      sx={{ width: '210px', marginBottom: '5px' }}
                      size="small"
                      value={updatePrimaryProduct.category}
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, category: event.target.value });
                      }}
                      name="product_status"
                    >
                      <MenuItem value="-">-</MenuItem>
                      {category && category.map((c) => <MenuItem value={c.name}>{c.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Brand : {''} </label>{' '}
                    <TextField
                      name="brand"
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.brand}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <FormControl>
                    <label>is club : {''} </label>
                    <Select
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, is_club: event.target.value });
                      }}
                      name="is_club"
                      value={updatePrimaryProduct?.is_club}
                      sx={{ width: '210px', marginBottom: '5px' }}
                      size="small"
                    >
                      <MenuItem value="true">true</MenuItem>
                      <MenuItem value="false">false</MenuItem>
                    </Select>
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>club name : {''} </label>{' '}
                    <TextField
                      name="club_name"
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.club_name}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <br />
                </Box>{' '}
                <Box sx={{ width: '25%' }}>
                  <FormControl>
                    <label>Product Style : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.remark}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="remark"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Launch date : {''} </label>
                    <TextField
                      type="date"
                      name="launch_date"
                      sx={{ marginBottom: '5px', width: '100%' }}
                      id="outlined-size-small"
                      value={getDateValue(updatePrimaryProduct.launch_date)}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Size chart : {''} </label>
                    <SizeChartModal
                      url={typeof updatePrimaryProduct.size_chart === 'string' ? updatePrimaryProduct?.size_chart:""}
                      masterCode={updatePrimaryProduct.master_code}
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Pack size : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.pack_size}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="pack_size"
                    />
                  </FormControl>
                  <FormControl>
                    <label>Current supplier : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.current_supplier}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="current_supplier"
                    />
                  </FormControl>
                  <br />{' '}
                  <FormControl>
                    <label>Description : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.description}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="description"
                    />
                  </FormControl>
                </Box>{' '}
                <Box sx={{ height: '100%', width: '25%' }}>
                  <FormControl>
                    <label>Fabric type : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.fabric_type}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="fabric_type"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>End Of Life : {''} </label>
                    <TextField
                      type="date"
                      name="end_of_life"
                      sx={{ marginBottom: '5px', width: '100%' }}
                      id="outlined-size-small"
                      value={getDateValue(updatePrimaryProduct.end_of_life)}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                    />
                  </FormControl>
                  <br />
                  <FormControl>
                    <label>Fabric content : {''} </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.fabric_content}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="fabric_content"
                    />
                  </FormControl>

                  <br />
                  <FormControl>
                    <label>
                      weight <span style={{ color: 'red' }}> * </span> : {''}{' '}
                    </label>
                    <TextField
                      sx={{ marginBottom: '5px' }}
                      id="outlined-size-small"
                      value={updatePrimaryProduct.weight}
                      onChange={handleChangeUpdatePrimaryproduct}
                      size="small"
                      name="weight"
                    />
                  </FormControl>

                  <br />
                  <FormControl required>
                    <label htmlFor="">
                      Company <span style={{ color: 'red' }}> * </span>
                    </label>
                    <Select
                      value={updatePrimaryProduct?.created_by_company || ''}
                      onChange={(event) => {
                        setUpdatePrimaryProduct({ ...updatePrimaryProduct, created_by_company: event.target.value });
                      }}
                      name="created_by_company"
                      size="small"
                      sx={{ width: '210px', marginBottom: '5px' }}
                      defaultValue={updatePrimaryProduct.created_by_company}
                    >
                      {/* <MenuItem value={'All Company'}>All Company</MenuItem> */}
                      {companies &&
                        companies.map((c, i) => {
                          return (
                            // <MenuItem key={i} value={c.company_name + ':' + c.id}>
                            <MenuItem key={i} value={c.id}>
                              {c.company_name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </FormControl>
                  <Box marginTop={3}>
                    <Button variant="contained" onClick={handleSubmitUpdatePrimaryProduct}>
                      Save
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        )}
        {isAddProductVariant && (
          <EditMainProduct productMain={product} productVariant={productV} handleClose={handleCloseAddVariant} />
        )}
        <br />
        <Box sx={{ display: 'flex', alignItems: 'cenetr' }}>
          <Typography variant="h5">Product Variant</Typography>
          <Button sx={{ padding: 0 }} onClick={() => setIsAddProductVariant(!isAddProductVariant)}>
            <AddIcon />
          </Button>
        </Box>

        <br />

        <Box>
          <CollapsibleTable productVariant={productV} setSubmitted={setSubmitted} />
          <Box></Box>
          <Modal
            open={isConfirmDelete}
            onClose={handleCloseDelModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: 'absolute' as 'absolute',
                top: '35%',
                right: '0',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                borderRadius: '15px',

                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this product ?
              </Typography>
              <Box sx={{ marginTop: '10px' }}>
                <Button variant="contained" color="error" onClick={deleteProduct} sx={{ marginRight: '5px' }}>
                  Yes
                </Button>
                <Button variant="contained" onClick={handleCloseDelModal}>
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </div>
    );
}
interface stock {
  pre_quantity: any;
  currency: string;
  created_at: string;
  id: string;
  item_status: string;
  product_id: string;
  quantity: number | string;
  size: string;
  remark: string;
  updated_at: string;
  price: number;
  rrp_price: number;
  usd_price: number;
}
function createData(
  back_image: string,
  front_image: string,
  color_code: string,
  price: string,
  rrp_price: string,
  product_code: string,
  product_id: string,
  stock: stock[],
  use_as_primary_data: boolean
) {
  return {
    back_image,
    front_image,
    color_code,
    price,
    product_code,
    product_id,
    stock,
    rrp_price,
    use_as_primary_data,
  };
}

function Row(props: { row: ReturnType<typeof createData>; setSubmitted: any }) {
  const { row, setSubmitted } = props;
  const { stock } = row;
  const [openEditStock, setOpenEditStock] = useState(false);
  const [frontImgURL, setFrontImgURL] = useState<string>();
  const [backImgURL, setBacktImgURL] = useState<string>();
  const [imageVariant, setImageVariant] = useState<updateProductVariant>({
    front_image: row?.front_image || '',
    back_image: row?.back_image || '',
    use_as_primary_data: row?.use_as_primary_data || false,
    product_id: row?.product_id || '',
  });

  const [frontImg, setFrontImg] = useState([]);
  const [backImg, setBacktImg] = useState([]);
  const { min, max } = row.stock.reduce(
    (acc, item) => {
      if (item?.price < acc.min) {
        acc.min = item?.price;
      }
      if (item?.price > acc.max) {
        acc.max = item?.price;
      }
      return acc;
    },
    { min: 99999999, max: 0 }
  );

  const [stockList, setStockList] = useState<StockData[]>([
    {
      size: '',
      price: '',
      rrp_price: '',
      usd_price: '',
      currency: '',
      quantity: '',
      pre_quantity: '',
      productCode: row.product_code,
    },
  ]);

  const handleStock = async () => {
    try {
      for (let i = 0; i < stockList.length; i++) {
        const stockItem = stockList[i];
        if (stockItem.id) {
          //   console.log(stockItem);

          const formData = new FormData();
          formData.append('stock_id', stockItem.id);
          formData.append('quantity', JSON.stringify(stockItem.quantity));
          formData.append('pre_quantity', JSON.stringify(stockItem.pre_quantity));
          formData.append('size', stockItem.size);
          formData.append('price', JSON.stringify(stockItem.price));
          formData.append('rrp_price', JSON.stringify(stockItem.rrp_price));
          formData.append('usd_price', JSON.stringify(stockItem.usd_price));
          formData.append('currency', JSON.stringify(stockItem.currency));
          let data = {
            stock_id: stockItem.id,
            quantity: +stockItem.quantity,
            pre_quantity: +stockItem.pre_quantity,
            size: stockItem.size,
            price: +stockItem.price,
            rrp_price: +stockItem.rrp_price,
            usd_price: +stockItem.usd_price,
            currency: stockItem.currency,
          };
          await apiService
            .patch('products/update-stock', data, {
              headers: { 'Content-Type': 'application/json' },
            })
            .then((res) => {
              if (res.data.status.status === true) {
                // toast.success(res.data.status.message);
              }
              if (res.data.status.status === false) {
                toast.error(res.data.status.message);
              }
            })
            .catch(function (error) {
              toast.error(error);
              console.log(error);
            });
        } else {
          const formData = new FormData();
          formData.append('product_id', row.product_id);
          formData.append('size', stockItem.size);
          formData.append('price', stockItem.price.toString());
          formData.append('quantity', stockItem.quantity);

          await apiService.post('products/create-stock', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        }
      }
    } catch (error) {
      toast.error('error');
    }
    toast.success('Success');
  };
  const handleDeleteProductVariant = async (productId: string) => {
    await apiService
      ._delete(`products/admin/delete-product-variant/${productId}`, null)
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.status.message);
        setSubmitted(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleFrontImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setFrontImg({ ...frontImg, [uniqueId]: event.target.files[0] });
    setFrontImgURL(URLimage);
    setImageVariant({
      ...imageVariant,
      front_image: event.target.files[0],
      use_as_primary_data: row.use_as_primary_data,
      product_id: row.product_id,
    });
  };
  const handleBackImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const uniqueId = Math.random().toString(16).slice(2);
    const URLimage = URL.createObjectURL(event.target.files[0]);
    setBacktImg({ ...backImg, [uniqueId]: event.target.files[0] });
    setBacktImgURL(URLimage);
    setImageVariant({
      ...imageVariant,
      back_image: event.target.files[0],
      use_as_primary_data: row.use_as_primary_data,
      product_id: row.product_id,
    });
  };
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('product_id', imageVariant.product_id);
    if (frontImg) formData.append('front_image', imageVariant.front_image);
    if (backImg) formData.append('back_image', imageVariant.back_image);
    formData.append('price', '0');
    formData.append('use_as_primary_data', imageVariant.use_as_primary_data.toString());
    await apiService
      .patch('products/admin/update-product-variant', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        if (res.data.status.status === true) {
          // toast.success(res.data.status.message);
        }
        if (res.data.status.status === false) {
          toast.error(res.data.status.message);
        }
      })
      .catch(function (error) {
        toast.error(error);
        console.log(error);
      });
  };
  useEffect(() => {
    const mapStock = stock.map((s) => {
      return {
        id: s.id,
        size: s.size,
        price: s.price.toString(),
        rrp_price: s.rrp_price.toString(),
        usd_price: s.usd_price.toString(),
        currency: s.currency,
        quantity: s.quantity.toString(),
        pre_quantity: s.pre_quantity.toString(),
        productCode: row.product_code,
      };
    });
    setStockList(mapStock);
    setFrontImgURL(row?.front_image);
    setBacktImgURL(row?.back_image);
  }, []);
  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell sx={{ width: '150px' }} component="th" scope="row">
          <img width={150} className="object-cover" alt="products1" src={row.front_image} />
        </TableCell>
        <TableCell align="right">{row.product_code}</TableCell>
        <TableCell align="right">{row.color_code}</TableCell>
        <TableCell align="right">
          {stock.map((s, i) => {
            return (
              <div key={i}>
                <div>
                  {s.size} : {s.quantity}{' '}
                </div>
              </div>
            );
          })}
        </TableCell>
        <TableCell align="right">{min}</TableCell>
        <TableCell align="right">{row.stock?.[0]?.currency || '-'}</TableCell>
        {/* <TableCell align="right">{min !== 0 ? min + '-' + max : max}</TableCell> */}
        <TableCell align="right">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpenEditStock(!openEditStock)}>
            <ListAltIcon />
          </IconButton>
        </TableCell>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => handleDeleteProductVariant(row.product_id)}>
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={openEditStock} timeout="auto" unmountOnExit>
            <Grid item={true} md={10} sx={{ width: '90%', display: 'flex', marginTop: '1rem' }}>
              <FormControl required fullWidth>
                <Box className="flex">
                  <label htmlFor="" style={{ width: '70%' }}>
                    Front image <span style={{ color: 'red' }}> * </span>
                    <br />
                    <TextField type="file" onChange={handleFrontImageChange} />{' '}
                  </label>
                  <Button className="bg-purple-400" onClick={handleUpload}>
                    Upload
                  </Button>
                </Box>
              </FormControl>

              {frontImgURL ? (
                <ImageListItem sx={{ marginBottom: '5px' }}>
                  <img
                    src={frontImgURL}
                    alt="preview img"
                    loading="lazy"
                    style={{ width: '150px', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ) : null}
            </Grid>
            <Grid item={true} md={10} sx={{ width: '90%', display: 'flex' }}>
              <FormControl required fullWidth>
                <Box className="flex">
                  <label htmlFor="" style={{ width: '70%' }}>
                    Back image <span style={{ color: 'red' }}> * </span>
                    <br />
                    <TextField type="file" onChange={handleBackImageChange} />{' '}
                  </label>
                  <Button className="bg-purple-400">Upload</Button>
                </Box>
              </FormControl>

              {backImgURL ? (
                <ImageListItem sx={{ marginBottom: '5px' }}>
                  <img
                    src={backImgURL}
                    alt="preview img"
                    loading="lazy"
                    style={{ width: '150px', objectFit: 'cover' }}
                  />
                </ImageListItem>
              ) : null}
            </Grid>

            <StockTable
              rows={stockList}
              setRows={setStockList}
              productCode={row.product_code}
              editVariant
              handleSave={handleStock}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function CollapsibleTable(props: { productVariant: any; setSubmitted: any }) {
  const { productVariant, setSubmitted } = props;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            {/* <TableCell /> */}
            <TableCell>Image</TableCell>
            <TableCell align="right">Product code</TableCell>
            <TableCell align="right">Color</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Currency</TableCell>
            {/* <TableCell align="right">Quantity</TableCell> */}
            <TableCell align="right">-</TableCell>
            <TableCell align="right">-</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productVariant.map((row: any) => (
            <Row key={row.product_id} row={row} setSubmitted={setSubmitted} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const initUpdatePrimaryProduct = {
  master_code: '',
  name: '',
  cover_image: '',
  product_status: '', //(available, hidden, out_of_stock)
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
  edited_by: '',
  created_by_company: '',
};
