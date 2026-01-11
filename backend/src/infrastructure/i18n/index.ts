import pt from "./pt.json" with { type: "json" };
import en from "./en.json" with { type: "json" };

type Translations = typeof pt;

export type TFunction = (key: string, params?: Record<string, any>) => string;

export function getTranslation(locale: string): TFunction {
  const translations: Record<string, Translations> = { pt, en };
  const translation = translations[locale] || translations["en"];

  return (key: string, params?: Record<string, any>): string => {
    const keys = key.split(".");
    let value: any = translation;

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== "string") {
      return key;
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || "";
      });
    }

    return value;
  };
}