import type { Session } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

import { deletePin, getPin, hasPin, pinStore } from '@/services/MMKV';
import { MMKV_KEYS } from '@/services/MMKV/constants';
import { APP_ROUTES } from '@constants/routes';
import { supabase } from '@services/Supabase';

export type AuthData = {
  session?: Session | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  isPinSet: boolean;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  isLoading: true,
  isLoggedIn: false,
  isPinSet: false,
});

export const useAuthContext = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
  const router = useRouter();

  const [session, setSession] = useState<Session | undefined | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [isPinSet, setIsPinSet] = useState(hasPin());

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
      }

      setSession(session);
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[nilGPT Auth]:', event);
      setSession(session);

      if (event === 'SIGNED_OUT') {
        deletePin();
        router.replace(APP_ROUTES.WELCOME);
      }
    });

    const pinListener = pinStore.addOnValueChangedListener((changedKey) => {
      if (changedKey === MMKV_KEYS.PIN_STORE.PIN) {
        const pin = getPin();
        setIsPinSet(!!pin);
      }
    });

    // Cleanup subscriptions on unmount
    return () => {
      subscription.unsubscribe();
      pinListener.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        isLoggedIn: !!session,
        isPinSet,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
