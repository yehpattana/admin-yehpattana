export interface User {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;

  [key: string]: unknown;
}


export interface webviewUser {
  
    user: {
      email: string,
    },
    company_name: string,
    contact_name:string,
    vat_number: string,
    phone_number:string,
    address:string,
    cap:string,
    city: string,
    province:string,
    country:string,
    message: string
    password: string
  
}
export interface b2bUserInterface {
  // id: string;
  email: string;
  // is_actived: boolean;
  // role: string;
  // created_at: string;
  // updated_at: string;
  contact_name: string;
  company_name: string;
  vat_number: string;
  address: string;
  phone_number: string;
  cap: string;
  city: string;
  province: string;
  country: string;
  message: string;
}
export interface getAllB2bUserInterface {
  id: string;
  email: string;
  is_actived: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  contact_name: string;
  company_name: string;
  customer_id: string;
  vat_number: string;
  address: string;
  phone_number: string;
  cap: string;
  city: string;
  province: string;
  country: string;
  message: string;
}


export interface productData {
  product_data: {
    product_id: string,
    name: string | null,
    product_code: string,
    master_code: string  | null,
    status: string,
    type: string,
    price: string,
    size_chart: string,
    overview: string | null,
    material:string | null,
    classification: string | null,
    product_group:string | null,
    collection: string | null,
    category: string | null,
    brand: string | null,
    club: string | null,
    season:string | null,
    pack_size:string | null,
    supplier: string | null,
    remark: string | null,
    create_by: string | null,
    edit_by: string | null,
    created_at:string ,
    updated_at: string | null,
    varaint: []
}
}