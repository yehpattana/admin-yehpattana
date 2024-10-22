export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    orders: '/dashboard/orders',
    products: '/dashboard/products',
  },
  errors: { notFound: '/errors/not-found' },
  config:  '/config' ,
  color:  '/color' ,
  size:  '/size' ,
  log:  '/log' ,
} as const;
