import { API_ROUTES } from '@constants/routes';
import axios, { type AxiosError } from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@services/Supabase';
import type { IChatRequest, IMessagesResponse } from './types';
import { fetch } from 'expo/fetch';

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

axiosClient.interceptors.response.use(null, async (error: AxiosError) => {
  console.error('[nilGPT API]:', error);

  if (error.response?.status && error.response.status > 400) {
    await supabase.auth.signOut();
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

const post = async <T, D>(url: string, data?: D) => {
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
      mutationKey: ['createUser'],
      mutationFn: () => post(API_ROUTES.USER.CREATE),
    }),

  useCreateChat: () =>
    useMutation({
      mutationKey: ['createChat'],
      mutationFn: (data: any) => post(API_ROUTES.CHATS.CREATE, data),
    }),

  useUpdateChat: () =>
    useMutation({
      mutationKey: ['updateChat'],
      mutationFn: (data: any) => post(API_ROUTES.CHATS.UPDATE, data),
    }),

  useCreateMessage: () =>
    useMutation({
      mutationKey: ['createMessage'],
      mutationFn: (data: any) => post(API_ROUTES.MESSAGE.CREATE, data),
    }),

  chat: async (data: IChatRequest) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api${API_ROUTES.CHAT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  },

  useChatMessages: (chatId: string) =>
    useQuery({
      queryKey: ['messages', chatId],
      queryFn: () =>
        get<IMessagesResponse>(`${API_ROUTES.MESSAGE.GET}/${chatId}`),
      enabled: !!chatId,
    }),

  useChats: () =>
    useQuery({
      queryKey: ['chats'],
      queryFn: () => get(API_ROUTES.CHATS.GET),
    }),
};

export default API;
