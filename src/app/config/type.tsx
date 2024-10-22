export interface ConfigMenu {
  id: number;
  name: string;
  status: 'Active' | 'Inactive';
  sideBar: boolean;
}

export interface SubMenu {
  id: number;
  name: string;
  menuId: number;
  status: 'Active' | 'Inactive';
  sideBar: boolean;
}

export interface Edit {
  menubarId: number | null;
  subMenubarId: number | null;
  menuSidebarId: number | null;
  subMenuSidebarId: number | null;
}

export interface Add {
  menubar: boolean;
  subMenubar: boolean;
  menuSidebar: boolean;
  subMenuSidebar: boolean;
}

export const statusMap = {
  Active: { label: 'Active', color: 'success' },
  Inactive: { label: 'Inactive', color: 'error' },
} as const;

export interface Company {
  currency: string;
  minimum_cost_avoid_shipping:number
  id: string;
  company_name: string;
  company_code: string;
}
