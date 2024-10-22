'use client';

import React, { useEffect, useState } from 'react';
import { useFetch } from '@/app/useFetch/useFetch';
import { apiService } from '@/axios/axios-interceptor';
import axios from 'axios';

import { b2cUsers, b2cUsersInterface, createProductVaraintFieldRequest } from '@/types/product';
import { productData, webviewUser } from '@/types/user';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/client';
import { useUser } from '@/hooks/use-user';
import { logger } from '@/lib/default-logger';

export interface DataContextValue {
  b2bDataState: webviewUser[] | null;
  b2cDataState: b2cUsersInterface[] | null;
  products: productData | null;
  workSpace: string | null | undefined;
  changeWorkSpace: any;
  handleChangeVaraint: any;
  handleVaraintSize: any;
  handleCreateNewVaraint: any;
  varaintData: createProductVaraintFieldRequest;
}

export const DataContext = React.createContext<DataContextValue | undefined>(undefined);
export interface DataProviderProps {
  children: React.ReactNode;
}
const url = 'users';
export function DataProvider({ children }: DataProviderProps): React.JSX.Element {
  // const { loading, data } = useFetch(url);
  const router=useRouter()
  const [b2cDataState, setB2cDataState] = useState<b2cUsersInterface[] | null>(null);
  const [b2bDataState, setB2bDataState] = useState<webviewUser[] | null>(null);
  const [workSpace, setWorkSpace] = useState<string | null | undefined>('B2B');
  const [varaintData, setVaraintData] = useState<createProductVaraintFieldRequest>(initVaraintData);
  const [newVaraintData, setNewVaraintData] = useState<createProductVaraintFieldRequest[]>([]);
  const [state, setState] = useState<{
    b2bDataState: webviewUser[] | null;
    products: productData | null;
    workSpace: string;
  }>({
    b2bDataState: [],
    products: null,
    workSpace: 'B2B',
  });
  const handleChangeVaraint = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    setVaraintData({ ...varaintData, [name]: value });
    if (files) {
      setVaraintData({ ...varaintData, [name]: files });
    }
    // setVaraintData({ ...varaintData,  [name]: value });
  };
  const handleVaraintSize = (event: React.ChangeEvent<HTMLInputElement>, key: any) => {
    const { value } = event.target;
    console.log(key);

    // if (!value) return;

    setVaraintData({
      ...varaintData,
      size: [...varaintData.size, { size: key, quantity: +value }],
    });
  };
  const handleCreateNewVaraint = () => {
    setNewVaraintData([...newVaraintData, varaintData]);
    setVaraintData(initVaraintData);
  };

  const changeWorkSpace = (value: string) => {
    setWorkSpace(value);
    localStorage.setItem('workSpace', value);
    console.log(value, 'workspace');
  };
  const { checkSession } = useUser();
  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // UserProvider, for this case, will not refresh the router and we need to do it manually
      router.refresh();
      // After refresh, AuthGuard will handle the redirect
    } catch (err) {
      logger.error('Sign out error', err);
    }
  }, [checkSession, router]);

  const fetchwebUsers = async (url: string) => {
    try {
      const response = await apiService.get(url);
      const users = response.data;
      setB2bDataState(users);
      console.log('response', response)
    } catch (error) {
      handleSignOut()
      console.log(error);
    }
  };

  useEffect(() => {
    fetchwebUsers(url);
    // fetchB2cUsers();
    setB2cDataState(b2cUsers);
  }, [state, b2cUsers]);
  useEffect(() => {}, []);
  // console.log(b2bDataState);
  return (
    <DataContext.Provider
      value={{
        ...state,
        changeWorkSpace,
        b2cDataState,
        b2bDataState,
        workSpace,
        handleChangeVaraint,
        varaintData,
        handleVaraintSize,
        handleCreateNewVaraint,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
export const DataConsumer = DataContext.Consumer;

const initVaraintData = {
  product_id: '',
  product_code: '',
  master_code: '',
  color_code: '',
  size: [],
  image_front: '',
  image_back: '',
};
