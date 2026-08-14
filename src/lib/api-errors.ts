import type { Language } from '@/domain/demo-market';

import { ApiError } from '@/api';

const messages = {
  es: {
    unauthorized: 'La sesión expiró. Vuelve a iniciar sesión.',
    forbidden: 'No tienes permiso para ejecutar esta acción.',
    notFound: 'No encontramos el recurso solicitado.',
    offline: 'No pudimos conectar con el servidor.',
    invalid: 'La respuesta del servidor no fue válida.',
    generic: 'Ocurrió un problema al cargar la información.',
  },
  en: {
    unauthorized: 'Your session expired. Please sign in again.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'We could not find the requested resource.',
    offline: 'We could not reach the server.',
    invalid: 'The server response was invalid.',
    generic: 'There was a problem loading the information.',
  },
  pt: {
    unauthorized: 'Sua sessão expirou. Entre novamente.',
    forbidden: 'Você não tem permissão para executar esta ação.',
    notFound: 'Não encontramos o recurso solicitado.',
    offline: 'Não foi possível conectar ao servidor.',
    invalid: 'A resposta do servidor era inválida.',
    generic: 'Houve um problema ao carregar as informações.',
  },
} as const;

export function formatApiErrorMessage(error: unknown, language: Language) {
  const localeMessages = messages[language];

  if (error instanceof ApiError) {
    if (error.reason) {
      return error.reason
        .replaceAll('_', ' ')
        .replace(/^./, (value) => value.toUpperCase());
    }

    if (error.status === 401) return localeMessages.unauthorized;
    if (error.status === 403) return localeMessages.forbidden;
    if (error.status === 404) return localeMessages.notFound;
    if (error.status >= 500) return localeMessages.offline;

    return error.detail || localeMessages.generic;
  }

  if (error instanceof Error && /contract validation failed/i.test(error.message)) {
    return localeMessages.invalid;
  }

  return localeMessages.generic;
}