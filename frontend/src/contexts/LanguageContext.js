import React, { createContext, useContext, useState, useEffect } from 'react';

// 언어 파일 import
import ko from '../locales/ko';
import en from '../locales/en';
import zh from '../locales/zh';

const LanguageContext = createContext();

const languages = {
  ko: { name: '한국어', flag: '🇰🇷', data: ko },
  en: { name: 'English', flag: '🇺🇸', data: en },
  zh: { name: '中文', flag: '🇨🇳', data: zh }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ko');

  // 로컬 스토리지에서 언어 설정 불러오기
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languages[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // 언어 변경 함수
  const changeLanguage = (languageCode) => {
    if (languages[languageCode]) {
      setCurrentLanguage(languageCode);
      localStorage.setItem('language', languageCode);
    }
  };

  // 현재 언어의 텍스트 데이터 가져오기
  const t = (key) => {
    const keys = key.split('.');
    let value = languages[currentLanguage].data;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 키를 찾을 수 없으면 한국어로 fallback
        value = languages.ko.data;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // 최종적으로 키 자체를 반환
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    languages: Object.keys(languages).map(code => ({
      code,
      name: languages[code].name,
      flag: languages[code].flag
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
