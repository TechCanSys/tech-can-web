import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Lang = 'pt' | 'en'
type Theme = 'dark' | 'light'

interface Prefs {
  lang: Lang
  theme: Theme
  setLang: (l: Lang) => void
  setTheme: (t: Theme) => void
  t: (pt: string, en: string) => string
}

const PrefsContext = createContext<Prefs>({ lang: 'pt', theme: 'dark', setLang: () => {}, setTheme: () => {}, t: (pt) => pt })

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')
  const [theme, setTheme] = useState<Theme>('dark')
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('tc-lang')
      const savedTheme = localStorage.getItem('tc-theme')
      if (savedLang === 'en' || savedLang === 'pt') setLang(savedLang)
      if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme)
    } catch { /* storage unavailable */ }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try { localStorage.setItem('tc-theme', theme) } catch { /* ignore */ }
  }, [theme])
  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-MZ'
    try { localStorage.setItem('tc-lang', lang) } catch { /* ignore */ }
  }, [lang])
  const t = (pt: string, en: string) => (lang === 'en' ? en : pt)
  return <PrefsContext.Provider value={{ lang, theme, setLang, setTheme, t }}>{children}</PrefsContext.Provider>
}

export const usePrefs = () => useContext(PrefsContext)
