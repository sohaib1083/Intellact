import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import Storage from '@react-native-async-storage/async-storage';
import React, {useCallback, useContext, useEffect, useState} from 'react';

import translations from '../constants/translations/';
import {ITranslate} from '../constants/types';

// Create a new i18n instance
const i18n = new I18n(translations);
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

export const TranslationContext = React.createContext({});

export const TranslationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState('en');

  // Set the locale for the i18n instance
  i18n.locale = locale;

  const t = useCallback(
    (scope: string | string[], options?: object) => {
      try {
        const result = i18n.translate(scope, {...options, locale});
        // Return empty string if translation is null, undefined, or empty
        return result || '';
      } catch (error) {
        console.warn(`Translation error for key "${scope}":`, error);
        return typeof scope === 'string' ? scope : Array.isArray(scope) ? scope.join('.') : '';
      }
    },
    [locale],
  );

  // get locale from storage
  const getLocale = useCallback(async () => {
    try {
      // get preference from storage
      const localeJSON = await Storage.getItem('locale');

      // set Locale / compare if has updated
      const deviceLocales = Localization.getLocales();
      const deviceLocale = deviceLocales && deviceLocales.length > 0 
        ? deviceLocales[0]?.languageCode || 'en' 
        : 'en';
      
      const targetLocale = localeJSON !== null ? localeJSON : deviceLocale;
      
      // Ensure we have a valid locale
      const validLocale = targetLocale && typeof targetLocale === 'string' ? targetLocale : 'en';
      
      setLocale(validLocale);
    } catch (error) {
      console.warn('Error getting locale:', error);
      setLocale('en'); // fallback to English
    }
  }, [setLocale]);

  useEffect(() => {
    getLocale();
  }, [getLocale]);

  useEffect(() => {
    // save preference to storage
    if (locale && typeof locale === 'string') {
      Storage.setItem('locale', locale).catch(error => {
        console.warn('Error saving locale to storage:', error);
      });
    }
  }, [locale]);

  const contextValue = {
    t,
    locale,
    setLocale,
    translate: t,
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
};

/*
 * useTranslation hook based on i18n-js
 * Source: https://github.com/fnando/i18n-js
 */
export const useTranslation = () =>
  useContext(TranslationContext) as ITranslate;
