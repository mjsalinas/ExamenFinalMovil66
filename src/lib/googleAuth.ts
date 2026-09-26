import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import { supabase } from './supabase';

/*
 * Login con Google (OAuth 2.0) usando Supabase y el SDK de Expo.
 *
 * COMO FUNCIONA EL FLUJO
 * ----------------------
 *  1. La app pide a Supabase la URL de autorizacion de Google.
 *  2. Se abre esa URL en el navegador del sistema con openAuthSessionAsync.
 *  3. El usuario elige su cuenta de Google y acepta el consentimiento.
 *  4. Google devuelve el control a Supabase, que cambia el código por tokens.
 *  5. Supabase redirige a la app con los tokens en el fragmento de la URL.
 *  6. La app lee ese fragmento y registra la sesión con setSession.
 *
 * DOS DECISIONES QUE IMPORTAN
 * ---------------------------
 * - detectSessionInUrl: false (en supabase.ts). En la web, supabase-js lee la
 *   sesión solo de la URL. En React Native no existe window.location, así que
 *   ese parseo automático no puede funcionar: hay que leer los tokens a mano y
 *   pasarlos a setSession, que es el paso 6.
 *
 * - skipBrowserRedirect: true. Sin esto, supabase-js intenta redirigir con
 *   window.location.assign(), que no existe en React Native y fallaria.
 *   Con skipBrowserRedirect nos devuelve la URL en data.url y la abrimos
 *   nosotros con el navegador.
 *
 * - flowType. supabase-js usa "implicit" por defecto (constantes del paquete),
 *   asi que la redireccion trae access_token y refresh_token en el fragmento
 *   (#access_token=...&refresh_token=...), no un codigo ?code=. Por eso se
 *   leen con URLSearchParams y se entregan a setSession.
 *
 * CONFIGURACION NECESARIA (una sola vez, en los paneles)
 * -----------------------------------------------------
 * 1. Google Cloud Console (https://console.cloud.google.com)
 *    - Crear un proyecto y ir a "APIs y servicios > Pantalla de consentimiento".
 *    - Crear unas credenciales de tipo "ID de cliente OAuth" y elegir
 *      "Aplicacion web".
 *    - En "URI de redireccion autorizado" poner:
 *      https://<project-ref>.supabase.co/auth/v1/callback
 *      (el project-ref es el prefijo de la URL de tu proyecto).
 *    - Anotar el Client ID y el Client Secret.
 *
 * 2. Supabase Dashboard > Authentication > Providers > Google
 *    - Activar el proveedor.
 *    - Pegar el Client ID y el Client Secret.
 *    - El Client Secret NUNCA va en la app: solo en este panel.
 *
 * 3. Supabase Dashboard > Authentication > URL Configuration > Redirect URLs
 *    - Agregar la URL de retorno de la app. Segun el entorno puede ser:
 *        Build de desarrollo:  examenfinalmovil://auth
 *        Expo Go:              exp://127.0.0.1:8081/--/auth
 *      makeRedirectUri() devuelve la correcta automaticamente segun donde
 *      corra la app, pero ambas deben estar en la lista de permitidas.
 *
 * NOTA SOBRE EXPO GO
 * ------------------
 * Expo Go solo atiende su propio esquema (exp://), no el esquema propio de la
 * app. Por eso en Expo Go el redirect es exp://127.0.0.1:8081/--/auth y ese
 * valor debe estar en el allowlist de Supabase. Si el puerto cambia al
 * reiniciar el servidor de Metro, hay que volver a registrarlo.
 */

// En web sirve para cerrar el popup cuando la app vuelve del redirect.
// En nativo no hace nada, pero no molesta.
WebBrowser.maybeCompleteAuthSession();

export const googleRedirectUri = makeRedirectUri({
  scheme: 'examenfinalmovil',
  path: 'auth',
});

export async function signInWithGoogle(): Promise<void> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: googleRedirectUri,
      skipBrowserRedirect: true,
    },
  });

  if (error) {
    throw error;
  }

  if (!data.url) {
    throw new Error('Supabase no devolvio la URL de autenticacion.');
  }

  const result = await WebBrowser.openAuthSessionAsync(data.url, googleRedirectUri);

  if (result.type !== 'success' || !result.url) {
    throw new Error('Se cancelo el inicio de sesion con Google.');
  }

  const fragment = result.url.split('#')[1];

  if (!fragment) {
    throw new Error('La redireccion no trajo los tokens de sesion.');
  }

  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    throw new Error('La redireccion no trajo los tokens de sesion.');
  }

  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (setSessionError) {
    throw setSessionError;
  }
}
