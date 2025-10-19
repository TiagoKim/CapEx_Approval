import React from 'react';
import styled from 'styled-components';
import { Globe } from 'lucide-react';

const LanguageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 120px;
  overflow: hidden;
  margin-top: 0.5rem;
`;

const LanguageOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: white;
  border: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #667eea;
    color: white;
  }
`;

const Flag = styled.span`
  font-size: 1.2rem;
`;

/**
 * LanguageSelector Component
 * 언어 선택 드롭다운
 */
function LanguageSelector({ currentLanguage, onLanguageChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const languages = [
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <LanguageContainer>
      <LanguageButton onClick={() => setIsOpen(!isOpen)}>
        <Globe size={16} />
        <Flag>{currentLang.flag}</Flag>
        {currentLang.name}
      </LanguageButton>
      
      {isOpen && (
        <LanguageDropdown>
          {languages.map((language) => (
            <LanguageOption
              key={language.code}
              className={currentLanguage === language.code ? 'active' : ''}
              onClick={() => handleLanguageSelect(language.code)}
            >
              <Flag>{language.flag}</Flag>
              {language.name}
            </LanguageOption>
          ))}
        </LanguageDropdown>
      )}
    </LanguageContainer>
  );
}

export default LanguageSelector;
