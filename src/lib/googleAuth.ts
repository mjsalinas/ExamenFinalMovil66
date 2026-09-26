import { makeRedirectUri } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from './supabase';

/*
 * El camino de Linking es solo para nativo. En web hace falta una razon puntual:
 * expo-linking implementa addEventListener('url') como un listener de 'message'
 * de window que reporta el href de la VENTANA PRINCIPAL, no el de la popup:
 *
 *   const nativeListener = (e) => listener({ url: window.location.href, e });
 *
 * O sea que en web cualquier postMessage al window (el dev server, HMR, una
 * extension) lo dispara con la URL de la pagina, que no tiene tokens. Eso hacia
 * dos cosas a la vez: entregar una redirect sin tokens, y cerrar la popup de
 * Google, porque dismissAuthSession() en web es un dismissPopup().
 *
 * En web el flujo correcto es el de la propia libreria: openAuthSessionAsync
 * abre la popup y maybeCompleteAuthSession() (llamado al cargar este modulo)
 * la cierra y devuelve la URL.
 */
const isWeb = Platform.OS === 'web';

/*
 * Login con Google (OAuth 2.0) usando Supabase y el SDK de Expo.
 *
 * COMO FUNCIONA EL FLUJO
 * ----------------------
 *  1. La app pide a Supabase la URL de autorizacion de Google.
 *  2. Se abre esa URL en el navegador del sistema con openAuthSessionAsync.
 *  3. El usuario elige su cuenta de Google y acepta el consentimiento.
 *  4. Google devuelve el control a Supabase, que cambia el codigo por tokens.
 *  5. Supabase redirige a la app con los tokens en el fragmento de la URL.
 *  6. La app lee ese fragmento y registra la sesion con setSession.
 *
 * El paso 6 tiene dos caminos de entrada posibles, porque la redireccion puede
 * llegar por dos APIs distintas. Ver "DOS VIAS DE VUELTA" en signInWithGoogle.
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
 *    - Conviene usar comodines en vez de la URL exacta, porque en Expo Go el
 *      puerto y la IP cambian segun como se levante Metro:
 *        examenfinalmovil://[glob]   y   exp://[glob]
 *      donde [glob] es un asterisco seguido de otro asterisco.
 *
 *      Ojo con la sintaxis: un solo asterisco NO matchea ni . ni /; el doble si.
 *      Por eso exp://127.0.0.1:[glob] no sirve, y exp://[glob] si.
 *
 *    - Si una URL de la lista no matchea, Supabase NO da error: redirige en
 *      silencio al Site URL. Por eso un allowlist desactualizado se manifiesta
 *      como "el navegador queda en localhost y la app no abre", que es
 *      exactamente el sintoma de una entrada faltante.
 *
 * NOTA SOBRE EXPO GO
 * ------------------
 * Expo Go solo atiende su propio esquema (exp://), no el esquema propio de la
 * app. resolveScheme() de expo-linking descarta en silencio cualquier scheme que
 * no sea exp, exps o los ids de Google/Facebook, asi que el redirect termina
 * siendo exp://<host>:<puerto>/--/auth. Ese valor debe estar en el allowlist de
 * Supabase, o conviene usar el comodin exp://[glob] para no tener que
 * registrarlo de nuevo cada vez que cambia el puerto.
 */

// En web sirve para cerrar el popup cuando la app vuelve del redirect.
// En nativo no hace nada, pero no molesta.
WebBrowser.maybeCompleteAuthSession();

/*
 * makeRedirectUri() devuelve exp://<IP-LAN>:<puerto>/--/auth. En un dispositivo
 * fisico esa IP la reparte DHCP y cambia cada tanto, y como Supabase valida la
 * redirectTo contra su allowlist, hay que volver a registrar la URL cada vez que
 * la IP se mueve.
 *
 * Se fija el host en 127.0.0.1 y se conserva el puerto, que sale del valor real
 * porque lo elige Metro y no nos cuesta nada tomarlo de ahi. iOS enruta los deep
 * links por esquema y no por host, asi que en un telefono fisico 127.0.0.1
 * deberia llegar igual a Expo Go.
 *
 * Si en el dispositivo este approach no funciona, se vuelve a esto:
 *
 *   makeRedirectUri({ scheme: 'examenfinalmovil', path: 'auth' })
 *
 * y se registra en Supabase la IP LAN que imprima el log de mas abajo.
 */
function buildRedirectUri(): string {
  const uri = makeRedirectUri({ scheme: 'examenfinalmovil', path: 'auth' });

  // Solo se pisa el host cuando estamos en Expo Go. En web el valor ya es un
  // http://localhost, y en dev build es examenfinalmovil://auth: ninguno de los
  // dos toca exp://, asi que quedan intactos.
  //
  // [^/:]+ y no [^/]+ a proposito: el segundo tambien se come el puerto, que
  // Expo Go usa para ubicar el dev server. El reemplazo va en una funcion porque
  // '$1127.0.0.1' se leeria como el grupo de captura $11.
  return uri.replace(/^(exp:\/\/)[^/:]+/, (_match, scheme) => `${scheme}127.0.0.1`);
}

export const googleRedirectUri = buildRedirectUri();

type RedirectOutcome =
  | { type: 'redirect'; url: string }
  | { type: 'cancel' };

/*
 * Convierte la URL de redireccion en una sesion de Supabase.
 *
 * Devuelve false, en lugar de lanzar, cuando la URL no trae nada aprovechable.
 * El unico motivo practico es que la URL de arranque de Expo Go tambien pasa por
 * aca y no debe romper un login que todavia no empezo.
 */
async function createSessionFromUrl(url: string): Promise<boolean> {
  // Cuando el flujo falla, Supabase no devuelve tokens: devuelve la causa del
  // error en la query, por ejemplo:
  //   ...?error=access_denied&error_description=Email+not+confirmed
  //   ...?error=invalid_request&error_description=redirect_to+not+allowed
  // Sin este bloque el error real se pierde y solo se ve un mensaje generico,
  // que es lo que hace imposible diagnosticar un fallo de configuracion.
  const [beforeHash, fragment] = url.split('#');
  const query = new URLSearchParams(beforeHash.split('?')[1] ?? '');

  const errorDescription = query.get('error_description');
  const errorCode = query.get('error');

  if (errorCode || errorDescription) {
    throw new Error(
      `Google/Supabase devolvio un error: ${errorDescription ?? errorCode}` +
        (errorCode ? ` (${errorCode})` : '')
    );
  }

  if (!fragment) {
    return false;
  }

  const params = new URLSearchParams(fragment);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return false;
  }

  const { error: setSessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (setSessionError) {
    throw setSessionError;
  }

  return true;
}

/*
 * ¿Esta URL trae un resultado de autenticacion, o es solo una apertura de la app?
 *
 * Sirve para no resolver la carrera con la URL de arranque. En Expo Go,
 * Linking.getInitialURL() devuelve el exp:// con el que se lanzo la app, que no
 * tiene tokens. Como esa promesa resuelve de inmediato, ganarle la carrera a un
 * redirect real que llega segundos despues abortaria un login que si iba a
 * funcionar.
 */
function carriesAuthResult(url: string): boolean {
  const [beforeHash, fragment] = url.split('#');
  const query = new URLSearchParams(beforeHash.split('?')[1] ?? '');

  if (query.has('error') || query.has('error_description') || query.has('code')) {
    return true;
  }

  if (!fragment) {
    return false;
  }

  const params = new URLSearchParams(fragment);
  return params.has('access_token') && params.has('refresh_token');
}

/*
 * Cierra el modal de autenticacion.
 *
 * OJO: no sirve dismissBrowser(). Son dos metodos nativos distintos:
 *   - dismissBrowser       -> currentWebBrowserSession, el SFSafariViewController
 *                             que abre openBrowserAsync. En este flujo es nil y
 *                             ademas lanza WebBrowserNotOpenException.
 *   - dismissAuthSession   -> currentAuthSession, el ASWebAuthenticationSession
 *                             que abre openAuthSessionAsync. Este es el que hay
 *                             que tocar, y no hace nada si no hay nada abierto.
 *
 * Que falle no es motivo para abortar el login, que en este punto ya esta
 * garantizado por el deep link.
 */
function dismissAuthSessionQuietly() {
  try {
    WebBrowser.dismissAuthSession();
  } catch {
    // sin soporte en esta plataforma
  }
}

export async function signInWithGoogle(): Promise<void> {
  // Log temporal: imprime la URI exacta que se envia a Supabase, para poder
  // registrarla literal en la lista de Redirect URLs. Se quita antes de entregar.
  console.log('[googleAuth] redirectTo =', googleRedirectUri);

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

  /*
   * DOS VIAS DE VUELTA, Y HAY QUE ESTAR PREPARADO PARA LAS DOS
   * ---------------------------------------------------
   *  1. openAuthSessionAsync. En iOS usa ASWebAuthenticationSession, que
   *     intercepta la redireccion y resuelve la promesa.
   *
   *  2. Linking. En Expo Go ambos compiten por el mismo exp://: iOS puede
   *     entregarle la URL al handler de deep links del propio Expo Go en lugar
   *     de a la sesion de autenticacion. Cuando eso pasa, la promesa del punto 1
   *     no resuelve nunca y el unico que recibe la URL es el listener. Sin este
   *     camino, el login se queda esperando para siempre.
   *
   * Las dos escriben en la MISMA promesa mediante deliver(), que es idempotente:
   * gana la primera que llegue. No se compiten con Promise.race porque al
   * cerrar el modal desde el handler, la sesion de autenticacion se resuelve
   * con "dismiss", y eso racing contra el deep link le gana siempre y reporta
   * una cancelacion que el usuario nunca hizo.
   *
   * El listener se registra ANTES de abrir el navegador. Si la redireccion
   * llegara antes de que openAuthSessionAsync terminara de montarse, sin esto se
   * pierde.
   *
   * En web la via 2 no se registra: ver isWeb arriba.
   */
  let deliver: ((outcome: RedirectOutcome) => void) | undefined;
  let redirectDelivered = false;

  const outcome = new Promise<RedirectOutcome>((resolve) => {
    deliver = (value) => {
      if (value.type === 'redirect') {
        if (redirectDelivered) {
          return;
        }
        redirectDelivered = true;
      }
      resolve(value);
    };
  });

  const subscription = isWeb
    ? null
    : Linking.addEventListener('url', ({ url }) => {
        // Orden importante: primero se entrega la URL, recien despues se cierra
        // el modal. Al revés, el "dismiss" que genera el cierre le gana a la
        // carrera a la redireccion real y el login se reporta como cancelado.
        deliver?.({ type: 'redirect', url });
        dismissAuthSessionQuietly();
      });

  try {
    // iOS a veces mata la app mientras el navegador esta abierto. Al relanzarla
    // con el deep link, la unica copia de la URL queda en getInitialURL().
    if (!isWeb) {
      void Linking.getInitialURL().then((initialUrl) => {
        if (initialUrl && carriesAuthResult(initialUrl)) {
          deliver?.({ type: 'redirect', url: initialUrl });
        }
      });
    }

    void WebBrowser.openAuthSessionAsync(data.url, googleRedirectUri)
      .then((result) => {
        if (result.type === 'success' && result.url) {
          deliver?.({ type: 'redirect', url: result.url });
        } else {
          deliver?.({ type: 'cancel' });
        }
      })
      .catch(() => {
        // La sesion no pudo abrirse. Si el deep link ya trajo la URL, el login
        // esta en marcha y este error ya no importa.
        deliver?.({ type: 'cancel' });
      });

    const result = await outcome;

    if (result.type === 'cancel') {
      /*
       * Distinguir "el usuario cerro el modal" de "nunca llego una redireccion"
       * no es cosmetico: si la allowlist de Supabase no matchea, Supabase no
       * devuelve un error, redirige al Site URL y el usuario termina en una
       * pagina que no es la app. Al cerrar el modal, openAuthSessionAsync
       * devuelve cancel igual que cuando el usuario cancela, asi que sin este
       * check el unico sintoma es un "Se cancelo" que no explica nada.
       */
      throw new Error(
        'No se recibio la redireccion de Google.Casi seguro es la allowlist de ' +
          `Supabase: agregá "${googleRedirectUri}" en Authentication > URL ` +
          'Configuration > Redirect URLs. Si ya está, revisá que el Site URL ' +
          'de ese panel no siga apuntando a localhost, porque Supabase manda ' +
          'ahí todo redirect que no reconoce.'
      );
    }

    const created = await createSessionFromUrl(result.url);

    if (!created) {
      throw new Error('La redireccion no trajo los tokens de sesion.');
    }
  } finally {
    subscription?.remove();
  }
}
