import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

export async function signInWithGoogle() {

  const redirectTo = Linking.createURL('/'); 

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;
  if (!data?.url) throw new Error('No se pudo obtener la URL de autenticación de Google.');

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== 'success' || !result.url) {
    
    return;
  }

  await createSessionFromUrl(result.url);
}

async function createSessionFromUrl(url: string) {
  const { params, errorCode } = parseUrlParams(url);

  if (errorCode) throw new Error(errorCode);

  const { access_token, refresh_token } = params;
  if (!access_token || !refresh_token) {
    throw new Error('No se recibieron los tokens de sesión.');
  }

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) throw error;
}

function parseUrlParams(url: string) {
 
  const hash = url.includes('#') ? url.split('#')[1] : '';
  const query = url.includes('?') ? url.split('?')[1].split('#')[0] : '';
  const raw = hash || query;

  const params: Record<string, string> = {};
  new URLSearchParams(raw).forEach((value, key) => {
    params[key] = value;
  });

  return { params, errorCode: params.error_description ?? null };
}
