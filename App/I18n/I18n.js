// @flow

import I18n from "i18n-js";

// Enable fallbacks if you want `en-US` and `en-GB` to fallback to `en`
I18n.fallbacks = true;

I18n.active_locales = ['it', 'es', 'en', 'fr', 'de']

I18n.defaultLocale = 'it-IT';
// English language is the main language for fall back:
I18n.translations = {
  en: require('./Translations/en.json'),
  it: require('./Translations/it.json'),
  es: require('./Translations/es.json'),
  fr: require('./Translations/fr.json'),
  de: require('./Translations/de.json'),
};

