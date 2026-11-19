/** Global UI state shared across header, menu, quiz and loader. */
export const useMenuOpen = () => useState<boolean>('menu-open', () => false)
export const useQuizOpen = () => useState<boolean>('quiz-open', () => false)
export const useSiteReady = () => useState<boolean>('site-ready', () => false)
export const useLanguage = () => useState<string>('lang', () => 'en')
