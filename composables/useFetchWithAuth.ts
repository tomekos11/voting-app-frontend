import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

export const useFetchWithAuth = async <T>(url: string, options: NitroFetchOptions<NitroFetchRequest, 'connect' | 'post' | 'head' | 'delete' | 'options' | 'get' | 'patch' | 'put' | 'trace'> = {}): Promise<T> => {
  const config = useRuntimeConfig();

  let headers = {};

  if (import.meta.server) {
    const cookie = useRequestHeaders(['cookie']).cookie || '';
    headers = { cookie };
  }
  //   else {
  //     // Klient — dynamiczny import i odczyt cookies
  //     const Cookies = (await import('js-cookie')).default;
  //     const xsrfToken = Cookies.get('XSRF-TOKEN');
  //     headers = {
  //       'X-XSRF-TOKEN': xsrfToken || '',
  //     };
  //   }

    
  return $fetch<T>(config.public.API_URL + url, {
    credentials: 'include',
    headers,
    ...options,
  }).catch(async (error) => {
    const isSSR = import.meta.server;

    // Logika dla SSR
    if (isSSR) {
      const statusCode = error.statusCode || error.response?.status;
      const isConnectionError = error.code === 'ECONNREFUSED' || error?.cause?.message === 'fetch failed';

      if (statusCode === 500 || isConnectionError) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Błąd połączenia z API',
          fatal: true,
        });
      }
    }
    else {
      const shouldRedirect = 
        error?.response?.status === 500 ||
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('ERR_CONNECTION_REFUSED');

      if (shouldRedirect) {
        await navigateTo('/500', { redirectCode: 302, replace: true });
        throw new Error('Client redirect triggered');
      }
    }

    throw error;
  });
};