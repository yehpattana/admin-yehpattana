import dayjs from 'dayjs';

/* 28 feild  */
export interface createProductInterface {
  name: string;
  product_code: string;
  master_code: string;
  color_code: string;
  color_code_name: string;
  product_status: string; //(available, hidden, out_of_stock)
  cover_image: string | Blob;
  front_image: string | Blob;
  back_image: string | Blob;
  price: string;
  product_group: string;
  season: string;
  gender: string;
  product_class: string;
  collection: string;
  category: string;
  brand: string;
  is_club: string;
  club_name: string;
  remark: string;
  launch_date: string;
  end_of_life: string;
  size_chart: string | Blob; //size img
  pack_size: string;
  current_supplier: string;
  description: string;
  fabric_content: string;
  fabric_type: string;
  weight: string | Blob;
  created_by: string;
  created_by_company: string;
}
export interface updateMainProductDetail {
  master_code: string;
  name: string;
  cover_image: string | Blob;
  product_status: string; //(available, hidden, out_of_stock)
  product_group: string;
  season: string;
  gender: string;
  product_class: string;
  collection: string;
  category: string;
  brand: string;
  is_club: string;
  club_name: string;
  remark: string;
  launch_date: string;
  end_of_life: string;
  size_chart: string | Blob; //size img
  pack_size: string;
  current_supplier: string;
  description: string;
  fabric_content: string;
  fabric_type: string;
  weight: string | Blob;
  edited_by: string;
  created_by_company: string;

  // product_code: string;
  // color_code: string;
  // front_image: string | Blob;
  // back_image: string | Blob;
  // price: string;
  // created_by: string;
}
export interface responseProductVariant {
  back_image: string;
  front_image: string;
  color_code: string;
  price: string;
  product_code: string;
  product_id: string;
  stock: stockI[];
  use_as_primary_data: boolean;
}
export interface stockI {
  created_at: string;
  id: string;
  item_status: string;
  product_id: string;
  quantity: number;
  size: string;
  remark: string;
  updated_at: string;
}

export interface createStock {
  product_id: string;
  size: string;
  size_remark: string;
  quantity: string;
  price: string;
}

export interface createProductInterface2 {
  name: string;
  cover_image: string | Blob;
  product_group: string;
  description: string;
  remark: string;
  launch_date: string;
  season: string;
  // ---------
  product_class: string;
  collection: string;
  category: string;
  brand: string;
  gender: string;
  is_club: string;
  club_name: string;
  size_chart: string | Blob; //size img
  pack_size: string;
  current_supplier: string;
  fabric_content: string;
  fabric_type: string;
  weight: string | Blob;
  // ---
  status: string; //(available, hidden, out_of_stock)
  price: number | null;
}
export interface PostFileFormDataBody {
  [key: string]: string | Blob;
}

export interface getProductsResponse {
  cover_image: string;
  id: string;
  launch_date: string;
  master_code: string;
  name: string;
  price: number;
  product_code: string;
  product_status: string;
  use_as_primary_data: boolean;
  currency: string;
}

export interface createProductVaraintFieldRequest {
  product_id: string;
  product_code: string;
  master_code: string;
  color_code: string;
  size: { size: string; quantity: number }[];
  image_front: string | Blob; // if not provided, default image will be used
  image_back: string | Blob; // if not provided, default image will be used
}
export interface createProductItemRequest {
  ProductVaraintId: string; //`json:"product_varaint_id"` // Required
  Size: string; // `json:"size"`               // Required
  Quantity: number; //   `json:"quantity"`           // Required
}

export interface companyDataI {
  id: string;
  company_code: string;
  company_name: string;
  currency: string;
  minimum_cost_avoid_shipping: string;
  logo: string | Blob;
}

export interface b2cUsersInterface {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
}

export let b2cUsers = [
  {
    id: '6f6b8dfb-9f0b-4d31-ad66-51ec7ae6bbbb',
    email: 'bbbb@example.com',
    password: '664756ddf!',
    first_name: 'AB ',
    last_name: 'lastnamr',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '6f61ec7ae6bbbb',
    email: 'customer1b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: 'sdfsdfae6bbbb6f61ec7',
    email: 'customer451b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: 'dfb-9f0b-46f61ec7ae6bbbb',
    email: 'customer4351b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '6dgsdsf61ec7ae6bbbb',
    email: 'customer7351b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '6f61ec7ewrraae6bbbb',
    email: 'customer1351b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '6f61trjtyjec7ae6bbbb',
    email: 'customer2351b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '6f61ec324267ae6bbbb',
    email: 'customer771b@example.com',
    password: '664756ddf!',
    first_name: 'first name',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
  {
    id: '4634646f61ec7ae6bbbb',
    email: 'customer5521b@example.com',
    password: '664756ddf!',
    first_name: 'first namemikkay',
    last_name: 'lastName',
    address: '123 Main St',
    phone_number: '123-456-7890',
  },
];

export interface updateProductVariant {
  front_image: string | Blob;
  back_image: string | Blob;
  product_id: string;
  use_as_primary_data: boolean;
}
