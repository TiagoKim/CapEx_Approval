import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { LogOut, Home, FileText, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  text-decoration: none;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const UserName = styled.span`
  font-weight: 600;
  font-size: 0.9rem;
`;

const UserRole = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileNav = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;

  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  color: #333;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active {
    background-color: #e3f2fd;
    color: #1976d2;
  }
`;

/**
 * Header Component
 * 네비게이션 및 사용자 정보 표시
 */
function Header({ user, isAuthenticated, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { t, currentLanguage, changeLanguage } = useLanguage();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (!isAuthenticated) {
    return (
      <HeaderContainer>
        <HeaderContent>
          <Logo>CapEx Approval System</Logo>
          <div></div>
        </HeaderContent>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo as={Link} to="/">
          CapEx Approval System
        </Logo>

        <Nav>
          <NavLink 
            to="/form" 
            className={isActive('/form') ? 'active' : ''}
          >
            <FileText size={18} />
            {t('nav.investmentRequest')}
          </NavLink>

          <NavLink 
            to="/list" 
            className={isActive('/list') ? 'active' : ''}
          >
            <Home size={18} />
            {t('nav.investmentList')}
          </NavLink>

          {user?.isAdmin && (
            <NavLink 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              <BarChart3 size={18} />
              {t('nav.dashboard')}
            </NavLink>
          )}
        </Nav>

        <UserInfo>
          <LanguageSelector 
            currentLanguage={currentLanguage} 
            onLanguageChange={changeLanguage} 
          />
          
          <UserDetails>
            <UserName>{user?.name || t('common.user')}</UserName>
            <UserRole>
              {user?.isAdmin ? t('common.admin') : t('common.generalUser')}
            </UserRole>
          </UserDetails>
          
          <LogoutButton onClick={onLogout}>
            <LogOut size={18} />
            {t('auth.logout')}
          </LogoutButton>

          <MobileMenuButton onClick={toggleMobileMenu}>
            ☰
          </MobileMenuButton>
        </UserInfo>
      </HeaderContent>

      <MobileNav isOpen={mobileMenuOpen}>
        <MobileNavLink 
          to="/form" 
          className={isActive('/form') ? 'active' : ''}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('nav.investmentRequest')}
        </MobileNavLink>

        <MobileNavLink 
          to="/list" 
          className={isActive('/list') ? 'active' : ''}
          onClick={() => setMobileMenuOpen(false)}
        >
          {t('nav.investmentList')}
        </MobileNavLink>

        {user?.isAdmin && (
          <MobileNavLink 
            to="/dashboard" 
            className={isActive('/dashboard') ? 'active' : ''}
            onClick={() => setMobileMenuOpen(false)}
          >
            {t('nav.dashboard')}
          </MobileNavLink>
        )}
      </MobileNav>
    </HeaderContainer>
  );
}

export default Header;
