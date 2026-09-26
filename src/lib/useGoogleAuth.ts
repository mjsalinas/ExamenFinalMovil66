import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const promptGoogleLogin = async () => {
    setLoadingGoogle(true);
    try {
      const redirectTo = Linking.createURL('/');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error || !data?.url) {
        console.log('Error al generar url de OAuth:', error?.message);
        setLoadingGoogle(false);
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === 'success' && result.url) {
    const url = new URL(result.url.replace('#', '?'));
        const access_token = url.searchParams.get('access_token');
        const refresh_token = url.searchParams.get('refresh_token');

        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
      }
    } catch (err) {
      console.log('Error al intentar iniciar sesion con Google:', err);
    } finally {
      setLoadingGoogle(false);
    }
  };

  return { promptGoogleLogin, loadingGoogle };
}