import React, { createContext, useContext, useEffect, useState } from 'react';
import { translateText } from './translations.js';
const LanguageContext = createContext({ language: 'en', setLanguage: () => {} });
export function useLanguage() { return useContext(LanguageContext); }
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => { try { const requested = new URLSearchParams(location.search).get('lang'); if (requested === 'en' || requested === 'zh-Hant') return requested; return localStorage.getItem('ai-archive-language') === 'zh-Hant' ? 'zh-Hant' : 'en'; } catch { return 'en'; } });
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'zh-Hant' ? 'AI 檔案' : 'AI Archive';
    try { localStorage.setItem('ai-archive-language', language); } catch { /* A blocked store does not prevent switching. */ }
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
}
// Translate React text and accessible labels before rendering. Never rewrite the
// DOM, form values, IDs, source records, keys, URLs or event handlers.
function localizeNode(node, language) {
  if (typeof node === 'string') return translateText(node, language);
  if (Array.isArray(node)) return node.map(child => localizeNode(child, language));
  if (!React.isValidElement(node)) return node;
  if (typeof node.type !== 'string' && node.type !== React.Fragment) return node;
  if (['style','script','code'].includes(node.type)) return node;
  const props = {};
  if (node.type === 'a' && typeof node.props.href === 'string' && node.props.href.startsWith('./archive.html')) props.href = node.props.href.replace('./archive.html', './archive.zh-Hant.html');
  for (const key of ['aria-label', 'title', 'placeholder', 'alt']) if (typeof node.props[key] === 'string') props[key] = translateText(node.props[key], language);
  return React.cloneElement(node, props, localizeNode(node.props.children, language));
}
export function Localize({ children }) {
  const { language } = useLanguage();
  return language === 'en' ? children : localizeNode(children, language);
}
export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();
  return <div className="language-switch" role="group" aria-label={language === 'en' ? 'Language' : '語言'}><button type="button" lang="en" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>English</button><span aria-hidden="true">/</span><button type="button" lang="zh-Hant" aria-pressed={language === 'zh-Hant'} onClick={() => setLanguage('zh-Hant')}>繁體中文</button></div>;
}
