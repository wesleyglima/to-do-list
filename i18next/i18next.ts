import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import es from "./locales/es";
import pt from "./locales/pt";

i18n.use(initReactI18next).init({
  fallbackLng: "pt",
  interpolation: {
    escapeValue: false,
  },
  lng: getLocales()[0]?.languageTag.split("-")[0],
  resources: {
    en,
    es,
    pt,
  },
});
