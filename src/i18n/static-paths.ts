import {
  isSecondaryLocale,
  secondaryLocales,
  type SecondaryLocale,
} from "./config.ts";

export function getSecondaryLocaleStaticPaths() {
  return secondaryLocales.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export function assertSecondaryLocale(value: string): SecondaryLocale {
  if (!isSecondaryLocale(value)) {
    throw new Error(`Unsupported secondary locale: ${value}`);
  }
  return value;
}
