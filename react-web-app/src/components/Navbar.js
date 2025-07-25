import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import styled from 'styled-components';
import { FaGamepad, FaChartBar, FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes } from 'react-icons/fa';

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  font-weight: 700;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    flex-direction: column;
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding: 20px;
    gap: 15px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
  }
`;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <NavContainer>
      <NavContent>
        <LogoContainer to="/">
          <LogoIcon>
            <LogoImage src="/logo.svg" alt="TicTacToe Logo" />
          </LogoIcon>
          <LogoText>TicTacToe</LogoText>
        </LogoContainer>
        
        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/game">
                <FaGamepad />
                Play Game
              </NavLink>
              <NavLink to="/statistics">
                <FaChartBar />
                Statistics
              </NavLink>
              <UserSection>
                <UserInfo>
                  <FaUser />
                  {user?.name || user?.email}
                </UserInfo>
                <LogoutButton onClick={handleLogout}>
                  <FaSignOutAlt />
                  Logout
                </LogoutButton>
              </UserSection>
            </>
          ) : (
            <>
              <NavLink to="/login">
                <FaSignInAlt />
                Login
              </NavLink>
              <NavLink to="/register">
                <FaUserPlus />
                Register
              </NavLink>
            </>
          )}
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </MobileMenuButton>
      </NavContent>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        {isAuthenticated ? (
          <>
            <NavLink to="/game" onClick={() => setIsMobileMenuOpen(false)}>
              <FaGamepad />
              Play Game
            </NavLink>
            <NavLink to="/statistics" onClick={() => setIsMobileMenuOpen(false)}>
              <FaChartBar />
              Statistics
            </NavLink>
            <UserInfo>
              <FaUser />
              {user?.name || user?.email}
            </UserInfo>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Logout
            </LogoutButton>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <FaSignInAlt />
              Login
            </NavLink>
            <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUserPlus />
              Register
            </NavLink>
          </>
        )}
      </MobileMenu>
    </NavContainer>
  );
};

export default Navbar; 