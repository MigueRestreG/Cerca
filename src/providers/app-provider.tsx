import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { createTranslator, detectInitialLanguage, type Language } from '@/i18n';

type AppContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => detectInitialLanguage());
  const translator = useMemo(() => createTranslator(language), [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: translator,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }

  return context;
}
