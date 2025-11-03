import { useRouter } from 'expo-router';
import { API_ROUTES, APP_ROUTES } from '@constants/routes';
import axios, { type AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@services/Supabase';

const axiosClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(null, (error: AxiosError) => {
  console.error(error);

  const router = useRouter();
  if (error.response?.status === 401) {
    router.replace(APP_ROUTES.AUTH.SIGN_IN);
  }

  return Promise.reject(error);
});

const get = async <T>(url: string) => {
  try {
    const response = await axiosClient.get<T>(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const post = async <T, D>(url: string, data: D) => {
  try {
    const response = await axiosClient.post<T>(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const API = {
  useCreateUser: () =>
    useMutation({
      mutationFn: (data: any) => post(API_ROUTES.USER.CREATE, data),
    }),

  useCreateChat: () =>
    useMutation({
      mutationFn: (data: any) => post(API_ROUTES.CHATS.CREATE, data),
    }),

  useCreateMessage: () =>
    useMutation({
      mutationFn: (data: any) => post(API_ROUTES.MESSAGE.CREATE, data),
    }),

  useChats: () =>
    useQuery({
      queryKey: ['chats'],
      queryFn: () => get(API_ROUTES.CHATS.GET),
    }),
};

export default API;
