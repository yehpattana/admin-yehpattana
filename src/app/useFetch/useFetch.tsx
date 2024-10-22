import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiService } from '@/axios/axios-interceptor';

export const useFetch = (url: string) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await apiService.get(url);
      const dataInfo = res.data;

      setLoading(false);
      setData(dataInfo.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return { loading, data };
};
