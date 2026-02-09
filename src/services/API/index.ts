import { useMutation, useQuery } from '@tanstack/react-query';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import { fetch } from 'expo/fetch';

import { decrypt, encrypt } from '@/utils/encryption';
import { API_ROUTES } from '@constants/routes';
import { supabase } from '@services/Supabase';
import type {
  IChatRequest,
  IChatsResponse,
  ICreateChatRequest,
  IDefaultApiResponse,
  IDeleteChatRequest,
  ICreateMessageRequest,
  IMessagesResponse,
  IUpdateChatRequest,
} from './types';

const axiosClient = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api`,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
  console.log('[nilGPT API]:', config.url);

  const { data } = await supabase.auth.getSession();
  const accessToken = data.session?.access_token;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(null, async (error: AxiosError) => {
  console.error('[nilGPT API]:', error);

  if (
    error.response?.status &&
    error.response.status === HttpStatusCode.Unauthorized
  ) {
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

const del = async <T, D>(url: string, data?: D) => {
  try {
    const response = await axiosClient.delete<T>(url, { data });
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
      mutationFn: async (data: ICreateChatRequest) => {
        const encryptedTitle = await encrypt(data.title);
        return post(API_ROUTES.CHATS.CREATE, {
          ...data,
          title: encryptedTitle,
        });
      },
    }),

  useUpdateChat: () =>
    useMutation({
      mutationKey: ['updateChat'],
      mutationFn: (data: IUpdateChatRequest) =>
        post<IDefaultApiResponse, IUpdateChatRequest>(
          API_ROUTES.CHATS.UPDATE,
          data,
        ),
    }),

  useDeleteChat: () =>
    useMutation({
      mutationKey: ['deleteChat'],
      mutationFn: (data: IDeleteChatRequest) =>
        del<IDefaultApiResponse, IDeleteChatRequest>(
          API_ROUTES.CHATS.DELETE,
          data,
        ),
    }),

  useCreateMessage: () =>
    useMutation({
      mutationKey: ['createMessage'],
      mutationFn: async (data: ICreateMessageRequest) => {
        const encryptedBlindfoldContent = await encrypt(data.blindfoldContent);
        return post(API_ROUTES.MESSAGES.CREATE, {
          ...data,
          blindfoldContent: encryptedBlindfoldContent || data.blindfoldContent,
        });
      },
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

  useChatMessages: (chatId: string | null) =>
    useQuery({
      queryKey: ['messages', chatId],
      queryFn: () =>
        get<IMessagesResponse>(`${API_ROUTES.MESSAGES.GET}/${chatId}`).then(
          (res) =>
            Promise.all(
              res.content.map(async (message) => {
                const decryptedContent = await decrypt(
                  message.content as string,
                );
                return {
                  ...message,
                  content: decryptedContent || message.content,
                };
              }),
            ),
        ),
      enabled: !!chatId,
    }),

  useEncryptedChats: () =>
    useQuery({
      queryKey: ['encryptedChats'],
      queryFn: () =>
        get<IChatsResponse>(API_ROUTES.CHATS.GET).then(
          (res) => res.content.result,
        ),
    }),

  useChats: () =>
    useQuery({
      queryKey: ['chats'],
      queryFn: async () =>
        get<IChatsResponse>(API_ROUTES.CHATS.GET).then((res) =>
          Promise.all(
            res.content.result.map(async (chat) => {
              const decryptedTitle = await decrypt(chat.title);
              return {
                ...chat,
                title: decryptedTitle || chat.title,
              };
            }),
          ),
        ),
    }),

  useDeleteAccount: () =>
    useMutation({
      mutationKey: ['deleteAccount'],
      mutationFn: () =>
        del<IDefaultApiResponse, undefined>(API_ROUTES.USER.DELETE),
    }),
};

export default API;
