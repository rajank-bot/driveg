/**
 * Initialize language settings
 * This can be extended to support i18n libraries
 */

export type SupportedLanguage = "en" | "es" | "fr" | "de" | "zh";

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";

export const initLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  try {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("app-language") as SupportedLanguage;
    if (savedLanguage) {
      return savedLanguage;
    }

    // Fall back to browser language
    const browserLanguage = navigator.language.split("-")[0] as SupportedLanguage;
    return browserLanguage || DEFAULT_LANGUAGE;
  } catch (error) {
    console.error("Error initializing language:", error);
    return DEFAULT_LANGUAGE;
  }
};

export const setLanguage = (language: SupportedLanguage): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("app-language", language);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  }
};

