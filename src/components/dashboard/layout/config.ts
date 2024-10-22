import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  // { key: 'overview', title: 'Products', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'account', title: 'Manage account', href: paths.dashboard.account, icon: 'user' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'orders' },
  { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'products' },
  { key: 'config', title: 'Config', href: paths.config, icon: 'gear-six' },
  { key: 'color', title: 'Colors', href: paths.color, icon: 'palette' },
  { key: 'size', title: 'Size', href: paths.size, icon: 'chartBar' },
  { key: 'log', title: 'Log', href: paths.log, icon: 'readCvLogo' },

  // { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];

// { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
// { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
// { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },

//overview = product page 
//account = manage account page ( create b2b users)
//have to add || saperate orders and products page out tgt