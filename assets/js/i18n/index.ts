/**
 * JS I18n module — runtime translations for strings used only in JavaScript.
 *
 * Each language is a separate file (e.g. `en.ts`, `zh-CN.ts`) exporting a
 * `Translations` object. Language codes match Hugo's I18n file names and
 * `document.documentElement.lang`.
 *
 * Only for strings that cannot be passed via Hugo templates (e.g. `data-*`
 * attributes or `window.config`). Strings already available through Hugo's
 * `T` function and rendered as HTML attributes should stay in `i18n/*.toml`.
 *
 * To add a new language: create `<lang>.ts`, import it here, and add to the
 * `translations` map. To add a new key: add it to `Translations` interface
 * and to every language file.
 */
import ar from './ar'
import de from './de'
import en from './en'
import es from './es'
import fa from './fa'
import fr from './fr'
import hi from './hi'
import it from './it'
import ja from './ja'
import ko from './ko'
import pl from './pl'
import ptBR from './pt-BR'
import ro from './ro'
import ru from './ru'
import sr from './sr'
import ur from './ur'
import vi from './vi'
import zhCN from './zh-CN'
import zhTW from './zh-TW'

/** All translatable string keys used in JavaScript. */
export interface Translations {
  decryptionFailed: string
  enterCorrectPassword: string
  passwordIncorrect: string
  passwordExpired: string
}

const translations: Record<string, Translations> = {
  'ar': ar,
  'de': de,
  'en': en,
  'es': es,
  'fa': fa,
  'fr': fr,
  'hi': hi,
  'it': it,
  'ja': ja,
  'ko': ko,
  'pl': pl,
  'pt-BR': ptBR,
  'ro': ro,
  'ru': ru,
  'sr': sr,
  'ur': ur,
  'vi': vi,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
}

/**
 * Get a translated string by key, falling back to English.
 * @param key - The translation key.
 */
export function t(key: keyof Translations): string {
  const lang = document.documentElement.lang
  return translations[lang]?.[key] ?? translations.en[key]
}
